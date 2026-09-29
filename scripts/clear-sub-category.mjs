#!/usr/bin/env node
// Xoá sub_category_id khỏi tất cả sản phẩm đang có category_id=<cat> và sub_category_id=<sub>.
// Mặc định chạy DRY-RUN (chỉ liệt kê, không sửa gì). Thêm --apply để thực sự PATCH.
//
// Dùng:
//   node scripts/clear-sub-category.mjs --email=a@b.com --password=*** [--apply]
//   node scripts/clear-sub-category.mjs --token=<bearer-token> [--apply]
//
// Tuỳ chọn:
//   --base-url        mặc định lấy từ .env (VITE_API)
//   --category-id      mặc định 55
//   --sub-category-id  mặc định 62
//   --per-page         mặc định 20
//   --max-iterations   mặc định 50 (chặn vòng lặp vô hạn nếu filter không hoạt động)
//   --apply            thực sự ghi dữ liệu (không có cờ này = dry-run)

import { readFileSync } from 'node:fs'

function parseArgs(argv) {
  const out = {}
  for (const raw of argv) {
    if (!raw.startsWith('--')) continue
    const [key, ...rest] = raw.slice(2).split('=')
    out[key] = rest.length ? rest.join('=') : true
  }
  return out
}

function loadEnvDefault(key) {
  try {
    const content = readFileSync(new URL('../.env', import.meta.url), 'utf-8')
    const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'))
    return match ? match[1].trim() : undefined
  } catch {
    return undefined
  }
}

const args = parseArgs(process.argv.slice(2))

const BASE_URL = (args['base-url'] || loadEnvDefault('VITE_API') || '').replace(/\/+$/, '')
const CATEGORY_ID = Number(args['category-id'] ?? 55)
const SUB_CATEGORY_ID = Number(args['sub-category-id'] ?? 62)
const PER_PAGE = Number(args['per-page'] ?? 20)
const MAX_ITERATIONS = Number(args['max-iterations'] ?? 50)
const APPLY = Boolean(args['apply'])

if (!BASE_URL) {
  console.error('Thiếu base URL. Truyền --base-url=https://... hoặc đảm bảo .env có VITE_API.')
  process.exit(1)
}

let token = typeof args['token'] === 'string' ? args['token'] : ''

async function apiRequest(path, { method = 'GET', params, body } = {}) {
  const url = new URL(BASE_URL + path)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
    }
  }
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  })
  let json
  try {
    json = await res.json()
  } catch {
    throw new Error(`${method} ${path} -> HTTP ${res.status}, response không phải JSON`)
  }
  if (json?.status === true) return json.data
  if (json?.status === undefined) return json
  const message = json?.message || json?.messages || `HTTP ${res.status}`
  throw new Error(`${method} ${path} thất bại: ${JSON.stringify(message)}`)
}

async function login(email, password) {
  const data = await apiRequest('/api/v1/admin/services/auth/login?expand=role', {
    method: 'POST',
    body: { email, password }
  })
  if (!data?.token) throw new Error('Login không trả về token.')
  return data.token
}

async function fetchPage() {
  return apiRequest('/api/v1/admin/product/item', {
    params: {
      category_id: CATEGORY_ID,
      sub_category_id: SUB_CATEGORY_ID,
      page: 1,
      'per-page': PER_PAGE
    }
  })
}

async function clearSubCategory(productId) {
  return apiRequest(`/api/v1/admin/product/item/update?id=${productId}`, {
    method: 'POST',
    body: { sub_category_id: null }
  })
}

async function main() {
  if (!token) {
    const email = args['email']
    const password = args['password']
    if (!email || !password) {
      console.error('Cần --token=<bearer-token> HOẶC cả --email và --password để đăng nhập.')
      process.exit(1)
    }
    console.log(`Đăng nhập ${email}...`)
    token = await login(String(email), String(password))
    console.log('Đăng nhập OK.')
  }

  console.log(
    `Base URL: ${BASE_URL}\nLọc: category_id=${CATEGORY_ID}, sub_category_id=${SUB_CATEGORY_ID}\nChế độ: ${APPLY ? 'APPLY (sẽ ghi dữ liệu thật)' : 'DRY-RUN (chỉ xem trước, không ghi)'}\n`
  )

  let totalCleared = 0
  let iteration = 0
  let previousBatchIds = null

  while (iteration < MAX_ITERATIONS) {
    iteration += 1
    const page = await fetchPage()
    const items = page?.items ?? []

    if (items.length === 0) {
      console.log(`[vòng ${iteration}] Không còn sản phẩm nào khớp filter. Xong.`)
      break
    }

    // Chỉ xử lý sản phẩm thực sự khớp cả 2 điều kiện, phòng trường hợp API bỏ qua param lọc.
    const matched = items.filter(
      (p) => p?.category?.id === CATEGORY_ID && p?.sub_category?.id === SUB_CATEGORY_ID
    )
    const mismatched = items.length - matched.length
    if (mismatched > 0) {
      console.warn(
        `[vòng ${iteration}] Cảnh báo: ${mismatched}/${items.length} sản phẩm trả về không khớp category_id/sub_category_id -> bỏ qua (server có thể không hỗ trợ lọc theo param này).`
      )
    }

    if (matched.length === 0) {
      console.log(`[vòng ${iteration}] Không có sản phẩm nào khớp thật sự trong trang này. Dừng.`)
      break
    }

    const currentIds = matched.map((p) => p.id).sort().join(',')
    if (currentIds === previousBatchIds) {
      console.error(
        `[vòng ${iteration}] Danh sách trả về giống hệt vòng trước (${matched.length} sản phẩm) dù đã xử lý -> có thể update không có tác dụng hoặc filter luôn trả cùng 1 trang. Dừng để tránh vòng lặp vô hạn.`
      )
      break
    }

    console.log(`[vòng ${iteration}] Tìm thấy ${matched.length} sản phẩm khớp:`)
    for (const p of matched) console.log(`  - #${p.id} ${p.name ?? ''}`)

    if (!APPLY) {
      console.log('  (dry-run, không ghi gì. Thêm --apply để thực sự xoá sub_category.)')
      break
    }

    for (const p of matched) {
      await clearSubCategory(p.id)
      totalCleared += 1
      console.log(`  -> đã xoá sub_category của #${p.id}`)
    }

    previousBatchIds = currentIds
  }

  if (iteration >= MAX_ITERATIONS) {
    console.error(`Đã chạm giới hạn ${MAX_ITERATIONS} vòng lặp, dừng để an toàn.`)
  }

  console.log(`\nTổng số sản phẩm đã xoá sub_category: ${totalCleared}`)
}

main().catch((err) => {
  console.error('Lỗi:', err?.message || err)
  process.exit(1)
})
