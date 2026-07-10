<template>
  <div class="page-box-white">
    <!--    <p class="heading-1">Danh sách sản phẩm</p>-->
    <div class="flex justify-between items-center gap-2 mb-2">
      <p class="heading-1">Danh sách sản phẩm</p>
      <!--      <div class="flex gap-2 mb-4" v-if="isEdit">-->
      <!--        <a-tooltip title="Kênh bán" v-if="order?.channel">-->
      <!--          <a-tag class="!px-4 !py-1 !text-[16px]">{{ order?.channel }}</a-tag>-->
      <!--        </a-tooltip>-->
      <!--      </div>-->
      <create-button
        class="!bg-blue"
        type="primary"
        @click="showModalAddProduct()"
        v-if="isEdit && !disabled"
        >Thêm sản phẩm
      </create-button>
    </div>
    <c-table :columns="column" :data="formState" primary-key="id">
      <template #bodyCell="{ text, record, column }">
        <template
          v-if="
            column.key == 'unit_price' || column.key == 'sub_total' || column.key == 'total_price'
          "
        >
          {{ currency(text) }}
        </template>
        <template v-else-if="column.key == 'action'">
          <span v-if="disabled"></span>
          <box-action v-else @remove="removeProduct(record)">
            <template #edit><span></span></template>
          </box-action>
        </template>
        <template v-else-if="column.key == 'name'">
          <popover-product :data="record"
            ><span class="text-link cursor-pointer">{{ text }}</span></popover-product
          >
        </template>
        <template v-else-if="column.key == 'quantity'">
          <span v-if="disabled">{{ text }}</span>
          <a-input-number
            v-else
            :value="record.quantity"
            @change="handleQuantityChange($event, record)"
          />
        </template>
      </template>
      <template #footer v-if="!disabled"><span>Đơn hàng sẽ tự động cập nhập sau khi thực hiện thay đổi</span></template>
    </c-table>
    <div class="max-w-[340px] w-full grid grid-cols-[150px_auto] gap-y-2 ml-auto mt-7">
      <p class="font-semibold">Số lượng:</p>
      <p class="text-right">{{ order?.quantity || 0 }}</p>
      <p class="font-semibold">Tạm tính:</p>
      <p class="text-right">{{ currency(order?.sum_sub_total_product || 0) }}</p>
      <!--      <p class="text-blue font-semibold" :class="{'text-blue cursor-pointer': !disabled}">Giảm giá:</p>-->
      <p class="font-semibold" v-if="disabled">Giảm giá:</p>
      <edit-promotion-modal :data="order" @getData="handleEmitData" v-else
        ><p class="text-blue cursor-pointer font-semibold">Giảm giá:</p></edit-promotion-modal
      >
      <p class="text-right">{{ currency(order?.discount || 0) }}</p>
      <p class="font-semibold" v-if="disabled">VAT:</p>
      <edit-vat-modal :data="order" @getData="handleEmitData" v-else
        ><p class="text-blue cursor-pointer font-semibold">VAT:</p></edit-vat-modal
      >
      <p class="text-right">{{ currency(order?.tax_price || 0) }}</p>
      <p class="font-semibold" v-if="disabled">Phí vận chuyển:</p>
      <edit-delivery-modal :data="order" @getData="handleEmitData" v-else
        ><p class="text-blue cursor-pointer font-semibold">Phí vận chuyển:</p></edit-delivery-modal
      >
      <p class="text-right">{{ currency(order?.delivery_fee || 0) }}</p>
      <p class="font-semibold">Tổng thanh toán:</p>
      <p class="text-right">{{ currency(order?.payments || 0) }}</p>
    </div>
    <add-product-modal
      ref="addProductRef"
      :inventory-id="order?.inventory_id"
      :product-list="formState"
      :order="order"
      @getData="handleEmitData"
    ></add-product-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import type { ORDER_ITEMS_RESPONSE, ORDER_RESPONSE } from '@/types/order/website'

// COMPONENT
import CTable from '@/components/common/table/CTable.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import EditDeliveryModal from '@/views/order/detail/action/EditDeliveryModal.vue'
import EditVatModal from '@/views/order/detail/action/EditVatModal.vue'
import EditPromotionModal from '@/views/order/detail/action/EditPromotionModal.vue'
import AddProductModal from '@/views/order/detail/action/AddProductModal.vue'
import PopoverProduct from '@/components/common/popover/Product.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

// PINIA
import { useOrderStore } from '@/stores/order'
import { useRootStore } from '@/stores/root'

//UTILS
import { currency } from '@/utils/currency'
import { useDebounce } from '@/utils/debounce'
import { handle_error, handle_success } from '@/utils/message'

type Props = {
  data: any
  disabled: boolean
  order: ORDER_RESPONSE | null
  isEdit?: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'getData', res: ORDER_RESPONSE): void
}>()

const orderStore = useOrderStore()
const rootStore = useRootStore()

const { updateOrderProduct, removeOrderProduct } = orderStore
const { showLoading, hideLoading } = rootStore

const column = computed<COLUMN_TYPE[]>(() => {
  let result = [] as COLUMN_TYPE[]
  result.push({
    title: 'Mã sản phẩm',
    key: {
      name: 'sku',
      value: 'product_variant,sku',
      label: 'product_variant,sku'
    }
  })
  result.push({
    title: 'Sản phẩm',
    key: {
      name: 'name',
      value: 'product_variant,name',
      label: 'product_variant,name'
    }
  })
  result.push({
    title: 'Đơn giá',
    key: 'unit_price',
    align: 'right'
  })
  result.push({
    title: 'Tồn kho',
    key: 'number_inventory_current',
    align: 'right'
  })
  result.push({
    title: 'Số lượng',
    key: 'quantity',
    align: 'right'
  })
  // result.push({
  //   title: 'Giảm giá',
  //   key: props.isEdit ? 'discount' : 'discount',
  //   align: 'right'
  // })
  result.push({
    title: 'Thành tiền',
    key: props.isEdit ? 'sub_total' : 'sub_total',
    align: 'right'
  })
  // result.push({
  //   title: 'Thuế',
  //   key: 'tax_price',
  //   align: 'right'
  // })
  result.push({
    title: 'Tổng tiền',
    key: props.isEdit ? 'total_price' : 'total_price',
    align: 'right'
  })
  if (!props.disabled) {
    result.push({
      title: '-',
      key: 'action',
      align: 'center'
    })
  }
  return result
})

const handleEmitData = (res: ORDER_RESPONSE) => {
  emits('getData', res)
}

onMounted(() => {})

const formState = ref<ORDER_ITEMS_RESPONSE[]>([])
const addProductRef = ref<InstanceType<typeof AddProductModal> | null>(null)

const fillFormData = (order: ORDER_RESPONSE) => {
  formState.value = order?.order_items ?? []
}

const handleQuantityChange = (quantity: any, product: any) => {
  const index = formState.value.findIndex((e) => e.id && e.id == product?.id)
  if (index > -1) {
    const unit_price = formState.value[index].unit_price ?? 0
    formState.value[index].quantity = quantity
    formState.value[index].sub_total = quantity * unit_price
    formState.value[index].total_price = quantity * unit_price
  }
  calculatorProductItem(quantity, product)
}

const calculatorProductItem = useDebounce(async (quantity: any, product: any) => {
  try {
    const index = formState.value.findIndex((e) => e.id && e.id == product?.id)
    if (index > -1) {
      showLoading()
      const res = await updateOrderProduct(props.order?.id, {
        quantity: quantity,
        product_id: formState.value[index].product_id ?? 0,
        product_variant_id: formState.value[index].product_variant_id ?? 0
      })
      handle_success('Cập nhập sản phẩm thành công!')
      if (res) handleEmitData(res)
    }
  } catch (e) {
    handle_error(e, 'Cập nhập sản phẩm thất bại!')
  }
  hideLoading()
}, 300) as (a: any, b: any) => void

const removeProduct = async (product: any) => {
  try {
    showLoading()
    const res = await removeOrderProduct(props.order?.id, product?.id)
    handle_success('Xoá sản phẩm thành công!')
    if (res) handleEmitData(res)
  } catch (e) {
    handle_error(e, 'Xoá sản phẩm thất bạu!')
  }
  hideLoading()
}

const showModalAddProduct = async () => {
  const res = await addProductRef.value?.addProduct()
}

defineExpose({ fillFormData, formState })
</script>

<style lang="scss"></style>
