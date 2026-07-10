<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <p class="heading-1">Danh sách sản phẩm</p>
      <div class="flex gap-2">
<!--        <a-button class="" type="primary" @click="addProduct">-->
<!--          <template #icon v-if="isEdit">-->
<!--            <plus-outlined />-->
<!--          </template>-->
<!--          In barcode-->
<!--        </a-button>-->
        <print-bar-code-btn :variant="receipt_items" v-if="isEdit"/>
        <a-button class="!bg-blue" type="primary" @click="addProduct" v-if="!disabled">
          <template #icon>
            <plus-outlined />
          </template>
          Thêm sản phẩm
        </a-button>
        <a-button type="primary" danger @click="() => (receipt_items = [])" v-if="!disabled">
          <template #icon>
            <delete-outlined />
          </template>
          Xóa tất cả
        </a-button>
      </div>
    </div>
    <c-table-ant
      :columns="column"
      :data="receipt_items"
      :meta="productMeta"
      @getData="handlePageChange"
    >
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.key == 'tax_price'">
          {{ (text ?? 0) + '%' }}
        </template>
        <template
          v-else-if="
            column.key == 'unit_price' ||
            column.key == 'total_discount_value' ||
            column.key == 'sub_total_price' ||
            column.key == 'total_price'
          "
        >
          {{ currency(text) }}
        </template>

        <template v-else-if="column.key == 'action'">
          <span v-if="disabled"></span>
          <box-action @edit="editProduct(record)" @remove="removeProduct(record)" v-else/>
        </template>

        <template v-else-if="column.key == 'sub_total'">
          {{ currency((record?.unit_price ?? 0) * (record?.quantity ?? 0)) }}
        </template>

        <template v-else-if="column.key == 'quantity'">
          <a-input-number :value="record.quantity" v-if="!disabled" :min="0" @change="calculatorItems($event, record)"/>
          <span v-else>
            {{ text }}
          </span>
        </template>

        <template v-else-if="column.key == 'discount_value'">
          <span v-if="record?.discount_type == DISCOUNT_TYPE.CASH">
            {{ currency(record?.discount_value) }}
          </span>
          <span v-else-if="record?.discount_type == DISCOUNT_TYPE.PERCENT">
            {{ record?.discount_value + '%' }}
          </span>
        </template>

        <template v-else-if="column.key == 'name'">
          <popover-product :data="record"
            ><span class="text-link cursor-pointer">{{ text }}</span></popover-product
          >
        </template>

        <template v-else-if="column.key == 'discount'">
          <span v-if="record?.discount_type == DISCOUNT_TYPE.CASH">{{ currency(text) }}</span>
          <span v-else-if="record?.discount_type == DISCOUNT_TYPE.PERCENT">{{ text + '%' }}</span>
          <span v-else></span>
        </template>

        <template v-else-if="column.key == 'price'">
          {{
            currency(
              (record?.unit_price ?? 0) * (record?.quantity ?? 0) - getDiscountVariantValue(record)
            )
          }}
        </template>
      </template>
    </c-table-ant>
    <div class="flex flex-col items-end gap-y-1 mt-4">
      <div class="grid grid-cols-[150px_150px] gap-4" v-for="(item, i) in tableDataTotal" :key="i">
        <p class="font-bold">{{ item.label }}</p>
        <p class="text-right">{{ item.value }}</p>
      </div>
    </div>
    <add-product-modal ref="addProductModalRef" :receipt="data" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, reactive } from 'vue'
import type { RECEIPT_RESPONSE } from '@/types/inventory/inventory'
import type { COLUMN_TYPE } from '@/types/table'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { DISCOUNT_TYPE } from '@/constant'

// COMPONENT
import CTableAnt from '@/components/common/table/CTable.vue'
import AddProductModal from './AddProductModal.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { currency, currencyNumber } from '@/utils/currency'
import { handle_error } from '@/utils/message'
import BoxAction from '@/components/common/table/BoxAction.vue'
import PopoverProduct from '@/components/common/popover/Product.vue'
import PrintBarCodeBtn from '@/components/button/PrintBarCodeBtn.vue'

type Props = {
  data: RECEIPT_RESPONSE | null
  isEdit: boolean
  modelValue?: number
  subDataRef: any
  partnerRef: any
  disabled: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const selectDataStore = useSelectDataStore()

const column = computed<COLUMN_TYPE[]>(() => {
  let result = [] as COLUMN_TYPE[]
  result.push({
    title: 'Mã sản phẩm',
    key: 'sku'
  })
  result.push({
    title: 'Sản phẩm',
    key: 'name'
  })
  result.push({
    title: 'Đơn giá',
    key: 'unit_price',
    align: 'right'
  })
  result.push({
    title: 'Số lượng',
    key: 'quantity',
    align: 'right'
  })
  result.push({
    title: 'Giảm giá',
    key: 'discount_value',
    align: 'right'
  })
  result.push({
    title: 'Thành tiền',
    key: props.isEdit ? 'sub_total_price' : 'sub_total',
    align: 'right'
  })
  result.push({
    title: 'Thuế',
    key: 'tax_price',
    align: 'right'
  })
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
const productMeta = computed<MetaResponse>(() => {
  return {
    currentPage: currentPage.value,
    pageCount: Math.floor((props.data?.receipt_items?.length ?? 0) / 10),
    totalCount: props.data?.receipt_items?.length ?? 0,
    perPage: 10
  }
})

const receiptTotalQuantity = computed(() => {
  return receipt_items.value?.reduce(
    (result: number, currentItem: any) => result + (currentItem?.quantity ?? 0),
    0
  )
})
const receiptTotalPrice = computed(() => {
  return receipt_items.value?.reduce(
    (result: number, currentItem: any) =>
      result + (currentItem?.quantity ?? 0) * (currentItem?.unit_price ?? 0),
    0
  )
})
const receiptTotalDiscount = computed(() => {
  return receipt_items.value?.reduce(
    (result: number, currentItem: any) => result + getDiscountVariantValue(currentItem),
    0
  )
})
const tableDataTotal = computed(() => {
  return [
    {
      label: 'Số lượng:',
      value: receiptTotalQuantity.value
    },
    {
      label: 'Thành tiền:',
      value: currency(receiptTotalPrice.value)
    },
    {
      label: 'Giảm giá:',
      value: currency(receiptTotalDiscount.value)
    },
    {
      label: 'Tổng thanh toán:',
      value: currency(receiptTotalPrice.value - receiptTotalDiscount.value)
    }
  ]
})

onMounted(async () => {})

const currentPage = ref(1)
const addProductModalRef = ref<InstanceType<typeof AddProductModal> | null>(null)
const receipt_items = ref<any>([])
const currentId = ref(0)

const handlePageChange = (data: any) => {
  currentPage.value = data.page ?? 1
}

const addProduct = async () => {
  if (await checkSubDataValidate()) {
    const res = await addProductModalRef.value?.addProduct()
    const index = receipt_items.value.findIndex(
      (e: any) =>
        e.product_variant_id == res?.product_variant_id &&
        e.discount_type == res.discount_type &&
        e.discount_value == res.discount_value &&
        e.unit_price == res.unit_price
    )
    if (index > -1) {
      receipt_items.value[index].quantity = receipt_items.value[index].quantity + res?.quantity
    } else {
      currentId.value++
      receipt_items.value.push({ ...res, fe_id: currentId.value })
    }
  }
}

const checkSubDataValidate = async (): Promise<Boolean> => {
  try {
    await props.partnerRef?.validate()
    await props.subDataRef?.validate()
    return true
  } catch (error) {
    handle_error(error)
    return false
  }
}

const editProduct = async (product: any) => {
  const id = product.id
  if (await checkSubDataValidate()) {
    const res = await addProductModalRef.value?.addProduct(product)
    const fe_index = receipt_items.value?.findIndex((e: any) => e.fe_id == res.fe_id && res.fe_id)
    const index = receipt_items.value?.findIndex((e: any) => e.id == res.id && res.id)
    if (fe_index > -1) {
      receipt_items.value[fe_index] = { ...res }
    } else if (index > -1) {
      receipt_items.value[index] = { ...res }
    }
  }
}

const getDiscountVariantValue = (item: any): number => {
  if (item?.discount_type == DISCOUNT_TYPE.CASH) return item.discount_value ?? 0
  else if (item?.discount_type == DISCOUNT_TYPE.PERCENT)
    return (item.discount_value ?? 0) * 0.01 * (item.unit_price ?? 0) * (item.quantity ?? 0)
  else return 0
}

const removeProduct = (product: any) => {
  const id = product.id
  const index = receipt_items.value?.findIndex((e: any) => e.id == id && id)
  if (index > -1) {
    receipt_items.value.splice(index, 1)
  }
}

const getTotalForm = () => {
  return {
    sub_total_price: receiptTotalPrice.value,
    total_price: receiptTotalPrice.value - receiptTotalDiscount.value,
    quantity: receiptTotalQuantity.value
  }
}

const fillFormData = (receipt: RECEIPT_RESPONSE) => {
  receipt_items.value = receipt?.receipt_items.map((e: any) => {
    return {
      ...e,
      sku: e.product_variant?.sku ?? '',
      name: e?.product_variant?.name ?? '',
      product_variant_id: e?.product_variant?.id
    }
  })
}

const calculatorItems = (e: any, record: any) => {
  let item = { ...record, quantity: e }
  const getDiscountVariantValue = (data: any): number => {
    if (data?.discount_type == DISCOUNT_TYPE.CASH) return currencyNumber(data?.discount_value) ?? 0
    else if (data?.discount_type == DISCOUNT_TYPE.PERCENT)
      return (
        (currencyNumber(data?.discount_value) ?? 0) *
        0.01 *
        (currencyNumber(data?.unit_price) ?? 0) *
        (data?.quantity ?? 0)
      )
    else return 0
  }
  const sub_total_price = currencyNumber(item?.unit_price ?? 0) * (item?.quantity ?? 0)
  const discountVariantValue = getDiscountVariantValue(item)
  const total_price = sub_total_price - discountVariantValue
  item = { ...item, sub_total_price, total_price }
  const fe_index = receipt_items.value?.findIndex((e: any) => e.fe_id == item.fe_id && item.fe_id)
  const index = receipt_items.value?.findIndex((e: any) => e.id == item.id && item.id)
  if (fe_index > -1) {
    receipt_items.value[fe_index] = { ...item }
  } else if (index > -1) {
    receipt_items.value[index] = { ...item }
  }
}

defineExpose({ receipt_items, getTotalForm, fillFormData })
</script>

<style lang="scss"></style>
