<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="w-full">
      <div class="flex justify-between items-center mb-2">
        <p class="heading-1">Nhập kho</p>
        <div class="flex gap-2">
          <export-button :action="exportReceipt" name="nhap-kho" />
          <a-button type="primary" @click="router.push({name: 'receipt-create'})">
            <template #icon>
              <plus-outlined />
            </template>
            Tạo phiếu nhập kho
          </a-button>
        </div>
      </div>
      <!-- db-click -->
      <c-table-ant
        class=""
        ref="tableRef"
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
            <dropdown-inventor :data="record" />
          </template>
          <template v-else-if="column.key == 'action'">
            <box-action @view="goToPageDetail(record)" view>
              <template #remove><span></span></template>
              <template #edit><span></span></template>
            </box-action>
          </template>
          <template v-else-if="column.key == 'created_at'">
            <box-created-time :time="text" />
          </template>
          <!--          <template v-else-if="column.key == 'status'">-->
          <!--            <tag-inventor type="text" />-->
          <!--          </template>-->
        </template>
      </c-table-ant>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { COLUMN_TYPE } from '@/types/table'
import { RECEIPT_STATUS, getStatusLabel, RECEIPT_STATUS_DATA } from '@/constant/receipt'
import { PlusOutlined } from '@ant-design/icons-vue'

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
import type { RECEIPT_RESPONSE } from '@/types/inventory/inventory'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import ExportButton from '@/components/common/button/ExportButton.vue'
// import TagInventor from '@/components/common/tag/TagInventor.vue'
import DropdownInventor from '@/components/common/dropdown/DropdownInventor.vue'

const inventoryStore = useInventoryStore()
const selectDataStore = useSelectDataStore()
const router = useRouter()

const { getReceiptList, exportReceipt, setWaitingReceiptDetail } = inventoryStore

const columns = [
  {
    title: 'Mã nhập kho',
    key: 'code',
    inputProps: { inputType: 'text' },
    isFilter: true,
    width: 'md'
  },
  {
    title: 'Chi nhánh',
    key: {
      value: 'office,id',
      name: 'office_name',
      label: 'office,name'
    },
    inputProps: {
      inputType: 'text',
    },
    width: 'lg',
    isFilter: true
  },
  {
    title: 'Kho',
    key: {
      value: 'inventory,id',
      name: 'inventory_name',
      label: 'inventory,name'
    },
    inputProps: {
      inputType: 'text',
    },
    width: 'lg',
    isFilter: true
  },
  {
    title: 'Nhà cung cấp',
    key: {
      value: 'supplier,id',
      name: 'supplier_name',
      label: 'supplier,name'
    },
    inputProps: { inputType: 'text' },
    width: 'lg',
    isFilter: true
  },
  {
    title: 'Tạo bởi',
    key: {
      value: 'user,id',
      name: 'username',
      label: 'user,username'
    },
    inputProps: { inputType: 'text' },
    width: 'md',
    isFilter: true
  },
  {
    title: 'Trạng thái',
    key: 'status',
    inputProps: { inputType: 'select', data: RECEIPT_STATUS_DATA },
    isFilter: true,
    width: 'md',
    align: 'center'
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    align: 'center',
    sorter: true,
    width: 'md',
    inputProps: { inputType: 'date' }
  },

  {
    title: '-',
    key: 'action'
    // inputProps: { inputType: 'date' },
  }
] as COLUMN_TYPE[]

onMounted(() => {
  selectDataStore.getInventoryList()
  // selectDataStore.getOfficeList()
  initData()
})

const tableLoading = ref(false)
const meta = ref<MetaResponse | null>(null)
const receipt = ref<RECEIPT_RESPONSE[]>([])
const tableRef = ref<InstanceType<typeof CTableAnt> | null>(null)

const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    if(param?.status == RECEIPT_STATUS.All) delete param.status
    const res = await getReceiptList(param)
    meta.value = res._meta
    receipt.value = res.items
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const goToPageDetail = (item: any) => {
  setWaitingReceiptDetail(item)
  router.push({ name: 'receipt-detail', params: { id: item.id } })
}
</script>
