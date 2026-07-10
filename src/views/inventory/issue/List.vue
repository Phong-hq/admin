<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="w-full">
      <div class="flex justify-between items-center mb-2">
        <p class="heading-1">Xuất kho</p>
        <div class="flex gap-2">
          <export-button :action="exportIssue" name="xuat-kho" />
          <a-button type="primary" @click="router.push({ name: 'issue-create' })">
            <template #icon>
              <plus-outlined />
            </template>
            Tạo phiếu xuất kho
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
            <dropdown-issue :data="record" />
          </template>
          <template v-else-if="column.key == 'action'">
            <box-action
              @remove="handleDeleteCategory(record)"
              @view="goToPageDetail(record)"
              hide-edit
              :hide-remove="record.status == ISSUE_STATUS.Done || record.status == ISSUE_STATUS.Cancel"
              view
            ></box-action>
          </template>
          <template v-else-if="column.key == 'created_at'">
            <box-created-time :time="text" />
          </template>
          <template v-else-if="column.key == 'type'">
            <span v-if="text == '1'">Chuyển kho</span>
            <span v-else>Đơn hàng</span>
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
import { ISSUE_STATUS, getStatusLabel, ISSUE_STATUS_DATA } from '@/constant/issue'
import { PlusOutlined } from '@ant-design/icons-vue'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { currency } from '@/utils/currency'
import type { ISSUE_RESPONSE, RECEIPT_RESPONSE } from '@/types/inventory/inventory'

//PINIA
import { useInventoryStore } from '@/stores/inventory'
import { useSelectDataStore } from '@/stores/select_data'
import { useRootStore } from '@/stores/root'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import ExportButton from '@/components/common/button/ExportButton.vue'
import TagIssue from '@/components/common/tag/TagIssue.vue'
import DropdownInventor from '@/components/common/dropdown/DropdownInventor.vue'
import DropdownIssue from '@/components/common/dropdown/DropdownIssue.vue'

const inventoryStore = useInventoryStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()
const router = useRouter()

const { getIssueList, exportIssue, setWaitingIssueDetail, changeIssueStatus } = inventoryStore

const columns = [
  {
    title: 'Mã nhập kho',
    key: 'code',
    width: 'md',
    inputProps: { inputType: 'text' },
    isFilter: true
  },
  {
    title: 'Chi nhánh',
    key: {
      value: 'office,id',
      name: 'office_name',
      label: 'office,name'
    },
    inputProps: {
      inputType: 'text'
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
      inputType: 'text'
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
        defaultData: 'office'
      }
    },
    width: 'lg',
    hidden: true
  },
  {
    title: 'Kho tiếp nhận',
    key: {
      value: 'inventory_receive,id',
      name: 'inventory_receive_id',
      label: 'inventory_receive,name'
    },
    inputProps: {
      inputType: 'select-search',
      data: {
        defaultData: 'inventory'
      }
    },
    width: 'lg',
    hidden: true
  },
  {
    title: 'Loại',
    width: 'md',
    key: 'type'
  },
  {
    title: 'Tổng số',
    key: 'total_number',
    align: 'right',
    width: 'sm',
    sorter: true
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 'md',
    inputProps: { inputType: 'select', data: ISSUE_STATUS_DATA },
    isFilter: true,
    align: 'center'
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    align: 'right',
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
  selectDataStore.getOfficeList()
  selectDataStore.getInventoryList()
  initData()
})

const tableLoading = ref(false)
const meta = ref<MetaResponse | null>(null)
const receipt = ref<ISSUE_RESPONSE[]>([])
const tableRef = ref<InstanceType<typeof CTableAnt> | null>(null)

const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    const res = await getIssueList(param)
    meta.value = res._meta
    receipt.value = res.items
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const goToPageDetail = (item: any) => {
  setWaitingIssueDetail(item)
  router.push({ name: 'issue-detail', params: { id: item.id } })
}

const handleDeleteCategory = async (data: any) => {
  try {
    await rootStore.confirm({
      bodyTitle: 'Xóa phiếu xuất kho',
      bodyMessage: `Bạn có chắc chắn muốn hủy phiếu <span class="font-bold">${data?.code}</span> không?`,
      confirmButtonText: 'Có',
      cancelButtonText: 'không'
    })
    tableLoading.value = true
    await changeIssueStatus(data?.id, 'cancel')
    handle_success('Xóa danh mục thành công!')
    await initData()
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}
</script>
