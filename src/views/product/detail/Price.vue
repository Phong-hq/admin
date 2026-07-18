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
    <a-form-item
      class="sm:!col-span-1 !col-span-2"
      label="Đơn giá:"
      name="unit_price"
      @input="handleCurrencyInput('unit_price')"
    >
      <a-input v-model:value="formState.unit_price" />
    </a-form-item>
    <a-form-item
      class="sm:!col-span-1 !col-span-2"
      label="Giá sỉ:"
      name="sll_price"
      @input="handleCurrencyInput('sll_price')"
    >
      <a-input v-model:value="formState.sll_price" />
    </a-form-item>
    <a-form-item
      class="sm:!col-span-1 !col-span-2"
      label="Giá chưa giảm:"
      name="compare_price"
      @input="handleCurrencyInput('compare_price')"
    >
      <a-input v-model:value="formState.compare_price" />
    </a-form-item>
<!--    <a-form-item class="!col-span-2" label="Trạng thái" name="allow_sell">-->
<!--      <a-checkbox :checked="formState.allow_sell == 1" @change="handleCheckChange"-->
<!--        >Có thể bán</a-checkbox-->
<!--      >-->
<!--    </a-form-item>-->
  </a-form>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { currencyInput, currencyNumber } from '@/utils/currency'

//COMPONENTS
import CSelect from '@/components/common/select/CSelect.vue'

//PINIA
import { useSelectDataStore } from '@/stores/select_data'

type FORM = {
  unit_price: string
  sll_price: string
  compare_price: string
  // allow_sell: number
}

type Props = {
  modelValue: FORM
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'updateModelValue', id: FORM): void
}>()

const selectDataStore = useSelectDataStore()

const select_data = computed(() => selectDataStore.selectList)
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
    unit_price: [{ required: !props.isEdit, message: 'Đơn giá bỏ trống!', trigger: 'blur' }],
    sll_price: [{ required: !props.isEdit, message: 'Giả sỉ bỏ trống!', trigger: 'blur' }]
  }
})

const formRef = ref<any>(null)
const tagsOptionData = ref<string[]>([])
const formStateRender = reactive({
  unit_price: '',
  sll_price: '',
  compare_price: ''
})

const handleCurrencyInput = (key: 'unit_price' | 'sll_price' | 'compare_price') => {
  formState.value[key] = currencyInput(formState.value[key])
  // formStateRender[key] = currency(formStateRender[key])
}

// const handleCheckChange = (e: any) => {
//   formState.value.allow_sell = !formState.value.allow_sell ? 1 : 0
// }

const validate = async () => {
  return await formRef.value?.validate()
}

const fillFormData = () => {
  formStateRender.sll_price = currencyInput(formState.value.sll_price)
  formStateRender.unit_price = currencyInput(formState.value.unit_price)
  formStateRender.compare_price = currencyInput(formState.value.compare_price)
}

defineExpose({ validate, fillFormData })
</script>
