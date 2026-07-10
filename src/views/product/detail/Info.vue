<template>
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
    <a-form-item class="!col-span-2" label="Tên sản phẩm:" name="name">
      <a-input v-model:value="formState.name" />
    </a-form-item>

    <a-form-item class="sm:!col-span-1 !col-span-2" label="SKU" name="sku">
      <c-random-number v-model="formState.sku" :length="9" />
    </a-form-item>

    <a-form-item class="sm:!col-span-1 !col-span-2" label="Mã vạch" name="bar_code">
      <c-random-number v-model="formState.bar_code" :length="10" />
    </a-form-item>

    <a-form-item class="!col-span-2" label="Trạng thái" name="allow_sell">
      <c-checkbox-number v-model="formState.allow_sell"
        >Có thể bán</c-checkbox-number
      >
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { handle_error, handle_success } from '@/utils/message'
import { getRandomDigits } from '@/utils/string-helper'
import { ReloadOutlined } from '@ant-design/icons-vue'

//COMPONENTS
import CEditor from '@/components/common/editor/CEditor.vue'
import CRandomNumber from '@/components/common/input/CRandomNumber.vue'
import CCheckboxNumber from '@/components/common/checkbox/CCheckboxNumber.vue'

//PINIA

type FORM = {
  bar_code: string
  name: string
  sku: string
  allow_sell: number
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
    name: [{ required: !props.isEdit, message: 'Tên sản phẩm bỏ trống!', trigger: 'blur' }],
    sku: [{ required: !props.isEdit, message: 'Mã sku bỏ trống!', trigger: 'blur' }],
    bar_code: [{ required: !props.isEdit, message: 'Mã vạch bỏ trống!', trigger: 'blur' }]
  }
})

const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)

const handleCheckChange = (e: any) => {
  formState.value.allow_sell = !formState.value.allow_sell ? 1 : 0
}

const validate = async () => {
  return await formRef.value?.validate()
}

const fillFormData = async (data?: any) => {
  await formRef.value?.clearValidate()
}

defineExpose({ validate, fillFormData })
</script>
