<template>
  <a-button type="primary" @click="showModal">Thêm mô tả sản phẩm</a-button>
  <a-modal
    title="Thêm mô tả"
    v-model:open="open"
    :bodyStyle="{ padding: '16px' }"
    :width="1400"
    @ok="handleOk"
  >
    <a-form
      :model="noteState"
      class="form-2"
      ref="formRef"
      name="basic"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
      :rules="rules"
      labelWrap
      autocomplete="off"
    >
      <a-form-item class="!col-span-2" label="Mô tả" name="description">
        <CEditor class="[max-h-600px]" v-model="noteState.description" />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Mô tả ngắn" name="short_description">
        <a-input v-model:value="noteState.short_description" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { handle_error, handle_success } from '@/utils/message'
import { getRandomDigits } from '@/utils/string-helper'
import { ReloadOutlined } from '@ant-design/icons-vue'

//COMPONENTS
import CEditor from '@/components/common/editor/CEditor.vue'
import CRandomNumber from '@/components/common/input/CRandomNumber.vue'

//PINIA

type FORM = {
  short_description: string
  description: string
}

type Props = {
  isEdit?: boolean
}

withDefaults(defineProps<Props>(), {})

const modelValue = defineModel<FORM>({
  default: () => ({ description: '', short_description: '' })
})

const rules = computed(() => {
  return {
  }
})

const open = ref<boolean>(false)
const formRef = ref<any>(null)

const noteState = reactive<FORM>({
  short_description: '',
  description: ''
})

const showModal = () => {
  noteState.description = modelValue.value?.description || ''
  noteState.short_description = modelValue.value?.short_description || ''
  open.value = true
}

const handleOk = async () => {
  await formRef.value?.validate()
  Object.assign(modelValue.value, noteState)
  open.value = false
}

const validate = async () => {
  return await formRef.value?.validate()
}

const fillFormData = async (data?: any) => {
  await formRef.value?.clearValidate()
}

defineExpose({ validate, fillFormData })
</script>
