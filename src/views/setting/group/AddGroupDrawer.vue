<template>
  <div @click="quickCreate()">
    <slot name="button"></slot>
  </div>
  <a-drawer
    class="h-[70vh]"
    v-model:open="open"
    :title="isEdit ? 'Cập nhật khu vực' : 'Thêm khu vực'"
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
        <a-form-item class="!col-span-2" label="Tên khu vực" name="name">
          <a-input v-model:value="formState.name"  @change="onChangeGroupCode"/>
        </a-form-item>

        <a-form-item class="!col-span-2" label="Mã khu vực" name="code">
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
import { ref, reactive, computed } from 'vue'

//COMPONENTS
import CCheckboxNumber from '@/components/common/checkbox/CCheckboxNumber.vue'

//PINIA
import { useGroupStore } from '@/stores/setting/group'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { formatSlugUrl } from '@/utils/string-helper'
import { useRootStore } from '@/stores/root'
const emits = defineEmits<{
  (e: 'getData'): void
}>()

const groupStore = useGroupStore()
const rootStore = useRootStore()

const { createGroup, updateGroup } = groupStore
const isMobileComputed = computed(() => rootStore.isMobile)

const rules = computed(() => {
  return {
    name: [{ required: true, message: 'Tên khu vực bỏ trống!', trigger: 'blur' }],
    code: [{ required: true, message: 'Tên khu vực bỏ trống!', trigger: 'blur' }],
  }
})
const isEdit = computed(() => formState.id != null)

const formState = reactive({
  id: null as null | number,
  name: '',
  code: null as null | string,
  status: 1 as number,
})
const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const isQuickCreate = ref(false)

const onChangeGroupCode = () => {
  formState.code =  `${formatSlugUrl(formState.name)}`
}

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
      await updateGroup(data)
    } else await createGroup(data)
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
    formState.name = data?.name ?? ''
    formState.code = data?.code ?? null
    formState.status = data?.status ?? 1
  } else {
    formState.id = null
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
