<template>
  <a-modal class="" :width="700" v-model:open="open" title="Chỉnh sửa sản phẩm con" @ok="handleOk">
    <p class="mb-7">
      <span class="font-semibold">Sản phẩm: </span>
      {{ formState.name }}
    </p>
    <a-form
      :model="formState"
      class="form-2"
      ref="formRef"
      name="basic"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
      labelWrap
      autocomplete="off"
    >
      <a-form-item class="" label="SKU" name="sku">
<!--        <a-input v-model:value="formState.sku" />-->
        <c-random-number v-model="formState.sku" :length="9" />
      </a-form-item>
      <a-form-item class="" label="Mã vạch" name="barcode">
<!--        <a-input v-model:value="formState.barcode" />-->
        <c-random-number v-model="formState.barcode" :length="10" />

      </a-form-item>
      <a-form-item class="" label="Đơn giá" name="unit_price">
        <!-- <a-input v-model:value="formState.unit_price" /> -->
        <a-input
          v-model:value="formState.unit_price"
          @input="handleCurrencyInput('unit_price')"
        ></a-input>
      </a-form-item>
      <a-form-item class="" label="Giá sỉ" name="sll_price">
        <a-input
          v-model:value="formState.sll_price"
          @input="handleCurrencyInput('sll_price')"
        ></a-input>
        <!-- <a-input v-model:value="formState.sll_price" /> -->
      </a-form-item>
      <a-form-item class="!w-full !col-span-2 overflow-hidden" label="Hình ảnh" name="images">
        <c-image
          class="flex-center"
          list-type="picture-card"
          type="multiple"
          v-model="formState.images"
        ></c-image>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import CImage from '@/components/common/upload/CImage.vue'

// COMPONENT
import CRandomNumber from '@/components/common/input/CRandomNumber.vue'

// PINIA
import { useProductStore } from '@/stores/product'

//UTILS
import { currency, currencyInput } from '@/utils/currency'
import { handle_error, handle_success } from '@/utils/message'

const productStore = useProductStore()

type Props = {}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'get-data'): void
}>()

const formState = reactive({
  images: [] as string[],
  name: '',
  id: null as any,
  sku: '',
  barcode: '',
  unit_price: '',
  sll_price: ''
})

onMounted(() => {})

const open = ref(false)
const formRef = ref<any>([])
const productData = ref<any>(null)
const loading = ref(false)

const handleCurrencyInput = (key: 'unit_price' | 'sll_price') => {
  formState[key] = currencyInput(formState[key])
}

const handleOk = async () => {
  try {
    loading.value = true
    await productStore.updateVariant(formState)
    emits('get-data')
    open.value = false
    handle_success('Update successfully!!')
  } catch (error) {
    handle_error(error)
  } finally {
    loading.value = false
  }
}

const show = (data: any, id: any) => {
  productData.value = data ?? null
  const productItem = productData.value?.product_variants?.find((item: any) => item.id == id)
  if (productItem) {
    formState.id = productItem?.id ?? null
    formState.name = productItem?.name ?? ''
    formState.images = productItem?.images ?? []
    formState.sku = productItem?.sku ?? ''
    formState.barcode = productItem?.barcode ?? ''
    formState.unit_price = currencyInput(productItem?.unit_price ?? '')
    formState.sll_price = currencyInput(productItem?.sll_price ?? '')
    open.value = true
  }
}

defineExpose({ show })
</script>

<style lang="scss"></style>
