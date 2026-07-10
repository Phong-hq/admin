<template>
  <c-breadcrumb />

  <div class="w-full page-box-white">
    <div class="w-full">
      <div class="flex justify-between items-center mb-2">
        <p class="heading-1">Kiểm kê sản phẩm</p>
        <div class="flex gap-2">
          <!-- <a-button
            ><template #icon><file-excel-outlined /></template
          ></a-button> -->
          <create-button type="primary" @click="router.push({name: 'stocktaking-create'})"><span>Tạo phiếu kiểm kê</span></create-button>
        </div>
      </div>
      <!-- db-click -->
      <c-table-ant
        class=""
        :columns="columns"
        :data="receipt"
        :meta="meta"
        primary-key="id"
        expand-title="test"
        :loading="tableLoading"
        @get-data="initData"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'status'">
            <tag-stock-taking :type="text" />
          </template>
          <template v-else-if="column.key == 'action'">
            <box-action view hide-edit hide-remove @view="goToPageDetail(record)">
            </box-action>
          </template>
          <template v-else-if="column.key == 'created_at' || column.key == 'stocktaking_date'">
            <box-created-time :time="text" />
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
import { ORDER_STATUS_DATA, getStatusLabel } from '@/constant/order'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { currency } from '@/utils/currency'

//PINIA
import { useInventoryStore } from '@/stores/inventory'
import { useSelectDataStore } from '@/stores/select_data'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import type { STOCKTAKING_RESPONSE } from '@/types/inventory/inventory'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import TagStockTaking from '@/components/common/tag/TagStockTaking.vue'
import { STOCK_TALKING_DATA } from '@/constant/stock-taking'
import CreateButton from '@/components/common/button/CreateButton.vue'

const inventoryStore = useInventoryStore()
const selectDataStore = useSelectDataStore()
const router = useRouter()

const { getStocktakingList, setWaitingStocktakingDetail } = inventoryStore

// const receipt = computed(() => inventoryStore.receiptList)
// const meta = computed(() => getReceiptList.orderMeta)

const columns = [
  // { title: 'Id', key: 'id' },
  {
    title: 'Mã xuất kho',
    key: 'code',
    width: 'md',
    inputProps: { inputType: 'text' },
    isFilter: true
  },
  {
    title: 'Chi nhánh',
    key: {
      value: 'office,id',
      name: 'office_id',
      label: 'office,name'
    },
    inputProps: {
      inputType: 'select-search',
      data: {
        placeholder: 'Chọn chi nhánh',
        defaultData: 'office'
      }
    },
    width: 'lg',
    isFilter: true
  },
  {
    title: 'Kho',
    key: {
      value: 'inventory,id',
      name: 'inventory',
      label: 'inventory,name'
    },
    inputProps: {
      inputType: 'select-search',
      data: {
        placeholder: 'Chọn kho',
        defaultData: 'inventory'
      }
    },
    width: 'lg',
    isFilter: true
  },
  {
    title: 'Nơi tiếp nhận',
    key: {
      value: 'office_receive,id',
      name: 'office_receive_id',
      label: 'office_receive,name'
    },
    inputProps: {
      inputType: 'select-search',
      data: {
        placeholder: 'Chọn chi nhánh tiếp nhận',
        defaultData: 'office'
      }
    },
    width: 'lg',
    hidden: true
  },
  {
    title: 'Người tạo',
    key: 'created_by',
    inputProps: { inputType: 'text' },
    width: 'md',
    isFilter: true
  },
  {
    title: 'Loại',
    width: 'md',
    key: 'type'
  },
  {
    title: 'Tổng số',
    width: 'sm',
    key: 'total_number'
  },
  {
    title: 'Ngày kiểm kê',
    key: 'stocktaking_date',
    align: 'right',
    sorter: true,
    width: 'md',
    inputProps: { inputType: 'date' }
  },
  // {
  //   title: 'Trạng thái',
  //   key: 'status',
  //   width: 200,
  //   align: 'center',
  //   inputProps: { inputType: 'select', data: STOCK_TALKING_DATA },
  //   isFilter: true
  // },
  {
    title: '-',
    key: 'action'
    // inputProps: { inputType: 'date' },
  }
] as COLUMN_TYPE[]

onMounted(() => {
  selectDataStore.getOfficeList()
  selectDataStore.getInventoryList()
  initData()
})

const tableLoading = ref(false)
const meta = ref<MetaResponse | null>(null)
const receipt = ref<STOCKTAKING_RESPONSE[]>([])

const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    const res = await getStocktakingList(param)
    meta.value = res._meta
    receipt.value = res.items
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const goToPageDetail = (item: any) => {
  setWaitingStocktakingDetail(item)
  router.push({ name: 'stocktaking-detail', params: { id: item.id } })
}
</script>
