<template>
  <c-breadcrumb />
  <div class="page-box-white">
    <div class="flex justify-between items-center gap-7 mb-2">
      <p class="heading-1">Chi nhánh</p>
      <create-office-modal ref="createOfficeModalRef" @getData="initData()">
        <create-button type="primary"
          >Tạo chi nhánh</create-button
        >
      </create-office-modal>
    </div>
    <c-table :columns="column" :data="data" :meta="meta" :loading="loading" @getData="initData">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key == 'action'">
          <box-action remove @edit="editOffice(record)" @remove="removeOffice(record)"> </box-action>
        </template>
        <template v-else-if="column.key == 'created_at'">
          <box-created-time :time="text" />
        </template>
        <template v-else-if="column.key == 'type'">
          {{getTypeLabel(text)}}
        </template>
      </template>
    </c-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import { useRouter } from 'vue-router'
import type { OFFICE_RESPONSE } from '@/types/setting/office'
import { OFFICE_TYPE_DATA, getTypeLabel } from '@/constant/setting/office'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CTable from '@/components/common/table/CTable.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import CreateOfficeModal from '@/views/setting/office/CreateOfficeModal.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

// PINIA
import { useOfficeStore } from '@/stores/setting/office'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

const officeStore = useOfficeStore()
const router = useRouter()

const { getOfficeList, deleteOffice } = officeStore

const column = [
  {
    title: 'Tên',
    key: 'name',
    inputProps: { inputType: 'text' },
    isFilter: true
  },
  {
    title: 'Phân loại',
    key: 'type',
    inputProps: { inputType: 'select', data: OFFICE_TYPE_DATA },
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
    title: 'Người liên hệ',
    key: {
      name: 'contact_person',
      value: 'contact_person,id',
      label: 'contact_person,name'
    },
    width: 'md',
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
  initData()
})

const loading = ref(false)
const data = ref<OFFICE_RESPONSE[]>([])
const meta = ref<MetaResponse | null>(null)
const createOfficeModalRef = ref<InstanceType<typeof CreateOfficeModal> | null>(null)

const initData = async (params?: any) => {
  try {
    loading.value = true
    let querry_params = { ...params }
    const res = await getOfficeList(querry_params)
    data.value = res.items
    meta.value = res._meta
  } catch (e) {
    handle_error(e)
  }
  loading.value = false
}

const goToPageEdit = (data: any) => {
  router.push({ name: 'setting-user-detail', params: { id: data?.id } })
}

const removeOffice = async (data:any) => {
  try {
    await deleteOffice(data)
    handle_success('Xóa chi nhánh thành công!')
    initData()
  } catch (error) {
    handle_error(error, 'Xóa chi nhánh thất bại!')
  }
}

const editOffice = (data: any) => {
  createOfficeModalRef.value?.showModal(data)
}
</script>

<style lang="scss"></style>
