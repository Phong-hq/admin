<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="min-w-full w-max max-w-full overflow-x-auto">
      <div class="flex justify-between items-center gap-7 mb-2">
        <p class="heading-1 !mb-0">Bàn</p>
        <a-button type="primary" @click="addRoomDrawerRef?.show()">
          <template #icon>
            <plus-outlined />
          </template>
          Thêm bàn
        </a-button>
      </div>
      <c-table 
        :columns="column"
        :data="data"
        :meta="meta"
        :loading="loading"
        :widthScrollX="900"
        @getData="initData"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key == 'code'">
            <span> {{ text ?? '-' }} </span>
          </template>
          <template v-if="column.key == 'group_id'">
            <span> {{ getLabelGroupRoom(record) }} </span>
          </template>
          <template v-if="column.key == 'status'">
            <box-active class="mx-auto" :value="record.status" />
          </template>
          <template v-if="column.key == 'action'">
            <box-action
              @edit="editRoom(record)"
              @remove="removeRoom(record)"
            ></box-action>
          </template>
        </template>
      </c-table>
    </div>
  </div>
  <add-room-drawer ref="addRoomDrawerRef" @get-data="initData" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { ROOM_RESPONSE } from '@/types/setting/room'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CTable from '@/components/common/table/CTable.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import AddRoomDrawer from '@/views/setting/room/AddRoomDrawer.vue'

// PINIA
import { useRoomStore } from '@/stores/setting/room'
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

const roomStore = useRoomStore()
const selectDataStore = useSelectDataStore()

const { getRoomList, deleteRoom } = roomStore
const addRoomDrawerRef = ref<InstanceType<typeof AddRoomDrawer> | null>(null)

const getLabelGroupRoom = (value: any):string => {
  const group:any = selectDataStore.selectList.group.find((item:any) => item.value === value.group_id)
  return group ? group.label : 'Không xác định'
}
const column = ref<COLUMN_TYPE[]>([
  {
    title: 'Tên bàn',
    key: 'name',
    inputProps: { inputType: 'text' },
    width: 'md',
    isFilter: true
  },
  {
    title: 'Mã bàn',
    key: 'code',
    inputProps: { inputType: 'text' },
    width: 'md',
    sorter: true,
    isFilter: true
  },
  {
    title: 'Khu vực',
    key: 'group_id',
    inputProps: { inputType: 'select', data: selectDataStore.selectList.group },
    width: 'md',
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
])
onMounted(() => {
  initData()
})

const loading = ref(false)
const data = ref<ROOM_RESPONSE[]>([])
const meta = ref<MetaResponse | null>(null)

const initData = async (params?: any) => {
  loading.value = true
  try {
    let query_params = { ...params }
    const res = await getRoomList(query_params)
    data.value = res.items
    meta.value = res._meta  
  } catch (e) {
    handle_error(e)
  } finally {
    loading.value = false
  }
}

const removeRoom = async (data:any) => {
  try {
    await deleteRoom(data)
    handle_success('Xóa bàn thành công!')
    initData()
  } catch (error) {
    handle_error(error, 'Xóa bàn thất bại!')
  }
}

const editRoom = (data: any) => {
  addRoomDrawerRef.value?.show(data)
}
</script>

<style lang="scss"></style>
