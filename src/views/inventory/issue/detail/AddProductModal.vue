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
          default-data="product_inventory"
          :params="{inventory_id: inventoryId}"
        />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Số lượng tồn kho" name="number_inventory">
        <a-input-number class="!w-full" disabled v-model:value="formState.number_inventory" />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Số lượng" name="quantity">
        <a-input-number class="!w-full" v-model:value="formState.quantity" />
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
import { RECEIPT_DISCOUNT_TYPE } from '@/constant/receipt'

// COMPONENT
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'
import { useProductStore } from '@/stores/product'
import { useInventoryStore } from '@/stores/inventory'

//UTILS

type Props = {
  inventoryId: any
  issueList: any
}

const props = withDefaults(defineProps<Props>(), {})

import { currencyInput, currencyNumber } from '@/utils/currency'

const selectDataStore = useSelectDataStore()
const inventoryStore = useInventoryStore()
const productStore = useProductStore()

const { getVariant } = productStore
const { getInventoryDetail } = inventoryStore
const { searchInventoryList } = selectDataStore

const rules = {
  product_variant_id: [{ required: true, message: 'Sản phẩm bỏ trống!', trigger: 'blur' }],
  quantity: [{ required: true, message: 'Số lượng bỏ trống!', trigger: 'blur' }],
}

const formState = reactive({
  name: '',
  sku: '',
  barcode: '',
  images: '[]' as any,
  unit_price: 0,
  product_id: null as number | null,
  product_variant_id: null as number | null,
  fe_id: null as number | null,
  product_variant_name: '',
  quantity: 0,
  number_inventory: 0,
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

const addProduct = (product?: any) => {
  formState.name = product?.name ?? ''
  formState.sku = product?.sku ?? ''
  formState.images = product?.images ?? '[]'
  formState.unit_price = product?.unit_price ?? 0
  formState.barcode = product?.barcode ?? ''
  formState.product_variant_id = product?.product_variant_id ?? null
  formState.product_id = product?.product_id ?? null
  formState.quantity = product?.quantity ?? 0
  formState.number_inventory = product?.number_inventory ?? 0
  formState.product_variant_name = product?.product_variant_name ?? ''
  formState.fe_id = product?.fe_id ?? null
  open.value = true
  return new Promise<any>(async (resolve, reject) => {
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
const handleOk = () => {
  if (handleResole.value) handleResole.value(formState)
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
    const res = (await getInventoryDetail(id))

    const product = props.issueList.find((e: any) => e.product_variant_id = res?.product_variant?.id && res?.product_variant?.id)
    formState.name = res.product_variant?.name ?? ''
    formState.sku = res.product_variant?.sku ?? ''
    formState.barcode = res.product_variant?.barcode ?? ''
    formState.images = res.product_variant?.images ?? []
    formState.unit_price = res.product_variant?.unit_price ?? 0
    formState.product_id = res?.product?.id ?? null
    formState.product_variant_name = res?.product_variant?.name ?? ''
    // formState.product_variant_id = res?.product_variant?.id ?? null
    formState.number_inventory = res?.available ?? 0
    formState.quantity = product?.quantity
    formState.fe_id = product?.fe_id ?? null
  } catch (e) {
    console.log(e)
  }
  loading.value = false
}

defineExpose({ addProduct })
</script>

<style lang="scss"></style>
