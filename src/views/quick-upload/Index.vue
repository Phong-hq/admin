<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="min-w-full w-max max-w-full overflow-x-auto">
      <div class="flex justify-between items-center flex-wrap mb-4 gap-2">
        <p class="heading-1 !mb-0">Tải hình nhanh</p>
        <div class="flex items-center gap-2">
          <input
            ref="fileInputRef"
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp"
            class="hidden"
            @change="handleFileChange"
          />
          <a-button
            type="primary"
            :loading="uploading"
            :disabled="images.length > 0"
            @click="fileInputRef?.click()"
          >
            <template #icon><upload-outlined /></template>
            Chọn hình để upload
          </a-button>
          <a-button danger :disabled="!images.length" @click="handleClearAll">
            Xóa tất cả
          </a-button>
        </div>
      </div>

      <p v-if="images.length" class="text-gray-500 mb-4">
        Đang có {{ images.length }} hình trong danh sách. Bấm "Xóa tất cả" để upload đợt hình mới.
      </p>

      <div
        v-if="selectedRowKeys.length"
        class="mb-4 p-4 rounded-[10px] bg-gray-50 flex flex-col gap-2"
      >
        <p class="!mb-0 font-medium">Link đã chọn ({{ selectedRowKeys.length }}):</p>
        <div class="flex items-start gap-2">
          <a-textarea :value="selectedLinksText" readonly :auto-size="{ minRows: 2, maxRows: 4 }" />
          <a-button @click="handleCopy">
            <template #icon><copy-outlined /></template>
            Copy
          </a-button>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <c-select-search
            class="!w-[300px]"
            v-model:value="productId"
            default-data="product"
            placeholder="Chọn sản phẩm để gán hình"
          />
          <a-button
            type="primary"
            :loading="submitting"
            :disabled="!productId || loadingProduct"
            @click="handleSubmit"
          >
            Gán hình cho sản phẩm
          </a-button>
        </div>

        <a-spin :spinning="loadingProduct">
          <div v-if="productId" class="flex flex-col gap-4 mt-2">
            <div>
              <p class="!mb-1 font-medium">specs</p>
              <c-editor v-model="specsValue" />
            </div>
            <div>
              <p class="!mb-1 font-medium">info</p>
              <c-editor v-model="infoValue" />
            </div>
          </div>
        </a-spin>
      </div>

      <a-table
        v-if="images.length"
        :columns="columns"
        :data-source="images"
        :pagination="false"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        row-key="url"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <img :src="record.url" class="w-12 h-12 object-cover rounded" alt="" />
          </template>
          <template v-else-if="column.key === 'url'">
            <a :href="record.url" target="_blank" rel="noopener" class="break-all">{{
              record.url
            }}</a>
          </template>
        </template>
      </a-table>
      <a-empty v-else description="Chưa có hình nào, chọn hình để bắt đầu" />

      <a-divider />

      <p class="heading-1 !mb-2">Soạn nội dung HTML (copy vào file excel import)</p>
      <c-editor v-model="htmlScratchValue" />
      <div class="flex items-start gap-2 mt-2">
        <a-textarea
          :value="htmlScratchValue"
          readonly
          :auto-size="{ minRows: 3, maxRows: 8 }"
          placeholder="Nội dung HTML sẽ hiện ở đây"
        />
        <a-button :disabled="!htmlScratchValue" @click="handleCopyHtml">
          <template #icon><copy-outlined /></template>
          Copy
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { UploadOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { handle_error, handle_success } from '@/utils/message'
import { uploadFile } from '@/utils/file-helper'
import type { PRODUCT_RESPONSE } from '@/types/product/product'

//PINIA
import { useProductStore } from '@/stores/product'
import { useRootStore } from '@/stores/root'

//COMPONENTS
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import CEditor from '@/components/common/editor/CEditor.vue'

const ADDITIONAL_DATA_KEYS = ['specs', 'info'] as const

type UploadedImage = {
  url: string
  delete_url?: string
}

const STORAGE_KEY = 'quick-upload-images'

const loadFromStorage = (): UploadedImage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    console.log(error)
    return []
  }
}

const productStore = useProductStore()
const rootStore = useRootStore()
const { getProductItem, updateProductItem } = productStore

const columns = [
  { title: '', key: 'image', width: 80 },
  { title: 'Link', dataIndex: 'url', key: 'url' }
]

const fileInputRef = ref<HTMLInputElement | null>(null)
const images = ref<UploadedImage[]>(loadFromStorage())
const selectedRowKeys = ref<string[]>([])
const uploading = ref(false)
const submitting = ref(false)
const productId = ref<number | null>(null)
const loadingProduct = ref(false)
const currentProduct = ref<PRODUCT_RESPONSE | null>(null)
const specsValue = ref('')
const infoValue = ref('')
const htmlScratchValue = ref('')

watch(productId, async (id) => {
  currentProduct.value = null
  specsValue.value = ''
  infoValue.value = ''
  if (!id) return
  loadingProduct.value = true
  try {
    const product = await getProductItem(id)
    currentProduct.value = product
    specsValue.value = product?.additional_data?.find((e) => e.name === 'specs')?.value || ''
    infoValue.value = product?.additional_data?.find((e) => e.name === 'info')?.value || ''
  } catch (error) {
    handle_error(error)
  } finally {
    loadingProduct.value = false
  }
})

watch(
  images,
  (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch (error) {
      console.log(error)
    }
  },
  { deep: true }
)

const selectedLinksText = computed(() => selectedRowKeys.value.join(','))

const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files ? Array.from(target.files) : []
  target.value = ''
  if (!files.length) return

  uploading.value = true
  try {
    const results = await Promise.allSettled(files.map((file) => uploadFile(file)))
    const uploaded: UploadedImage[] = []
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value?.url) {
        uploaded.push({ url: result.value.url, delete_url: result.value.delete_url })
      }
    })
    if (uploaded.length) {
      images.value = [...images.value, ...uploaded]
      handle_success(`Đã upload ${uploaded.length} hình`)
    }
    const failed = results.length - uploaded.length
    if (failed > 0) handle_error(`${failed} hình upload thất bại`)
  } finally {
    uploading.value = false
  }
}

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(selectedLinksText.value)
    handle_success('Đã copy link')
  } catch (error) {
    handle_error('Copy thất bại')
  }
}

const handleCopyHtml = async () => {
  try {
    await navigator.clipboard.writeText(htmlScratchValue.value)
    handle_success('Đã copy HTML')
  } catch (error) {
    handle_error('Copy thất bại')
  }
}

const handleClearAll = async () => {
  try {
    await rootStore.confirm({
      bodyTitle: 'Xóa tất cả hình',
      bodyMessage:
        'Bạn có chắc chắn muốn xóa tất cả hình trong danh sách này không? Hình đã upload lên server sẽ không bị xóa, chỉ xóa khỏi danh sách này.',
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    })
    images.value = []
    selectedRowKeys.value = []
    productId.value = null
  } catch (error) {
    // user cancelled
  }
}

const buildAdditionalData = () => {
  const base = currentProduct.value?.additional_data ? [...currentProduct.value.additional_data] : []
  const values: Record<(typeof ADDITIONAL_DATA_KEYS)[number], string> = {
    specs: specsValue.value,
    info: infoValue.value
  }
  ADDITIONAL_DATA_KEYS.forEach((key) => {
    const index = base.findIndex((e) => e.name === key)
    const entry = { name: key, value: values[key] }
    if (index > -1) base[index] = entry
    else base.push(entry)
  })
  return base
}

const handleSubmit = async () => {
  if (!productId.value || !selectedRowKeys.value.length || !currentProduct.value) return
  submitting.value = true
  try {
    const merged = Array.from(
      new Set([...(currentProduct.value.images || []), ...selectedRowKeys.value])
    )
    await updateProductItem(productId.value, {
      images: merged,
      additional_data: buildAdditionalData()
    })
    handle_success('Đã cập nhật sản phẩm')

    const assigned = new Set(selectedRowKeys.value)
    images.value = images.value.filter((img) => !assigned.has(img.url))
    selectedRowKeys.value = []
    productId.value = null
  } catch (error) {
    handle_error(error)
  } finally {
    submitting.value = false
  }
}
</script>
