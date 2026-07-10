<template>
  <c-breadcrumb />
  <div class="page-box-white">
    <div class="flex justify-between items-center gap-7 mb-2">
      <p class="heading-1">Kho</p>
      <create-inventory-modal ref="createInventoryModalRef" @getData="initData()">
        <create-button type="primary">Tạo kho</create-button>
      </create-inventory-modal>
    </div>
    <c-table :columns="column" :data="data" :meta="meta" :loading="loading" @getData="initData">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key == 'action'">
          <box-action remove @edit="editInventory(record)" @remove="removeInventory(record)">
          </box-action>
        </template>
        <template v-else-if="column.key == 'created_at'">
          <box-created-time :time="text" />
        </template>
        <template v-else-if="column.key == 'type'">
        </template>
      </template>
    </c-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import { useRouter } from 'vue-router'
import type { INVENTORY_LIST_RESPONSE } from '@/types/setting/inventory'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CTable from '@/components/common/table/CTable.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import CreateInventoryModal from '@/views/setting/inventory/CreateInventoryModal.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

// PINIA
import { useInventoryStore } from '@/stores/setting/inventory'
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

const inventoryStore = useInventoryStore()
const selectDataStore = useSelectDataStore()
const router = useRouter()

const { getInventoryList, deleteInventory } = inventoryStore

const column = [
  {
    title: 'Tên',
    key: 'name',
    inputProps: { inputType: 'text' },
    isFilter: true
  },
  {
    title: 'Mã',
    key: 'code',
    inputProps: { inputType: 'text' },
    width: 'md',
    isFilter: true,
  },
  {
    title: 'Chi nhánh',
    key: {
      name: 'office_name',
      value: 'office,id',
      label: 'office,name'
    },
    width: 'lg',
    inputProps: {
      inputType: 'select-search',
      data: {
        defaultData: 'office'
      }
    },
    isFilter: true
  },
  {
    title: 'Trưởng kho',
    key: {
      name: 'owner',
      label: 'owner,username',
      value: 'owner,id'
    },
    width: 'md',
  },
  {
    title: 'Mô tả',
    key: 'description',
    inputProps: { inputType: 'text' },
    isFilter: true,
    width: 'xl',
    // hidden: true
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    inputProps: { inputType: 'date' },
    width: 'md',
    align: 'right'
  },
  {
    title: '-',
    key: 'action'
  }
] as COLUMN_TYPE[]

onMounted(() => {
  selectDataStore.getOfficeList()
  initData()
})

const loading = ref(false)
const data = ref<INVENTORY_LIST_RESPONSE[]>([])
const meta = ref<MetaResponse | null>(null)
const createInventoryModalRef = ref<InstanceType<typeof CreateInventoryModal> | null>(null)

const initData = async (params?: any) => {
  try {
    loading.value = true
    let querry_params = { ...params }
    const res = await getInventoryList(querry_params)
    data.value = res.items
    meta.value = res._meta
  } catch (e) {
    handle_error(e)
  }
  loading.value = false
}

const removeInventory = async (data: any) => {
  try {
    await deleteInventory(data)
    handle_success('Xóa chi nhánh thành công!')
    initData()
  } catch (error) {
    handle_error(error, 'Xóa chi nhánh thất bại!')
  }
}

const editInventory = (data: any) => {
  createInventoryModalRef.value?.showModal(data)
}
</script>

<style lang="scss"></style>
