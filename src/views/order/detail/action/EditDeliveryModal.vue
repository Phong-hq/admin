<template>
  <div @click="show">
    <slot />
  </div>
  <a-modal
    v-model:open="open"
    title="Thay đổi vận chuyển"
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
      <a-form-item
        class="!col-span-2"
        label="Tuỳ chỉnh"
        name="number_inventory"
        @input="
          () => {
            formState.data_delivery_fee.delivery_fee_value = currencyInput(
              formState.data_delivery_fee.delivery_fee_value
            )
          }
        "
      >
        <a-input class="!w-full" v-model:value="formState.data_delivery_fee.delivery_fee_value" />
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

const rules = {
  // product_variant_id: [{ required: true, message: 'Sản phẩm bỏ trống!', trigger: 'blur' }],
}

const formState = reactive({
  data_delivery_fee: {
    delivery_fee_value: '0'
  }
})

onMounted(() => {
  // selectDataStore.getVariantList()
})

const open = ref(false)
const formRef = ref<any>(null)
const loading = ref(false)

const show = () => {
  formState.data_delivery_fee.delivery_fee_value = currencyInput(
    props.data?.data_delivery_fee?.delivery_fee_value ?? 0
  )
  open.value = true
}
const handleOk = async () => {
  try {
    showLoading()

    let form: any = { ...formState }
    form.data_delivery_fee.delivery_fee_value = currencyNumber(
      form.data_delivery_fee.delivery_fee_value
    )
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
