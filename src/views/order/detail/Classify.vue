<template>
  <div class="page-box-white">
    <p class="heading-1">Phân loại</p>
    <a-form
      :model="formState"
      class=""
      ref="formRef"
      name="basic"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
      :rules="rules"
      labelWrap
      autocomplete="off"
    >
      <a-form-item
        class=""
        label="Chi nhánh"
        name="office_id"
        :disabled="disabled"
        @change="handleInputChange('office_id', formState.office_id)"
      >
        <c-select-search
          v-model:value="formState.office_id"
          default-data="office"
          :extra-data="[
            {
              value: order?.office?.id,
              label: order?.office?.name
            }
          ]"
        />
      </a-form-item>

      <a-form-item class="" label="Kho" name="inventory_id" :disabled="disabled">
        <c-select-search
          @change="handleInputChange('inventory_id', formState.inventory_id)"
          v-model:value="formState.inventory_id"
          default-data="inventory"
          :extra-data="[
            {
              value: order?.inventory?.id,
              label: order?.inventory?.name
            }
          ]"
        />
      </a-form-item>

      <a-form-item class="" label="Chính sách giá" name="price_policy" :disabled="disabled">
        <c-select
          v-model:value="formState.price_policy"
          :data="PRICE_POLICY_DATA"
          @change="handleInputChange('price_policy', formState.price_policy)"
        />
      </a-form-item>

      <a-form-item class="" label="Ghi chú" name="note" :disabled="disabled">
        <a-textarea
          v-model:value="formState.note"
          @change="handleInputChange('note', formState.note)"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import type { ORDER_RESPONSE } from '@/types/order/website'

// COMPONENT
import CSelect from '@/components/common/select/CSelect.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'
import { useOrderStore } from '@/stores/order'
import { useRootStore } from '@/stores/root'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { useDebounce } from '@/utils/debounce'

type FORM = {
  inventory_id: number | null
  office_id: number | null
  price_policy: string
  note: string
}

type Props = {
  modelValue: FORM
  order: ORDER_RESPONSE | null
  isEdit: boolean
  disabled: boolean
}

const emits = defineEmits<{
  (e: 'updateModelValue', id: FORM): void
  (e: 'getData', data: ORDER_RESPONSE): void
}>()

const props = withDefaults(defineProps<Props>(), {})

const selectDataStore = useSelectDataStore()
const orderStore = useOrderStore()
const rootStore = useRootStore()

const PRICE_POLICY_DATA = [
  { value: 'unit_price', label: 'giá lẻ' },
  { value: 'sll_price', label: 'giá sỉ' }
]

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
    inventory_id: [{ required: !props.disabled, message: 'Kho bỏ trống!', trigger: 'blur' }],
    office_id: [{ required: !props.disabled, message: 'Chi nhánh bỏ trống!', trigger: 'blur' }],
    price_policy: [{ required: !props.disabled, message: 'Chính sách giá!', trigger: 'blur' }]
  }
})

const formRef = ref<any>(null)

const validate = () => {
  return formRef.value?.validate()
}

const handleInputChange = useDebounce(async (key: string, value: any) => {
  try {
    if (props.isEdit && !props.disabled) {
      rootStore.showLoading()
      let data = {} as any
      data[key] = value
      data.id = props.order?.id
      const res = await orderStore.updateOrder(data)
      emits('getData', res)
      handle_success('cập nhập thành công')
    }
  } catch (e) {
    handle_error(e, 'Cập nhập thất bại')
  }
  rootStore.hideLoading()
}, 300) as (key: string, value: any) => void

onMounted(() => {})

defineExpose({ validate })
</script>

<style lang="scss"></style>
