<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="min-w-full w-max max-w-full overflow-x-auto">
      <div class="flex justify-between items-center flex-wrap mb-2 gap-2">
        <p class="heading-1 !mb-0 sm:w-auto w-full">Sản phẩm</p>
        <div class="sm:flex sm:justify-end grid grid-cols-1 gap-2 sm:w-auto w-full">
          <export-button :action="exportProduct" name="sản-phẩm" />
          <a-button type="primary" @click="router.push({ name: 'product-create' })">
            <template #icon>
              <plus-outlined />
            </template>
            Thêm sản phẩm
          </a-button>
        </div>
      </div>
      <c-table-ant
        :columns="columns2"
        :data="productData"
        :meta="productMeta"
        primary-key="id"
        expand-column
        expand-title="test"
        :loading="tableLoading"
        @get-data="initData"
        @start-edit-row="handleStartEditRow"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'images'">
            <img class="w-[40px] h-[40px] mx-auto" :src="`${text}`" alt="" v-if="text" />
          </template>
          <template v-else-if="column.key == 'supplier_name'">
            <div class="flex gap-y-2 flex-wrap">
              <a-tag v-for="item in record.suppliers" :key="item.id">{{ item.name }}</a-tag>
            </div>
          </template>
          <template v-else-if="column.key == 'allow_sell'">
            <box-active class="mx-auto" :value="record.allow_sell" />
          </template>
          <template v-else-if="column.key == 'unit_price' || column.key == 'sll_price'">
            {{ currency(text) }}
          </template>
          <template v-else-if="column.key == 'action'">
            <box-action @edit="goToEditPage(record.id)" @remove="handleRemoveProduct(record)" />
            <!-- <a-space>
              <edit-outlined
                class="text-lg text-blue cursor-auto"
                @click="goToEditPage(record.id)"
              />
              <delete-outlined class="text-lg text-blue cursor-auto" />
            </a-space> -->
          </template>
        </template>

        <template #editableBox="{ key, id }">
          <template v-if="key == 'category' && editableRow[id]">
            <c-select-search
              class="!w-full"
              v-model:value="editableRow[id][key]"
              default-data="category"
              :search="selectDataStore.searchCategoryList"
            ></c-select-search>
          </template>
          <template v-else-if="key == 'brand' && editableRow[id]">
            <c-select-search
              class="!w-full"
              v-model:value="editableRow[id][key]"
              default-data="brand"
              :search="selectDataStore.searchBrandList"
            ></c-select-search>
          </template>
          <template v-else-if="key == 'suppliers'">
            <c-select-search
              class="!w-full"
              v-model:value="editableRow[id][key]"
              default-data="supplier"
              mode="multiple"
              :search="selectDataStore.searchSupplierList"
            ></c-select-search>
          </template>
        </template>

        <template #expandedRowRender="{ record }">
          <div class="w-full py-4">
            <c-table-ant
              :columns="columns3"
              :data="record.product_variants"
              primary-key="id"
              :pagination="false"
            >
              <template #bodyCell="{ text, column }">
                <template v-if="column.key == 'images'">
                  <img class="w-[40px] h-[40px] mx-auto" :src="`${text}`" alt="" />
                </template>
                <template v-else-if="column.key == 'sll_price' || column.key == 'unit_price'">
                  <p class="">{{ currency(text) }}</p>
                </template>
                <template v-else-if="column.key == 'action'">
                  <box-action @edit="showUpdateVariant(record, record.id)" />
                </template>
              </template>
            </c-table-ant>
            <div class="flex-center">
              <a-button class="w-[200px mt-4 mx-auto" type="primary">Thêm sản phẩm</a-button>
            </div>
          </div>
        </template>
      </c-table-ant>
    </div>
  </div>
  <update-variant-modal @get-data="initData" ref="updateVariantModalRef" />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileExcelOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { handle_error } from '@/utils/message'
import { currency } from '@/utils/currency'
//PINIA
import { useProductStore } from '@/stores/product'
import { useSelectDataStore } from '@/stores/select_data'
import { useRootStore } from '@/stores/root'

//COMPONENTS
import CSelect from '@/components/common/select/CSelect.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import UpdateVariantModal from '@/views/product/action/UpdateVariantModal.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import ExportButton from '@/components/common/button/ExportButton.vue'

const productStore = useProductStore()
const rootStore = useRootStore()
const selectDataStore = useSelectDataStore()
const router = useRouter()

const { getProductList, deleteProductItem, exportProduct } = productStore
const { confirm } = rootStore

const productData = computed(() => productStore.productList)
const productMeta = computed(() => productStore.productMeta)
const selectList = computed(() => selectDataStore.selectList)

const columns2 = [
  {
    title: 'Hình ảnh',
    key: {
      name: 'images',
      value: 'images,0',
      label: 'images,0'
    },
    inputProps: { inputType: 'image' },
    width: 'sm'
  },
  {
    title: 'Tên sản phẩm',
    key: {
      name: 'product_name',
      value: 'name',
      label: 'name'
    },
    isFilter: true,
    align: 'left',
    inputProps: { inputType: 'text' }
  },
  {
    title: 'Nhà cung cấp',
    key: 'supplier_name',
    fixed: true,
    isFilter: true,
    inputProps: {
      inputType: 'text'
    },
    width: 'xl'
  },
  {
    title: 'Nhãn hiệu',
    key: {
      name: 'brand_name',
      value: 'brand,id',
      label: 'brand,name'
    },
    isFilter: true,
    inputProps: {
      inputType: 'text'
    },
    width: 'xl'
  },
  {
    title: 'Danh mục sản phẩm',
    key: {
      name: 'category_name',
      value: 'category,id',
      label: 'category,name'
    },
    isFilter: true,
    inputProps: { inputType: 'text' },
    width: 'xl'
  },
  {
    title: 'Mã SKU',
    key: 'sku',
    isFilter: true,
    inputProps: { inputType: 'text' },
    hidden: true,
    width: 'md'
  },
  {
    title: 'Mã barcode',
    key: 'barcode',
    isFilter: true,
    inputProps: { inputType: 'text' },
    hidden: true,
    width: 'md'
  },
  { title: 'Giá lẻ', key: 'unit_price', sorter: true, hidden: true, align: 'right', width: 'md' },
  { title: 'Giá sỉ', key: 'sll_price', sorter: true, hidden: true, align: 'right', width: 'md' },

  {
    title: 'Có thể bán',
    key: 'allow_sell',
    sorter: true,
    align: 'center',
    width: 150
  },
  { title: '-', key: 'action', align: 'center', width: 50, noResizable: true }
] as COLUMN_TYPE[]

const columns3 = [
  {
    title: 'Hình ảnh',
    key: {
      name: 'images',
      value: 'images,0',
      label: 'images,0'
    },
    width: 'sm'
  },
  { title: 'Tên sản phẩm', key: 'name',  align: 'left', },
  { title: 'Mã SKU', key: 'sku', width: 'md' },
  { title: 'Số lượng', key: 'quantity', align: 'right', width: 'md' },
  { title: 'Giá sỉ', key: 'sll_price', align: 'right', width: 'md' },
  { title: 'Đơn giá', key: 'unit_price', align: 'right', width: 'md' },
  { title: '-', key: 'action', align: 'center' }
] as COLUMN_TYPE[]

onMounted(() => {
  selectDataStore.getBrandList()
  selectDataStore.getCategoryList()
  selectDataStore.getSupplierList()
  initData()
})

const tableLoading = ref(false)
const editableRow = ref<any>({})
const updateVariantModalRef = ref<InstanceType<typeof UpdateVariantModal> | null>(null)

const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    await getProductList(param)
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const handleStartEditRow = (id: any) => {
  const product = productData.value.find((e) => e.id == id)
  if (product) {
    editableRow.value[id] = {
      category: product.category?.id,
      brand: product.brand?.id,
      suppliers: product.suppliers?.map((supplier) => supplier.id)
    }
  }
}

const goToEditPage = (id: any) => {
  router.push({ name: 'product-detail', params: { id: id } })
}

const handleRemoveProduct = async (data: any) => {
  try {
    console.log(data)

    tableLoading.value = true
    await rootStore.confirm({
      bodyTitle: 'Xóa sản phẩm',
      bodyMessage: `Bạn có chắc chắn muốn xóa sản phẩm <span class="font-bold">${data?.name}</span> không?`,
      confirmButtonText: 'Có',
      cancelButtonText: 'không'
    })
    await deleteProductItem(data?.id)
    await initData()
  } catch (error) {
    handle_error(error)
    tableLoading.value = false
  }
}

const showUpdateVariant = (product: any, id: any) => {
  updateVariantModalRef.value?.show(product, id)
}
</script>
