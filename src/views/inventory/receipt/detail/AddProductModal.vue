<template>
  <a-modal
    v-model:open="open"
    title="Chỉnh sửa sản phẩm"
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
      <a-form-item class="!col-span-2" label="Sản phẩm" name="product_variant_id">
        <c-select-search
          @change="handleChooseVariantChange"
          :loading="loading"
          v-model:value="formState.product_variant_id"
          placeholder=""
          default-data="variant"
          :extra-data="extraSearchData"
        />
      </a-form-item>

      <a-form-item
        class=""
        label="Đơn giá"
        name="unit_price"
        @input="() => (formState.unit_price = currencyInput(formState.unit_price))"
      >
        <a-input v-model:value="formState.unit_price" />
      </a-form-item>

      <a-form-item label="Số lượng" name="quantity">
        <a-input-number class="!w-full" v-model:value="formState.quantity" />
      </a-form-item>

      <a-form-item label="Loại giảm giá" name="discount_type">
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
      <a-form-item label="Giảm giá" name="discount_value" v-else-if="formState.discount_type == DISCOUNT_TYPE.PERCENT">
        <a-input-number
          class="!w-full"
          :max="100"
          v-model:value="formState.discount_value_percent"
        />
      </a-form-item>

      <a-button
        class="!opacity-0 !absolute"
        html-type="submit"
      ></a-button
      >
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { DISCOUNT_TYPE } from '@/constant'
import type { ISSUE_RESPONSE, RECEIPT_RESPONSE } from '@/types/inventory/inventory'

// COMPONENT
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'
import { useProductStore } from '@/stores/product'

//UTILS
import { currencyInput, currencyNumber } from '@/utils/currency'
import type { SelectConfigItem } from '@/types'


type Props = {
  receipt: RECEIPT_RESPONSE | null
}

const props = withDefaults(defineProps<Props>(), {})


const selectDataStore = useSelectDataStore()
const productStore = useProductStore()

const { getVariant } = productStore

const rules = {
  product_variant_id: [{ required: true, message: 'Sản phẩm bỏ trống!', trigger: 'blur' }],
  quantity: [{ required: true, message: 'Số lượng bỏ trống!', trigger: 'blur' }],
  unit_price: [{ required: true, message: 'Đơn giá bỏ trống!', trigger: 'blur' }]
}

const formState = reactive({
  name: '',
  fe_id: null as number | null,
  id: null as number | null,
  sku: '',
  barcode: '',
  images: '[]' as any,
  product_id: null as number | null,
  product_variant_id: null as number | null,
  quantity: 0,
  unit_price: 0 as number | string,
  sll_price: 0,
  discount_type: DISCOUNT_TYPE.PERCENT,
  discount_value: 0 as number | string,
  discount_value_cash: 0 as number | string,
  discount_value_percent: 0 as number | string,
  total_price: 0,
  sub_total_price: 0
})

onMounted(() => {
  selectDataStore.getVariantList()
})

const open = ref(false)
const formRef = ref<any>(null)
const handleResole = ref<any>(null)
const handleReject = ref<any>(null)
const isSubmit = ref(false)
const loading = ref(false)
const extraSearchData = ref<SelectConfigItem[]>([])

const addProduct = (product?: any) => {
  extraSearchData.value = []
  if(product) {
    extraSearchData.value.push({
      value: product.product_variant_id,
      label: product.name,
    })
  }
  formState.name = product?.name ?? ''
  formState.fe_id = product?.fe_id ?? null
  formState.id = product?.id ?? null
  formState.sku = product?.sku ?? ''
  formState.images = product?.images ?? '[]'
  formState.unit_price = product?.unit_price ?? 0
  formState.barcode = product?.barcode ?? ''
  formState.product_variant_id = product?.product_variant_id ?? null
  formState.product_id = product?.product_id ?? null
  formState.quantity = product?.quantity ?? 0
  formState.unit_price = product?.unit_price ?? 0
  formState.sub_total_price = product?.sub_total_price ?? 0
  formState.sll_price = product?.sll_price ?? 0
  formState.discount_type = Number(product?.discount_type) ?? DISCOUNT_TYPE.PERCENT
  formState.discount_value = product?.discount_value ?? 0
  formState.discount_value_cash =
    product?.discount_type == DISCOUNT_TYPE.CASH ? currencyInput(product?.discount_value) : 0
  formState.discount_value_percent =
    product?.discount_type == DISCOUNT_TYPE.PERCENT ? product?.discount_value : 0
  formState.total_price = product?.total_price ?? 0
  open.value = true
  console.log(formState)
  return new Promise<any>( (resolve, reject) => {
    handleResole.value = (data: any) => {
      resolve(data)
      isSubmit.value = true
      open.value = false
    }
    handleReject.value = () => {
      reject()
      open.value = false
    }
  })
}
const handleOk = async () => {
  await formRef.value?.validate()
  const sub_total_price = currencyNumber(formState.unit_price) * formState.quantity
  let data = {
    ...formState,
    unit_price: currencyNumber(formState.unit_price),
    sub_total_price,
    total_price: sub_total_price - getDiscountVariantValue(),
    discount_value:
      formState.discount_type == DISCOUNT_TYPE.CASH
        ? currencyNumber(formState.discount_value_cash)
        : formState.discount_value_percent
  }
  if (handleResole.value) handleResole.value(data)
}

const handleAfterClose = () => {
  if (!isSubmit.value && handleReject.value) {
    handleReject.value()
  }
  isSubmit.value = false
  handleReject.value = null
  handleResole.value = null
}

const handleChooseVariantChange = async (id: any) => {
  try {
    loading.value = true
    const res = (await getVariant(id))
    formState.product_id = res.product_id
    formState.name = res?.name ?? ''
    formState.sku = res?.sku ?? ''
    formState.barcode = res?.barcode ?? ''
    formState.images = res?.images ?? []
    formState.unit_price = res?.unit_price ?? 0
    if(res.unit_price) formState.unit_price = currencyInput(res.unit_price)
  } catch (e) {
    console.log(e)
  }
  loading.value = false
}

const getDiscountVariantValue = (): number => {
  if (formState?.discount_type == DISCOUNT_TYPE.CASH) return currencyNumber(formState.discount_value_cash) ?? 0
  else if (formState?.discount_type == DISCOUNT_TYPE.PERCENT)
    return (currencyNumber(formState.discount_value_percent) ?? 0) * 0.01 * (currencyNumber((formState.unit_price)) ?? 0) * (formState.quantity ?? 0)
  else return 0
}

defineExpose({ addProduct })
</script>

<style lang="scss"></style>
