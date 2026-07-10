<template>
  <c-breadcrumb />
  <div class="page-box-white">
    <div class="flex justify-between items-center gap-7 mb-2">
      <p class="heading-1">Nhà cung cấp</p>
      <create-supplier-modal ref="createSupplierModalRef" @getData="initData()">
        <create-button type="primary">Tạo nhà cung cấp</create-button>
      </create-supplier-modal>
    </div>
    <c-table :columns="column" :data="data" :meta="meta" :loading="loading" @getData="initData">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key == 'action'">
          <box-action remove @edit="editSupplier(record)" @remove="removeSupplier(record)">
          </box-action>
        </template>
        <template v-else-if="column.key == 'created_at'">
          <box-created-time :time="text" />
        </template>
        <template v-else-if="column.key == 'status'">
          <box-active :value="text" />
        </template>
      </template>
    </c-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import { useRouter } from 'vue-router'
import type { SUPPLIER_RESPONSE } from '@/types/setting/supplier'
// import { DEPARTMENT_TYPE_DATA, getTypeLabel } from '@/constant/setting/supplier'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CTable from '@/components/common/table/CTable.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import CreateSupplierModal from '@/views/setting/supplier/CreateSupplierModal.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

// PINIA
import { useSupplierStore } from '@/stores/setting/supplier'
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

const supplierStore = useSupplierStore()
const selectDataStore = useSelectDataStore()
const router = useRouter()

const { getSupplierList, deleteSupplier } = supplierStore

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
    title: 'Email',
    key: 'email',
    inputProps: { inputType: 'text' },
    width: 'lg',
    isFilter: true
  },
  {
    title: 'Liên hệ',
    key: {
      name: 'contact_name',
      value: 'contact,id',
      label: 'contact,name'
    },
    width: 'md',
    inputProps: { inputType: 'text' },
    isFilter: true
  },
  {
    title: 'Trạng thái',
    key: 'status',
    sorter: true,
    width: 'md',
    isFilter: true
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    inputProps: { inputType: 'date' },
    align: 'right',
    width: 'md',
    sorter: true
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
const data = ref<SUPPLIER_RESPONSE[]>([])
const meta = ref<MetaResponse | null>(null)
const createSupplierModalRef = ref<InstanceType<typeof CreateSupplierModal> | null>(null)

const initData = async (params?: any) => {
  try {
    loading.value = true
    let querry_params = { ...params }
    const res = await getSupplierList(querry_params)
    data.value = res.items
    meta.value = res._meta
  } catch (e) {
    handle_error(e)
  }
  loading.value = false
}

const removeSupplier = async (data: any) => {
  try {
    await deleteSupplier(data)
    handle_success('Xóa chi nhánh thành công!')
    initData()
  } catch (error) {
    handle_error(error, 'Xóa chi nhánh thất bại!')
  }
}

const editSupplier = (data: any) => {
  createSupplierModalRef.value?.showModal(data)
}
</script>

<style lang="scss"></style>
