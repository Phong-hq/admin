<template>
  <div>
    <div class="flex justify-between items-center">
      <p class="heading-1">Danh sách sản phẩm</p>
      <div class="flex gap-2" v-if="!isEdit">
        <a-button class="!bg-blue" type="primary" @click="addProduct">
          <template #icon>
            <plus-outlined />
          </template>
          Thêm sản phẩm
        </a-button>
        <a-button type="primary" danger @click="() => (stocktaking_items = [])">
          <template #icon>
            <delete-outlined />
          </template>
          Xóa tất cả
        </a-button>
      </div>
    </div>
    <c-table-ant
      :columns="column"
      :data="isEdit ? (data?.stocktaking_items ?? []) : stocktaking_items"
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
          <box-action @edit="editProduct(record)" @remove="removeProduct(record)" />
        </template>

<!--        <template v-else-if="column.key == 'name'">-->
<!--          <popover-product :data="record" ><span class="text-link cursor-pointer">{{text}}</span></popover-product>-->
<!--        </template>-->
      </template>
    </c-table-ant>
<!--    <div class="flex flex-col items-end gap-y-1 mt-4">-->
<!--      <div class="grid grid-cols-[150px_150px] gap-4" v-for="(item, i) in tableDataTotal" :key="i">-->
<!--        <p class="font-bold">{{ item.label }}</p>-->
<!--        <p class="text-right">{{ item.value }}</p>-->
<!--      </div>-->
<!--    </div>-->
    <add-product-modal
      :inventory-id="subDataState?.inventory_id"
      :stocktaking-list="stocktaking_items"
      ref="addProductModalRef"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, reactive } from 'vue'
import type { RECEIPT_RESPONSE } from '@/types/inventory/inventory'
import type { COLUMN_TYPE } from '@/types/table'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { RECEIPT_DISCOUNT_TYPE } from '@/constant/receipt'

// COMPONENT
import CTableAnt from '@/components/common/table/CTable.vue'
import AddProductModal from '@/views/inventory/stocktaking/detail/AddProductModal.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import PopoverProduct from '@/components/common/popover/Product.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { currency } from '@/utils/currency'
import { handle_error } from '@/utils/message'

type Props = {
  data: any | null
  isEdit: boolean
  modelValue?: number
  subDataState: any
  subDataRef: any
}

const props = withDefaults(defineProps<Props>(), {})
console.log(props.data)

const selectDataStore = useSelectDataStore()

const column = computed<COLUMN_TYPE[]>(() => {
  let result = [] as COLUMN_TYPE[]
  result.push({
    title: 'Mã sản phẩm',
    key: props.isEdit ? 'id' : 'sku'
  })
  result.push({
    title: 'Sản phẩm',
    key: 'name'
  })
  result.push({
    title: 'Số lượng thực tế',
    key: 'number_adjustment',
    align: 'right'
  })
  result.push({
    title: 'Số lượng trong kho',
    key: 'number_inventory',
    align: 'right'
  })
  result.push({
    title: 'Sự chênh lệch',
    key: 'number_difference',
    align: 'right'
  })
  result.push({
    title: 'Lí do',
    key: 'reason',
    align: 'right'
  })
  if (!props.isEdit) {
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
    pageCount: Math.floor((props.data?.stocktaking_items?.length ?? 0) / 10),
    totalCount: props.data?.stocktaking_items?.length ?? 0,
    perPage: 10
  }
})

const receiptTotalQuantity = computed(() => {
  return stocktaking_items.value?.reduce(
    (result: number, currentItem: any) => result + (currentItem?.quantity ?? 0),
    0
  )
})
const receiptTotalPrice = computed(() => {
  return stocktaking_items.value?.reduce(
    (result: number, currentItem: any) =>
      result + (currentItem?.quantity ?? 0) * (currentItem?.unit_price ?? 0),
    0
  )
})
const receiptTotalDiscount = computed(() => {
  return stocktaking_items.value?.reduce(
    (result: number, currentItem: any) => result + getDiscountVariantValue(currentItem),
    0
  )
})
const tableDataTotal = computed(() => {
  return [
    {
      label: 'Số lượng:',
      value: props.isEdit ? (props.data?.quantity ?? 0) : receiptTotalQuantity.value
    },
    {
      label: 'Thành tiền:',
      value: props.isEdit
        ? currency(props.data?.sub_total_price ?? 0)
        : currency(receiptTotalPrice.value)
    },
    {
      label: 'Giảm giá:',
      value: props.isEdit
        ? currency(props.data?.total_discount_value ?? 0)
        : currency(receiptTotalDiscount.value)
    },
    {
      label: 'Tổng thanh toán:',
      value: props.isEdit
        ? currency(props.data?.total_price ?? 0)
        : currency(receiptTotalPrice.value - receiptTotalDiscount.value)
    }
  ]
})

onMounted(async () => {})

const currentPage = ref(1)
const addProductModalRef = ref<InstanceType<typeof AddProductModal> | null>(null)
const stocktaking_items = ref<any>([])
const currentId = ref(0)

const handlePageChange = (data: any) => {
  currentPage.value = data.page ?? 1
}

const addProduct = async () => {
  if (await checkSubDataValidate()) {
    const res = await addProductModalRef.value?.addProduct()
    const index = stocktaking_items.value.findIndex(
      (e: any) =>
        e.product_variant_id == res?.product_variant_id &&
        e.discount_type == res.discount_type &&
        e.discount_value == res.discount_value &&
        e.unit_price == res.unit_price
    )
    if (index > -1) {
      stocktaking_items.value[index].quantity = stocktaking_items.value[index].quantity + res?.quantity
    } else {
      currentId.value++
      stocktaking_items.value.push({ ...res, id: currentId.value })
    }
  }
}

const checkSubDataValidate = async (): Promise<Boolean> => {
  try {
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
    const index = stocktaking_items.value?.findIndex((e: any) => e.id == id && id)
    if (index > -1) {
      const res = await addProductModalRef.value?.addProduct(product)
      stocktaking_items.value[index] = { ...res, id }
    }
  }
}

const getDiscountVariantValue = (item: any): number => {
  if (item?.discount_type == RECEIPT_DISCOUNT_TYPE.CASH) return item.discount_value ?? 0
  else if (item?.discount_type == RECEIPT_DISCOUNT_TYPE.PERCENT)
    return (item.discount_value ?? 0) * 0.01 * (item.unit_price ?? 0) * (item.quantity ?? 0)
  else return 0
}

const removeProduct = (product: any) => {
  const id = product.id
  const index = stocktaking_items.value?.findIndex((e: any) => e.id == id && id)
  if (index > -1) {
    stocktaking_items.value.splice(index, 1)
  }
}

const getTotalForm = () => {
  return {
    sub_total_price: receiptTotalPrice.value,
    total_price: receiptTotalPrice.value - receiptTotalDiscount.value,
    quantity: receiptTotalQuantity.value
  }
}

defineExpose({ stocktaking_items, getTotalForm })
</script>

<style lang="scss"></style>
