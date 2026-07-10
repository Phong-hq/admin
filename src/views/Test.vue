<template>
  <div class="w-full">
    <c-table
      :data="productData"
      checkbox-column
      :columns="columns"
      :cell-height="58"
      :loading="loading"
      data-key="test"
    />
    <div class="w-full">
      <!-- <c-table-ant :columns="columns2" :data-source="data2" bordered>
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'action'">
            <div class="flex-center">
              <a-button type="primary">Ok</a-button>
            </div>
          </template>
        </template>
      </c-table-ant> -->
      <img src="" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import 'frappe-datatable/dist/frappe-datatable.min.css'
import '@/style/_frappe_table.scss'
// import DataTable from 'frappe-datatable'
import { createElement } from '@/utils/frappe-helper'
import CTable from '@/components/common/table/CTableFrappe.vue'
import CTableAnt from '@/components/common/table/CTable.vue'

//PINIA
import { useProductStore } from '@/stores/product'

const productStore = useProductStore()
const { getProductList } = productStore

const productData = computed(() => productStore.productList)

const showProductImage = (value: string, item: any) => {
  return `<img class="w-[40px] h-[40px] mx-auto" src="${value}" alt="">`
}

const showAllowSell = (value: string, item: any) => {
  if (item?.allow_sell != 1) return ''
  return `<svg class="mx-auto" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-b1c1fcaa=""><circle cx="15" cy="15" r="15" fill="#219653" data-v-b1c1fcaa=""></circle><path d="M20.8824 10.5879L12.7941 18.6761L9.11765 14.9997" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-b1c1fcaa=""></path></svg>`
}

const columns = [
  { name: 'Nhà cung cấp', key: 'suppliers' },
  { name: 'Nhãn hiệu', key: 'brand,name' },
  { name: 'Danh mục sản phẩm', key: 'category,name' },
  { name: 'Mã SKU', key: 'bar_code', editable: true },
  { name: 'Hình ảnh', key: 'images,0', format: showProductImage },
  { name: 'Tên sản phẩm', key: 'name', editable: true },
  { name: 'Có thể bán', key: 'id', format: showAllowSell },
  { name: 'action', key: 'action' }
]

const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await getProductList()
  loading.value = false
})

onUnmounted(() => {})
</script>
