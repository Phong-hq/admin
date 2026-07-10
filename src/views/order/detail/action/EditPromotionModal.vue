<template>
  <div @click="show">
    <slot />
  </div>
  <a-modal
    v-model:open="open"
    title="Thay đổi giảm giá"
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
      <a-form-item label="Chiết khấu thường" name="discount_type">
        <a-radio-group v-model:value="formState.discount_type" name="radioGroup">
          <a-radio :value="DISCOUNT_TYPE.CASH">VND</a-radio>
          <a-radio :value="DISCOUNT_TYPE.PERCENT">%</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        label="Giảm giá"
        name="discount_value"
        v-if="formState.discount_type == DISCOUNT_TYPE.CASH"
        @input="
          () => (formState.discount_value_cash = currencyInput(formState.discount_value_cash))
        "
      >
        <a-input class="!w-full" v-model:value="formState.discount_value_cash" />
      </a-form-item>
      <a-form-item
        label="Giảm giá"
        name="discount_value"
        v-else-if="formState.discount_type == DISCOUNT_TYPE.PERCENT"
      >
        <a-input-number
          class="!w-full"
          :max="100"
          v-model:value="formState.discount_value_percent"
        />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Mã giảm giá" name="promotion_code">
        <c-select-search
          v-model:value="formState.promotion_id"
          default-data="promotion"
          @change="handleChoosePromotion"
        />
      </a-form-item>

      <a-button class="!opacity-0 !absolute" html-type="submit"></a-button>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import type { ORDER_RESPONSE } from '@/types/order/website'
import { DISCOUNT_TYPE } from '@/constant'

// COMPONENT
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'
import { useOrderStore } from '@/stores/order'
import { useRootStore } from '@/stores/root'
import { usePromotionStore } from '@/stores/promotion'

//UTILS
import { currencyInput, currencyNumber } from '@/utils/currency'
import { handle_error, handle_success } from '@/utils/message'
import { RECEIPT_DISCOUNT_TYPE } from '@/constant/receipt'

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
const promotionStore = usePromotionStore()

const { updateOrder, addOrderPromotion } = orderStore
const { showLoading, hideLoading } = rootStore
const { getPromotionDetail } = promotionStore

const rules = {
  tax_reason: [{ required: true, message: 'Vui lòng nhập lý do!', trigger: 'blur' }],
  tax_value: [{ required: true, message: 'Vui lòng nhập VAT!', trigger: 'blur' }]
}

const formState = reactive({
  discount_type: DISCOUNT_TYPE.PERCENT,
  discount_value: 0 as number | string,
  discount_value_cash: '',
  discount_value_percent: 0 as number | string,
  promotion_code: '',
  promotion_id: null as number | null
})

onMounted(() => {
  selectDataStore.getPromotionList()
})

const open = ref(false)
const formRef = ref<any>(null)
const loading = ref(false)

const show = () => {
  formState.discount_type = DISCOUNT_TYPE.PERCENT
  formState.discount_value = 0
  formState.discount_value_cash = ''
  formState.discount_value_percent = 0
  formState.promotion_code = ''
  formState.promotion_id = null
  open.value = true
}
const handleOk = async () => {
  try {
    showLoading()
    await formRef.value?.validate()
    let form: any = {
      discount_value:
        formState.discount_type == DISCOUNT_TYPE.CASH
          ? currencyNumber(formState.discount_value_cash)
          : formState.discount_value_percent,
      promotion_code: formState.promotion_code,
      discount_type: formState.discount_type,
    }
    const res = await addOrderPromotion(props?.data?.id, form)
    handle_success('Đã cập nhập phiếu giảm giá!')
    // emits('getData', res)
    open.value = false
  } catch (error) {
    handle_error(error, 'Cập nhập phiếu giảm giá thất bại!')
  }
  hideLoading()
}

const handleChoosePromotion = async (id: any) => {
  try {
    showLoading()
    const res = await getPromotionDetail(id)
    formState.promotion_code = res?.code ?? ''
  } catch (e) {
    handle_error(e)
  }
  hideLoading()
}

const handleAfterClose = () => {
  formRef.value?.clearValidate()
}
</script>

<style lang="scss"></style>
