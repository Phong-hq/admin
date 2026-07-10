<template>
  <c-breadcrumb />
  <div class="page-box-white">
    <div class="flex justify-between items-center gap-7 mb-2">
      <p class="heading-1">Bộ phận</p>
      <create-department-modal ref="createDepartmentModalRef" @getData="initData()">
        <create-button type="primary">Tạo bộ phận</create-button>
      </create-department-modal>
    </div>
    <c-table :columns="column" :data="data" :meta="meta" :loading="loading" @getData="initData">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key == 'action'">
          <box-action remove @edit="editDepartment(record)" @remove="removeDepartment(record)">
          </box-action>
        </template>
        <template v-else-if="column.key == 'created_at'">
          <box-created-time :time="text" />
        </template>
        <template v-else-if="column.key == 'type'">
          <!--          {{getTypeLabel(text)}}-->
        </template>
      </template>
    </c-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import { useRouter } from 'vue-router'
import type { DEPARTMENT_RESPONSE } from '@/types/setting/department'
// import { DEPARTMENT_TYPE_DATA, getTypeLabel } from '@/constant/setting/department'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CTable from '@/components/common/table/CTable.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import CreateDepartmentModal from '@/views/setting/department/CreateDepartmentModal.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

// PINIA
import { useDepartmentStore } from '@/stores/setting/department'
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

const departmentStore = useDepartmentStore()
const selectDataStore = useSelectDataStore()
const router = useRouter()

const { getDepartmentList, deleteDepartment } = departmentStore

const column = [
  {
    title: 'Tên',
    key: 'name',
    inputProps: { inputType: 'text' },
    isFilter: true
  },
  {
    title: 'Chi nhánh',
    key: {
      name:'office_name',
      value:'office,id',
      label:'office,name',
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
    title: 'Trưởng bộ phận',
    key: {
      name: 'user',
      label: 'user,username',
      value: 'user,id',
    },
    inputProps: { inputType: 'text' },
    width: 'md',
    isFilter: true
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
const data = ref<DEPARTMENT_RESPONSE[]>([])
const meta = ref<MetaResponse | null>(null)
const createDepartmentModalRef = ref<InstanceType<typeof CreateDepartmentModal> | null>(null)

const initData = async (params?: any) => {
  try {
    loading.value = true
    let querry_params = { ...params }
    const res = await getDepartmentList(querry_params)
    data.value = res.items
    meta.value = res._meta
  } catch (e) {
    handle_error(e)
  }
  loading.value = false
}

const removeDepartment = async (data: any) => {
  try {
    await deleteDepartment(data)
    handle_success('Xóa chi nhánh thành công!')
    initData()
  } catch (error) {
    handle_error(error, 'Xóa chi nhánh thất bại!')
  }
}

const editDepartment = (data: any) => {
  createDepartmentModalRef.value?.showModal(data)
}
</script>

<style lang="scss"></style>
