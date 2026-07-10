<template>
  <div class="w-full">
    <div class="min-w-full w-max max-w-full overflow-x-auto">
      <c-table-ant
        :columns="columns2"
        :data="productData"
        primary-key="id"
        expand-column
        expand-title="test"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'image'">
            <img class="w-[40px] h-[40px] mx-auto" :src="`${text}`" alt="" />
          </template>
          <template v-else-if="column.key == 'allow_sell'">
            <svg
              class="mx-auto"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              data-v-b1c1fcaa=""
              v-if="(record.allow_sell = 1)"
            >
              <circle cx="15" cy="15" r="15" fill="#219653" data-v-b1c1fcaa=""></circle>
              <path
                d="M20.8824 10.5879L12.7941 18.6761L9.11765 14.9997"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                data-v-b1c1fcaa=""
              ></path>
            </svg>
            <span v-else></span>
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
              <template #bodyCell="{ text, record, column }">
                <template v-if="column.key == 'image'">
                  <img class="w-[40px] h-[40px] mx-auto" :src="`${text}`" alt="" />
                </template>
              </template>
            </c-table-ant>
          </div>
        </template>
      </c-table-ant>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import CTableAnt from '@/components/common/table/CTable.vue'
import type { COLUMN_TYPE } from '@/types/table'

//PINIA
import { useProductStore } from '@/stores/product'

const productStore = useProductStore()
const { getProductList } = productStore

const productData = computed(() => productStore.productList)

const columns2 = [
  {
    title: 'Nhà cung cấp',
    key: 'suppliers',
    fixed: true,
    isFilter: true,
    inputProps: { type: 'text' }
  },
  {
    title: 'Nhãn hiệu',
    key: {
      name: 'brand',
      value: 'brand,id',
      label: 'brand,name'
    },
    sorter: true
    // isFilter: true,
    // inputProps: { type: 'text' }
  },
  {
    title: 'Danh mục sản phẩm',
    key: {
      name: 'category',
      value: 'category,id',
      label: 'category,name'
    }
  },
  { title: 'Mã SKU', key: 'bar_code', isFilter: true, inputProps: { type: 'text' } },
  {
    title: 'Hình ảnh',
    key: {
      name: 'image',
      value: 'images,0',
      label: 'images,0'
    }
  },
  { title: 'Tên sản phẩm', key: 'name' },
  { title: 'Có thể bán', key: 'allow_sell' },
  { title: '-', key: 'action', align: 'center', width: 50, noResizable: true }
] as COLUMN_TYPE[]

const columns3 = [
  { title: 'Mã SKU', key: 'barcode' },
  {
    title: 'Hình ảnh',
    key: {
      name: 'image',
      value: 'images,0',
      label: 'images,0'
    }
  },
  { title: 'Tên sản phẩm', key: 'name' },
  { title: 'Số lượng', key: 'quantity' },
  { title: 'Giá sỉ', key: 'sll_price', align: 'right' },
  { title: 'Đơn giá', key: 'unit_price', align: 'right' },
  { title: '-', key: 'action', align: 'center' }
] as COLUMN_TYPE[]

onMounted(() => {
  getProductList()
})

onUnmounted(() => {})
</script>
