<template>
  <c-breadcrumb />
  <div class="page-box-white">
    <div class="flex justify-between items-center gap-7 mb-2">
      <p class="heading-1">Tài khoản</p>
      <create-button type="primary" @click="router.push({name: 'setting-user-create'})">Tạo tài khoản</create-button>
    </div>
    <c-table :columns="column" :data="data" :meta="meta" :loading="loading" @getData="initData">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key == 'action'">
          <box-action hide-remove @edit="goToPageEdit(record)"> </box-action>
        </template>
        <template v-else-if="column.key == 'created_at' || column.key == 'logged_at'">
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
import type { USER_RESPONSE } from '@/types/setting/user'
import type { COLUMN_TYPE } from '@/types/table'
import { useRouter } from 'vue-router'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CTable from '@/components/common/table/CTable.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

// PINIA
import { useUserStore } from '@/stores/setting/user'

//UTILS
import { handle_error } from '@/utils/message'

const userStore = useUserStore()
const router = useRouter()

const { getUserList, setWaitingUser } = userStore

const column = [
  {
    title: 'Tên đăng nhập',
    key: 'username',
    inputProps: { inputType: 'text' },
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
    title: 'Chi nhánh',
    key: {
      name: 'office',
      label: 'offices,0,name',
      value: 'offices,id'
    },
    width: 'lg',
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    align: 'right',
    width: 'md',
  },
  {
    title: 'Ngày đăng nhập',
    key: 'logged_at',
    width: 'md',
    align: 'right'
  },
  {
    title: 'Trạng thái',
    width: 'md',
    key: 'status'
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
const data = ref<USER_RESPONSE[]>([])
const meta = ref<MetaResponse | null>(null)

const initData = async (params?: any) => {
  try {
    loading.value = true
    let querry_params = {...params}
    const res = await getUserList(querry_params)
    data.value = res.items
    meta.value = res._meta
  } catch (e) {
    handle_error(e)
  }
  loading.value = false
}

const goToPageEdit = (data: any) => {
  setWaitingUser(data)
  router.push({name: 'setting-user-detail', params: {id: data?.id}})
}
</script>

<style lang="scss"></style>
