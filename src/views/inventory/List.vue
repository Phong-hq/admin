<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="w-full">
      <div class="flex justify-between items-center">
        <p class="heading-1">Quản lí kho</p>
        <div class="flex gap-2">
          <export-button :action="exportInventory" :params="tableRef?.reactiveData" name="kho" />
        </div>
      </div>
      <c-table-ant
        class=""
        ref="tableRef"
        :columns="columns"
        :data="inventory"
        :meta="meta"
        primary-key="id"
        expand-title="test"
        :loading="tableLoading"
        @get-data="initData"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'supplier_name'">
            <div class="flex flex-wrap gap-2" v-if="supplierList(record?.suppliers)">
              <a-tag class="!m-0" v-for="item in supplierList(record?.suppliers)" :key="item"
                >{{ item }}
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.key == 'sll_price'">
            {{ currency(text) }}
          </template>
          <!--          <template v-else-if="column.key == 'inventory_name'">-->
          <!--            <a-tooltip title="Xem lịch sử kho">-->
          <!--              <a-->
          <!--                class="link"-->
          <!--                :href="`/inventory/history/${record?.inventory?.id}`"-->
          <!--                @click.prevent="goToViewHistory(record?.inventory?.id)"-->
          <!--                >{{ text }}-->
          <!--              </a>-->
          <!--              <template #title>Xem lịch sử kho</template>-->
          <!--            </a-tooltip>-->
          <!--          </template>-->
          <template v-else-if="column.key == 'product_variant_name'">
            <ProductPopover :data="record?.product_variant">
              <a
                class="link"
                :href="`/product/detail/${record?.product?.id}`"
                @click.prevent="goToProductDetail(record?.product?.id)"
                >{{ text }}</a
              >
            </ProductPopover>
          </template>
          <template v-else-if="column.key == 'action'">
            <!--            <box-action hide-edit hide-remove view @view="goToViewHistory(record?.inventory?.id)" />-->
            <a-tooltip :title="'Xem lịch sử'">
              <file-search-outlined class="text-[24px] text-link cursor-pointer" @click="goToViewHistory(record?.inventory?.id)"
                >Xem lịch sử</file-search-outlined
              >
            </a-tooltip>
          </template>
        </template>
      </c-table-ant>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { COLUMN_TYPE } from '@/types/table'
import { FileSearchOutlined } from '@ant-design/icons-vue'
import { ORDER_STATUS_DATA, getStatusLabel } from '@/constant/order'
import type { INVENTORY_RESPONSE } from '@/types/inventory/inventory'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { currency } from '@/utils/currency'
import { tryParseJson } from '@/utils/json'

//PINIA
import { useInventoryStore } from '@/stores/inventory'
import { useSelectDataStore } from '@/stores/select_data'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import ExportButton from '@/components/common/button/ExportButton.vue'
import ProductPopover from '@/components/common/popover/Product.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'

const inventoryStore = useInventoryStore()
const selectDataStore = useSelectDataStore()
const router = useRouter()

const { getInventoryList, exportInventory } = inventoryStore

const columns = [
  {
    title: 'Tên kho hàng',
    key: {
      name: 'inventory_name',
      value: 'inventory,id',
      label: 'inventory,name'
    },
    inputProps: { inputType: 'text' },
    width: 'lg',
    customCell: (record: any, index: number) => {
      return { rowSpan: record.rowSpan }
    }
  },
  {
    title: 'Nhà cung cấp',
    key: 'supplier_name',
    inputProps: { inputType: 'text' },
    width: 'xl'
  },
  {
    title: 'Tên phiên bản sản phẩm',
    key: {
      value: 'product_variant,id',
      name: 'product_variant_name',
      label: 'product_variant,name'
    },
    align:'left',
    inputProps: { inputType: 'text' },
    isFilter: true
  },
  {
    title: 'Đơn giá',
    key: 'sll_price',
    // sorter: true,
    align: 'right',
    width: 'md'
  },
  {
    title: 'Có sẵn',
    key: 'available',
    // sorter: true,
    align: 'right',
    width: 'md'
  },
  {
    title: 'Đang nhập kho',
    key: 'incoming',
    // sorter: true,
    align: 'right',
    hidden: true,
    width: 'md'
  },
  {
    title: 'Đang chuyển kho',
    key: 'committed',
    // sorter: true,
    align: 'right',
    hidden: true,
    width: 'md'
  },
  {
    title: 'Đã xuất kho',
    key: 'on_way',
    // sorter: true,
    align: 'right',
    width: 'md',
    hidden: true
  },
  {
    title: '-',
    key: 'action',
    customCell: (record: any, index: number) => {
      return { rowSpan: record.rowSpan }
    }
  }
] as COLUMN_TYPE[]

onMounted(() => {
  initData()
})

const tableLoading = ref(false)
const meta = ref<MetaResponse | null>(null)
const inventory = ref<any>([])
const tableRef = ref<InstanceType<typeof CTableAnt> | null>(null)
const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    const res = await getInventoryList(param)
    meta.value = res._meta
    let id: any = null
    inventory.value = res.items.map((e) => {
      let rowSpan = 0
      if (id != e.inventory?.id) {
        id = e.inventory?.id
        rowSpan = res.items.filter((element) => element.inventory?.id === e.inventory?.id).length
      }
      return {
        ...e,
        rowSpan
      }
    })
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const goToViewHistory = (id: any) => {
  router.push({ name: 'inventory-history', params: { id: id } })
}

const goToProductDetail = (id: any) => {
  router.push({ name: 'product-detail', params: { id: id } })
}

const supplierList = (data: any) => {
  const key = Object.keys(data)
  let result = [] as any
  key?.forEach((key) => {
    if (data[key]?.name) result.push(data[key]?.name)
  })
  return result
}
</script>
