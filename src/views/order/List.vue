<template>
  <c-breadcrumb />
  <div class="flex gap-4">
    <div class="grow page-box-white">
      <div class="flex justify-between sm:flex-nowrap flex-wrap items-center mb-2">
        <p class="heading-1">Đơn hàng</p>
        <div class="sm:flex sm:w-auto w-full grid grid-cols-1 gap-2">
          <!--          <div class="flex items-center gap-2">-->
          <!--            <p class="font-semibold">Chọn ngày:</p>-->
          <!--            <c-date-range-picker v-model:value="date" @change="initData()" />-->
          <!--          </div>-->
          <filter-component :data="formFilterState" @getData="handleFilter" />
          <create-button type="primary" @click="router.push({ name: 'order-create-detail' })"
            >Tạo đơn hàng
          </create-button>
        </div>
      </div>
      <c-table-ant
        class=""
        :columns="columns"
        :data="orders"
        :meta="meta"
        primary-key="id"
        expand-title="test"
        :loading="tableLoading"
        @get-data="initData"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'status'">
            <dropdown-order :data="record" v-if="record.channel == 'website'" />
            <span v-else></span>
          </template>
          <template v-else-if="column.key == 'action'">
            <box-action
              :hide-edit="true"
              view
              @view="goToEditPageDetail(record)"
              @edit="goToEditPageDetail(record)"
            >
              <template #remove><span></span></template>
            </box-action>
          </template>
          <template v-else-if="column.key == 'payments'">
            {{ currency(text) }}
          </template>
          <template v-else-if="column.key == 'done_at' || column.key == 'created_at'">
            <box-created-time :time="text" />
          </template>
        </template>
      </c-table-ant>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { COLUMN_TYPE } from '@/types/table'
import { ORDER_STATUS, ORDER_STATUS_DATA } from '@/constant/order'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { currency } from '@/utils/currency'
import { DATE_REQUEST_FORMAT } from '@/utils/dayjs-helper'

//PINIA
import { useOrderStore } from '@/stores/order'
import { useSelectDataStore } from '@/stores/select_data'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import TagOrder from '@/components/common/tag/TagOrder.vue'
import CDateRangePicker from '@/components/common/date-picker/CDateRangePicker.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'
import ExportButton from '@/components/common/button/ExportButton.vue'
import type { ORDER_RESPONSE } from '@/types/order/website'
import DropdownOrder from '@/components/common/dropdown/DropdownOrder.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import FilterComponent from '@/views/order/Filter.vue'

const orderStore = useOrderStore()
const selectDataStore = useSelectDataStore()
const router = useRouter()

const { getOrderList, setWaitingOrder } = orderStore

// const orders = computed(() => orderStore.orderList)
// const meta = computed(() => orderStore.orderMeta)

const columns = [
  {
    title: 'Mã đơn hàng',
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
    hidden: true,
    isFilter: true,
    width: 200
  },
  {
    title: 'Kho',
    key: {
      value: 'inventory,id',
      name: 'inventory_id',
      label: 'inventory,name'
    },
    hidden: true,
    isFilter: true,
    width: 200
  },
  {
    title: 'Khách hàng',
    key: {
      name: 'client_name',
      value: 'client,id',
      label: 'client,name'
    },
    inputProps: { inputType: 'text' },
    isFilter: true
  },
  {
    title: 'Tạo bởi',
    key: 'created_by',
    inputProps: { inputType: 'text' },
    isFilter: true,
    width: 'md'
  },
  {
    title: 'Kênh bán',
    key: 'channel',
    inputProps: { inputType: 'select', data: ['website', 'pos'] },
    isFilter: true,
    width: 'md'
  },
  {
    title: 'Phương thức',
    key: 'payment_methods',
    hidden: true
  },
  {
    title: 'Thanh toán',
    key: 'payments',
    align: 'right',
    sorter: true,
    width: 'md'
  },
  {
    title: 'Ngày hoàn thành',
    key: 'done_at',
    inputProps: { inputType: 'date' },
    isFilter: true,
    sorter: true,
    align: 'right',
    hidden: true,
    width: 'md'
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    inputProps: { inputType: 'date' },
    isFilter: true,
    sorter: true,
    align: 'right',
    hidden: true,
    width: 'md'
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 'lg',
    inputProps: { inputType: 'select', data: ORDER_STATUS_DATA },
    isFilter: true,
    align: 'center'
  },
  {
    title: '-',
    key: 'action'
  }
] as COLUMN_TYPE[]

const formFilterState = reactive({
  date: null as [Dayjs, Dayjs] | null,
  office_id: undefined as any,
  inventory_id: undefined as any
})

onMounted(() => {
  selectDataStore.getOfficeList()
  selectDataStore.getInventoryList()
  initData()
})

const tableLoading = ref(false)
// const date = ref<[Dayjs, Dayjs] | null>(null)
const orders = ref<ORDER_RESPONSE[]>([])
const meta = ref<MetaResponse | null>(null)

const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    let data = {
      ...param,
      ...formFilterState
    }

    if (data.date && data.date[0]) {
      data.start_date = dayjs(data.date[0]).format(DATE_REQUEST_FORMAT)
      data.end_date = dayjs(data.date[1]).format(DATE_REQUEST_FORMAT)
    }

    if(data.status == ORDER_STATUS.All) delete data.status

    const res = await getOrderList(data)

    orders.value = res.items
    meta.value = res._meta
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const goToPageDetail = (item: any) => {
  setWaitingOrder(item)
  router.push({ name: 'order-detail', params: { id: item.id } })
}

const goToEditPageDetail = (item: any) => {
  router.push({ name: 'order-edit-detail', params: { id: item.id } })
}

const handleFilter = (data: any) => {
  formFilterState.date = data?.date ?? undefined
  formFilterState.inventory_id = data?.inventory_id ?? undefined
  formFilterState.office_id = data?.office_id ?? undefined
  initData()
}
</script>
