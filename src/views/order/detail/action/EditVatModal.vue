<template>
  <div @click="show">
    <slot />
  </div>
  <a-modal
    v-model:open="open"
    title="Thay đổi VAT"
    @ok="handleOk"
    :after-close="handleAfterClose"
    :okButtonProps="{
      loading: loading
    }"
  >
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
      @finish="handleOk"
    >
      <a-form-item class="!col-span-2" label="Tax(%)" name="tax_value">
        <a-input-number class="!w-full" :max="100" v-model:value="formState.data_tax.tax_value" />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Lý do" name="tax_reason">
        <a-input class="!w-full" v-model:value="formState.data_tax.tax_reason" />
      </a-form-item>

      <a-button class="!opacity-0 !absolute" html-type="submit"></a-button>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { RECEIPT_DISCOUNT_TYPE } from '@/constant/receipt'
import type { ORDER_RESPONSE } from '@/types/order/website'

// COMPONENT
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'
import { useOrderStore } from '@/stores/order'
import { useRootStore } from '@/stores/root'

//UTILS
import { currencyInput, currencyNumber } from '@/utils/currency'
import { handle_error, handle_success } from '@/utils/message'

type Props = {
  data: ORDER_RESPONSE | null
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'getData', res: any): void
}>()

const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()
const orderStore = useOrderStore()

const { updateOrder } = orderStore
const { showLoading, hideLoading } = rootStore

const isRequiredReason = (rule: string, str: string, call: any) => {
  if (!formState.data_tax.tax_reason) {
    return Promise.reject('')
  }
  return Promise.resolve()
}

const isRequiredValue = (rule: string, str: string, call: any) => {
  if (!formState.data_tax.tax_value && formState.data_tax.tax_value != 0) {
    return Promise.reject('')
  }
  return Promise.resolve()
}

const rules = {
  tax_reason: [
    {
      required: true,
      validator: isRequiredReason,
      message: 'Vui lòng nhập lý do!',
      trigger: 'blur'
    }
  ],
  tax_value: [
    { required: true, validator: isRequiredValue, message: 'Vui lòng nhập VAT!', trigger: 'blur' }
  ]
}

const formState = reactive({
  data_tax: {
    tax_reason: '0',
    tax_value: 0
  }
})

onMounted(() => {
  // selectDataStore.getVariantList()
})

const open = ref(false)
const formRef = ref<any>(null)
const loading = ref(false)

const show = () => {
  formState.data_tax.tax_value = props.data?.data_tax?.tax_value ?? 0
  formState.data_tax.tax_reason = props.data?.data_tax?.tax_reason ?? ''
  open.value = true
}
const handleOk = async () => {
  try {
    showLoading()
    await formRef.value?.validate()
    let form: any = { ...formState }
    const res = await updateOrder({
      id: props?.data?.id,
      ...form
    })
    handle_success('Cập nhập thành công!')
    emits('getData', res)
    open.value = false
  } catch (error) {
    handle_error(error, 'Cập nhập thất bại!')
  }
  hideLoading()
}

const handleAfterClose = () => {
  formRef.value?.clearValidate()
}
</script>

<style lang="scss"></style>
