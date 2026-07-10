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
          :extra-data="[
            {
              value: formState.product_variant_id,
              label: formState.name
            }
          ]"
          :params="{ inventory_id: inventoryId }"
        />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Tồn kho" name="number_inventory">
        <a-input-number class="!w-full" v-model:value="formState.number_inventory" disabled />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Số lượng" name="number_difference">
        <a-input-number
          class="!w-full"
          :max="formState.number_inventory ?? 0"
          v-model:value="formState.quantity"
        />
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
import { useProductStore } from '@/stores/product'
import { useOrderStore } from '@/stores/order'
import { useInventoryStore } from '@/stores/inventory'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

type Props = {
  inventoryId: any
  productList: any
  order: ORDER_RESPONSE | null
}
const emits = defineEmits<{
  (e: 'getData', res: ORDER_RESPONSE): void
}>()

const props = withDefaults(defineProps<Props>(), {})

const selectDataStore = useSelectDataStore()
const orderStore = useOrderStore()
const productStore = useProductStore()
const inventoryStore = useInventoryStore()

const { getVariant } = productStore
const { updateOrderProduct } = orderStore
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
  quantity: 0,
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
  formState.number_inventory = product?.number_inventory_current ?? 0
  formState.quantity = product?.quantity ?? 0

  open.value = true
  // return new Promise<ORDER_ITEMS_RESPONSE>(async (resolve, reject) => {
  //   handleResole.value = (data: ORDER_ITEMS_RESPONSE) => {
  //     resolve(data)
  //     isSubmit.value = true
  //     open.value = false
  //   }
  //   handleReject.value = () => {
  //     reject()
  //     open.value = false
  //   }
  // })
}
const handleOk = async () => {
  try {
    loading.value = true
    let data = {
      quantity: formState.quantity ?? 0,
      product_variant_id: formState.product_variant_id ?? 0,
      product_id: formState.product_id ?? 0
    }
    const res = await updateOrderProduct(props?.order?.id, data)
    emits('getData', res)
    handle_success('Cập nhập sản phẩm thành công!')
    open.value = false
    console.log(res)
  } catch (error) {
    handle_error(error, 'Cập nhập sản phẩm thất bại!')
  }
  loading.value = false
}

const handleAfterClose = () => {
  // if (!isSubmit.value && handleReject.value) {
  //   handleReject.value()
  // }
  // isSubmit.value = false
  // handleReject.value = null
  // handleResole.value = null
}

const handleChooseVariantChange = async (id: any) => {
  try {
    loading.value = true

    const res = await getInventoryDetail(id)
    const product = props.productList.find(
      (e: any) => e.product_variant?.id == res?.product_variant?.id && res?.product_variant?.id
    )
    formState.product_id = res.product?.id ?? null
    formState.product_variant_id = res?.product_variant?.id ?? null
    formState.name = res.product_variant?.name ?? ''
    formState.sku = res.product_variant?.sku ?? ''
    formState.barcode = res.product_variant?.barcode ?? ''
    formState.images = res.product_variant?.images ?? []
    formState.unit_price = res.product_variant?.unit_price ?? 0
    formState.number_inventory = res.available ?? 0
    formState.quantity = product?.quantity ?? 0
    formState.reason = product?.reason ?? ''
  } catch (e) {
    console.log(e)
  }
  loading.value = false
}

defineExpose({ addProduct })
</script>

<style lang="scss"></style>
