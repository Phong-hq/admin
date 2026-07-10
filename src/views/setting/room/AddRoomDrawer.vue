<template>
  <div @click="quickCreate()">
    <slot name="button"></slot>
  </div>
  <a-drawer
    class="h-[70vh]"
    v-model:open="open"
    :title="isEdit ? 'Cập nhật bàn' : 'Thêm bàn'"
    placement="right"
    :width="isMobileComputed ? 350 : 500"
  >
    <template #footer>
      <div class="flex justify-end gap-4">
        <a-button @click="hide">Hủy</a-button>
        <a-button type="primary" @click="onFinish" :loading="loading">{{
          isEdit ? 'Cập nhật' : 'Tạo'
        }}</a-button>
      </div>
    </template>
    <div class="sc-full flex flex-col">
      <a-form
        :model="formState"
        class="form-2"
        ref="formRef"
        name="basic"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :rules="rules"
        labelWrap
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        @keyEnter="onFinish"
      >
        <a-form-item class="!col-span-2" label="Khu vực" name="group_id">
          <c-select-search
            :search="searchGroupList"
            v-model:value="formState.group_id"
            placeholder="Chọn khu vực"
            default-data="group"
          />
        </a-form-item>
               
        <a-form-item class="!col-span-2" label="Tên bàn" name="name">
          <a-input v-model:value="formState.name"  @change="onChangeRoomCode"/>
        </a-form-item>

        <a-form-item class="!col-span-2" label="Mã bàn" name="code">
          <a-input v-model:value="formState.code" />
        </a-form-item>

        <a-form-item class="!col-span-2" label="Trạng thái" name="status">
          <c-checkbox-number v-model="formState.status"
            ><p class="font-semibold">Kích hoạt</p></c-checkbox-number
          >
        </a-form-item>

        <a-form-item class="!col-span-2 flex-center !pt-7 !hidden">
          <a-button class="" type="primary" html-type="submit" :loading="loading">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'

//COMPONENTS
import CCheckboxNumber from '@/components/common/checkbox/CCheckboxNumber.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

//PINIA
import { useRoomStore } from '@/stores/setting/room'
import { useSelectDataStore } from '@/stores/select_data'
import { useRootStore } from '@/stores/root'
import { useGroupStore } from '@/stores/setting/group'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { formatSlugUrl } from '@/utils/string-helper'

// TYPES
import type { GROUP_RESPONSE } from '@/types/setting/group'

const emits = defineEmits<{
  (e: 'getData'): void
}>()

const roomStore = useRoomStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()
const groupStore = useGroupStore()
const { searchGroupList } = selectDataStore

const { createRoom, updateRoom } = roomStore
const isMobileComputed = computed(() => rootStore.isMobile)
const rules = computed(() => {
  return {
    name: [{ required: true, message: 'Tên bàn bỏ trống!', trigger: 'blur' }],
    group_id: [{ required: true, message: 'Khu vực bỏ trống!', trigger: 'blur' }],
    code: [{ required: true, message: 'Mã bàn bỏ trống!', trigger: 'blur' }],
  }
})
const isEdit = computed(() => formState.id != null)
const idGroupRoom = computed(() => formState.group_id ?? 'tuy-chon')
const listGroupComputed = computed(() => {
  return groupStore.groupList as GROUP_RESPONSE[]
})

const formState = reactive({
  id: null as null | number,
  group_id: null as null | number,
  name: '',
  code: null as null | string,
  status: 1 as number,
})
const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const isQuickCreate = ref(false)

const onChangeRoomCode = () => {
  const group = listGroupComputed.value.find((item) => item.id === formState.group_id)
  formState.code = `${formatSlugUrl(formState.name)}-${group?.code ?? ''}`
}

watch(() => formState.group_id, (newGroupId) => {
  if (newGroupId) {
    onChangeRoomCode()
  }
}, { immediate: true })

const show = async (data?: any) => {
  await formRef.value?.clearValidate()
  reset(data)
  open.value = true
}

const hide = () => {
  open.value = false
}

const onFinish = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    let data: any = { ...formState }
    if (isEdit.value) {
      await updateRoom(data)
    } else await createRoom(data)
    handle_success(isEdit.value ? 'Cập nhập thành công!' : 'Thêm thành công!')
    emits('getData')
    hide()
  } catch (error) {
    handle_error(error)
  }
  loading.value = false
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

const reset = (data?: any) => {
  if (data) {
    formState.id = data?.id
    formState.group_id = data?.group_id
    formState.name = data?.name ?? ''
    formState.code = data?.code ?? null
    formState.status = data?.status ?? 1
  } else {
    formState.id = null
    formState.group_id = null
    formState.name = ''
    formState.code = null
    formState.status = 1
  }
  loading.value = false
  isQuickCreate.value = false
}

const quickCreate = () => {
  show()
  isQuickCreate.value = true
  formState.status = 1
}

defineExpose({ show })
</script>
