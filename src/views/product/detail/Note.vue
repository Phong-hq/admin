<template>
  <a-button type="primary" @click="open = true">Thêm mô tả sản phẩm</a-button>
  <a-modal title="Thêm mô tả" v-model:open="open" :bodyStyle="{ padding: '16px' }" :width="1400">
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
    >
      <a-form-item class="!col-span-2" label="Mô tả" name="description">
        <CEditor class="[max-h-600px]" v-model="formState.description" />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Mô tả ngắn" name="short_description">
        <a-input v-model:value="formState.short_description" />
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
  modelValue: FORM
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'updateModelValue', id: FORM): void
}>()

const formState = computed<FORM>({
  set(value: FORM) {
    emits('updateModelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const rules = computed(() => {
  return {
  }
})

const open = ref<boolean>(false)
const formRef = ref<any>(null)

const validate = async () => {
  return await formRef.value?.validate()
}

const fillFormData = async (data?: any) => {
  await formRef.value?.clearValidate()
}

defineExpose({ validate, fillFormData })
</script>
