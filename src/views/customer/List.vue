<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="w-full">
      <div class="flex justify-between items-center mb-2">
        <p class="heading-1">Khách hàng</p>
        <div>
          <create-customer-modal>
            <create-button type="primary">Tạo khách hàng</create-button>
          </create-customer-modal>
        </div>
      </div>
      <!-- db-click -->
      <c-table-ant
        class=""
        :columns="columns"
        :data="customers"
        :meta="meta"
        primary-key="id"
        expand-title="test"
        :loading="tableLoading"
        @get-data="initData"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'status'">
            <box-active :value="text" />
          </template>
          <template v-else-if="column.key == 'action'">
            <box-action @edit="goToPageDetail(record)" @remove="removeCustomer(record)">
            </box-action>
          </template>
          <template v-else-if="column.key == 'created_at'">
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
import type { CUSTOMER_RESPONSE } from '@/types/customer/customer'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { currency } from '@/utils/currency'

//PINIA
import { useCustomerStore } from '@/stores/customer'
import { useSelectDataStore } from '@/stores/select_data'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CreateCustomerModal from '@/views/customer/action/CreateCustomerModal.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

const customerStore = useCustomerStore()
const selectDataStore = useSelectDataStore()
const router = useRouter()

const { getCustomerList } = customerStore

// const receipt = computed(() => inventoryStore.receiptList)
// const meta = computed(() => getReceiptList.orderMeta)

const columns = [
  // { title: 'Id', key: 'id' },
  {
    title: 'Mã',
    key: 'code',
    width: 'md',
    inputProps: { inputType: 'text' },
    isFilter: true
  },
  {
    title: 'Tên',
    key: 'name',
    inputProps: {
      inputType: 'text'
    },
    align:'left',
    isFilter: true
  },
  {
    title: 'Email',
    key: 'email',
    inputProps: { inputType: 'text' },
    width: 'lg',
    isFilter: true
  },
  {
    title: 'Số điện thoại',
    key: 'phone',
    inputProps: { inputType: 'text' },
    width: 'md',
    isFilter: true
  },

  {
    title: 'Nhóm',
    key: {
      value: 'groups,0,id',
      name: 'groups',
      label: 'groups,0,name'
    },
    inputProps: { inputType: 'text' },
    width: 'lg',
    isFilter: true
  },
  {
    title: 'Trạng thái',
    key: 'status',
    // inputProps: { inputType: 'select', data: ORDER_STATUS_DATA },
    width: 'md',
    isFilter: true
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    sorter: true,
    width: 'md',
    align: 'right',
    inputProps: { inputType: 'date' }
  },

  {
    title: '-',
    key: 'action'
    // inputProps: { inputType: 'date' },
  }
] as COLUMN_TYPE[]

onMounted(() => {
  initData()
})

const tableLoading = ref(false)
const meta = ref<MetaResponse | null>(null)
const customers = ref<CUSTOMER_RESPONSE[]>([])

const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    const res = await getCustomerList(param)
    meta.value = res._meta
    customers.value = res.items
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const goToPageDetail = (item: any) => {
  router.push({ name: 'person-detail', params: { id: item.id } })
}

const removeCustomer = async (data: CUSTOMER_RESPONSE) => {
  try {
    await customerStore.removeCustomer(data)
    handle_success('Xóa khách hàng thành công')
    initData()
  } catch (e) {
    handle_error(e,'Xóa khách hàng thất bại')
  }
}
</script>
