<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="min-w-full w-max max-w-full overflow-x-auto">
      <div class="flex justify-between items-center flex-wrap mb-4 gap-2">
        <p class="heading-1 !mb-0">Dọn sub_category sản phẩm</p>
      </div>

      <p class="text-gray-500 mb-4">
        Tìm sản phẩm theo danh mục + danh mục con, xem lại danh sách rồi mới bấm xóa. Xóa xong tự
        tìm lại trang 1 để kiểm tra còn sót sản phẩm nào không.
      </p>

      <div class="flex items-end gap-2 flex-wrap mb-4">
        <div>
          <p class="!mb-1 font-medium">Danh mục</p>
          <c-select-search
            v-model:value="categoryId"
            placeholder="Chọn danh mục"
            :search="selectDataStore.searchCategoryList"
            default-data="category"
          />
        </div>
        <div>
          <p class="!mb-1 font-medium">Danh mục con</p>
          <c-select-search
            v-model:value="subCategoryId"
            placeholder="Chọn danh mục con"
            :search="selectDataStore.searchCategoryList"
            default-data="category"
          />
        </div>
        <div>
          <p class="!mb-1 font-medium">per-page</p>
          <a-input-number v-model:value="perPage" :min="1" :max="100" class="!w-[120px]" />
        </div>
        <a-button type="primary" :loading="searching" @click="handleSearch">Tìm sản phẩm</a-button>
      </div>

      <p v-if="hasSearched" class="text-gray-500 mb-2">
        Khớp {{ products.length }} sản phẩm{{
          meta?.totalCount != null ? ` (server báo tổng ${meta.totalCount})` : ''
        }}.
        <span v-if="mismatchCount > 0" class="text-error">
          Đã bỏ qua {{ mismatchCount }} sản phẩm trả về không khớp đúng category_id/sub_category_id.
        </span>
      </p>

      <a-table
        v-if="products.length"
        :columns="columns"
        :data-source="products"
        :pagination="false"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'category'">{{ record.category?.name || '' }}</template>
          <template v-else-if="column.key === 'sub_category'">{{
            record.sub_category?.name || ''
          }}</template>
        </template>
      </a-table>
      <a-empty
        v-else-if="hasSearched"
        description="Không tìm thấy sản phẩm nào khớp category_id/sub_category_id này"
      />

      <div class="flex items-center gap-2 mt-4" v-if="products.length">
        <a-button
          danger
          type="primary"
          :loading="applying"
          :disabled="!selectedRowKeys.length"
          @click="handleApply"
        >
          Xóa sub_category cho {{ selectedRowKeys.length }} sản phẩm đã chọn
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { handle_error, handle_success } from '@/utils/message'
import type { PRODUCT_RESPONSE } from '@/types/product/product'

//PINIA
import { useProductStore } from '@/stores/product'
import { useRootStore } from '@/stores/root'
import { useSelectDataStore } from '@/stores/select_data'

//COMPONENTS
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

const productStore = useProductStore()
const rootStore = useRootStore()
const selectDataStore = useSelectDataStore()
const { getProductList, updateProductItem } = productStore

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
  { title: 'Danh mục', key: 'category' },
  { title: 'Danh mục con', key: 'sub_category' }
]

const categoryId = ref<number | null>(null)
const subCategoryId = ref<number | null>(null)
const perPage = ref<number>(20)

const products = ref<PRODUCT_RESPONSE[]>([])
const selectedRowKeys = ref<number[]>([])
const meta = ref<MetaResponse | null>(null)
const mismatchCount = ref(0)
const hasSearched = ref(false)
const searching = ref(false)
const applying = ref(false)

const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys
}

const handleSearch = async () => {
  if (!categoryId.value || !subCategoryId.value) {
    handle_error('Nhập category_id và sub_category_id trước')
    return
  }
  searching.value = true
  try {
    const res = await getProductList({
      category_id: categoryId.value,
      sub_category_id: subCategoryId.value,
      page: 1,
      'per-page': perPage.value
    })
    const items = res.items || []
    // Server có thể không thực sự lọc theo 2 param này -> luôn tự check lại trước khi cho xóa.
    const matched = items.filter(
      (p) => p.category?.id === categoryId.value && p.sub_category?.id === subCategoryId.value
    )
    mismatchCount.value = items.length - matched.length
    products.value = matched
    selectedRowKeys.value = matched
      .map((p) => p.id)
      .filter((id): id is number => id != null)
    meta.value = res._meta
    hasSearched.value = true
  } catch (error) {
    handle_error(error)
  } finally {
    searching.value = false
  }
}

const handleApply = async () => {
  if (!selectedRowKeys.value.length) return
  const ids = [...selectedRowKeys.value]
  try {
    await rootStore.confirm({
      bodyTitle: 'Xóa sub_category',
      bodyMessage: `Bạn có chắc chắn muốn xóa sub_category của ${ids.length} sản phẩm đã chọn không? Đây là dữ liệu thật, không hoàn tác được.`,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    })
  } catch (error) {
    return
  }

  applying.value = true
  try {
    for (const id of ids) {
      await updateProductItem(id, { sub_category_id: null })
    }
    handle_success(`Đã xóa sub_category của ${ids.length} sản phẩm`)
    await handleSearch()
  } catch (error) {
    handle_error(error)
  } finally {
    applying.value = false
  }
}
</script>
