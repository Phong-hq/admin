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

      <a-form-item
        class=""
        label="Tồn kho"
        name="number_inventory"
      >
        <a-input-number class="!w-full" v-model:value="formState.number_inventory" disabled/>
      </a-form-item>

      <a-form-item label="Chênh lệch" name="number_difference">
        <a-input-number class="!w-full" v-model:value="formState.number_difference" disabled/>
      </a-form-item>

      <a-form-item class="!col-span-2" label="Số lượng thực tế" name="number_difference" @input="() => {formState.number_difference = formState.number_adjustment - formState.number_inventory}" >
        <a-input-number class="!w-full" v-model:value="formState.number_adjustment" />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Lí do" name="reason">
        <a-input class="!w-full" v-model:value="formState.reason" />
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
import { currencyInput, currencyNumber } from '@/utils/currency'

type Props = {
  inventoryId: any
  stocktakingList: any
}

const props = withDefaults(defineProps<Props>(), {})

const selectDataStore = useSelectDataStore()
const inventoryStore = useInventoryStore()
const productStore = useProductStore()

const { getVariant } = productStore
const { getInventoryDetail } = inventoryStore

const rules = {
  product_variant_id: [{ required: true, message: 'Sản phẩm bỏ trống!', trigger: 'blur' }],
  quantity: [{ required: true, message: 'Số lượng bỏ trống!', trigger: 'blur' }],
  unit_price: [{ required: true, message: 'Đơn giá bỏ trống!', trigger: 'blur' }]
}

const formState = reactive({
  name: '',
  sku: '',
  barcode: '',
  unit_price: 0,
  images: '[]' as any,
  product_id: null as number | null,
  product_variant_id: null as number | null,
  number_inventory: 0,
  number_difference: 0,
  number_adjustment: 0,
  reason: ''
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
  formState.number_inventory = product?.number_inventory ?? 0
  formState.number_difference = product?.number_difference ?? 0
  formState.number_adjustment = product?.number_adjustment ?? 0

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
  let data = {
    ...formState,
  }
  console.log(formState)
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

    const res = (await getInventoryDetail(id))
    const product = props.stocktakingList.find((e: any) => e.product_variant_id = res?.product_variant?.id && res?.product_variant?.id)
    formState.product_id = res.product?.id ?? null
    formState.name = res.product_variant?.name ?? ''
    formState.sku = res.product_variant?.sku ?? ''
    formState.barcode = res.product_variant?.barcode ?? ''
    formState.images = res.product_variant?.images ?? []
    formState.unit_price = res.product_variant?.unit_price ?? 0
    formState.number_inventory = res.available ?? 0
    formState.number_difference = product?.number_difference ?? 0
    formState.number_adjustment =  product?.number_adjustment ?? 0
    formState.reason =  product?.reason ?? ''

  } catch (e) {
    console.log(e)
  }
  loading.value = false
}


defineExpose({ addProduct })
</script>

<style lang="scss"></style>
