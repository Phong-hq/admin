<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="min-w-full w-max max-w-full overflow-x-auto">
      <div class="flex justify-between items-center flex-wrap xl:gap-7 md:gap-5 gap-3 mb-2">
        <p class="heading-1 !mb-0">Khu vực</p>
        <a-button type="primary" @click="addGroupDrawerRef?.show()">
          <template #icon>
            <plus-outlined />
          </template>
          Thêm khu vực
        </a-button>
      </div>
      <c-table 
        :columns="column"
        :data="data"
        :meta="meta"
        :loading="loading"
        :widthScrollX="700"
        @getData="initData"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key == 'code'">
            <span> {{ text ?? '-' }} </span>
          </template>
          <template v-if="column.key == 'status'">
            <box-active class="mx-auto" :value="record.status" />
          </template>
          <template v-if="column.key == 'action'">
            <box-action remove @edit="editGroup(record)" @remove="removeGroup(record)"> </box-action>
          </template>
        </template>
      </c-table>
    </div>
  </div>
  <add-group-drawer ref="addGroupDrawerRef" @get-data="initData" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import type { GROUP_RESPONSE } from '@/types/setting/group'
import type { SelectConfigItem } from '@/types/index'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CTable from '@/components/common/table/CTable.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import AddGroupDrawer from '@/views/setting/group/AddGroupDrawer.vue'

// PINIA
import { useGroupStore } from '@/stores/setting/group'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

const groupStore = useGroupStore()

const { getGroupList, deleteGroup } = groupStore
const addGroupDrawerRef = ref<InstanceType<typeof AddGroupDrawer> | null>(null)

const column = [
  {
    title: 'Tên khu vực',
    key: 'name',
    inputProps: { inputType: 'text' },
    width: 'xl',
    isFilter: true
  },
  {
    title: 'Mã khu vực',
    key: 'code',
    inputProps: { inputType: 'text' },
    width: 'xl',
    isFilter: true
  },
  {
    title: 'Trạng thái',
    key: 'status',
    sorter: true,
    align: 'center',
    width: 150
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
const data = ref<GROUP_RESPONSE[]>([])
const meta = ref<MetaResponse | null>(null)

const initData = async (params?: any) => {
  try {
    loading.value = true
    let query_params = { ...params }
    const res = await getGroupList(query_params)
    data.value = res.items
    meta.value = res._meta
  } catch (e) {
    handle_error(e)
  }
  loading.value = false
}

const removeGroup = async (data:any) => {
  try {
    await deleteGroup(data)
    handle_success('Xóa khu vực thành công!')
    initData()
  } catch (error) {
    handle_error(error, 'Xóa khu vực thất bại!')
  }
}

const editGroup = (data: any) => {  
  addGroupDrawerRef.value?.show(data)
}
</script>

<style lang="scss"></style>
