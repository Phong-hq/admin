<template>
  <div>
    <div class="flex justify-between">
      <p class="heading-1">Kho hàng</p>
    </div>
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
      <a-form-item class="sm:!col-span-1 !col-span-2" label="Khối lượng:" name="weight">
        <a-input-number class="!w-full" v-model:value="formState.weight" />
      </a-form-item>
      <a-form-item class="sm:!col-span-1 !col-span-2" label="Đơn vị:" name="weight_type">
        <c-select
          v-model:value="formState.weight_type"
          :data="WEIGHT_TYPE_DATA"
          placeholder="gram, kilogram"
        />
      </a-form-item>
      <a-form-item class="!col-span-2" label="Đơn vị tính" name="dimension">
        <a-input v-model:value="formState.dimension" placeholder="Thùng, lốc" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { currency } from '@/utils/currency'

//COMPONENTS
import CSelect from '@/components/common/select/CSelect.vue'

//PINIA
import { useSelectDataStore } from '@/stores/select_data'

type FORM = {
  weight: number
  weight_type: string
  dimension: null | string
}

type Props = {
  modelValue: FORM
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'updateModelValue', id: FORM): void
}>()

const WEIGHT_TYPE_DATA = [
  { label: 'Gram', value: 'g' },
  { label: 'Kilogram', value: 'kg' }
]

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
  return {}
})

const formRef = ref<any>(null)
const formStateRender = reactive({
  unit_price: '',
  sll_price: ''
})

const validate = async () => {
  return await formRef.value?.validate()
}

const fillFormData = () => {}

defineExpose({ validate, fillFormData })
</script>
