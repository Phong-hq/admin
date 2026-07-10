<template>
  <div>
    <div class="flex justify-between items-center">
      <p class="heading-1">Tạo phiếu xuất kho</p>
      <div class="flex gap-2" v-if="!isEdit">
        <a-button class="!bg-blue" type="primary" @click="addProduct">
          <template #icon>
            <plus-outlined />
          </template>
          Thêm sản phẩm
        </a-button>
        <a-button type="primary" danger @click="() => (issue_items = [])">
          <template #icon>
            <delete-outlined />
          </template>
          Xóa tất cả
        </a-button>
      </div>
    </div>
    <c-table-ant
      :columns="column"
      :data="isEdit ? (data?.issue_items ?? []) : issue_items"
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

        <template v-else-if="column.key == 'product_variant_name'">
          <popover-product :data="record" ><span class="text-link">{{text}}</span></popover-product>
        </template>

        <template v-else-if="column.key == 'sub_total'">
          {{ currency((record?.unit_price ?? 0) * (record?.quantity ?? 0)) }}
        </template>

        <template v-else-if="column.key == 'discount_value'">
          <span v-if="record?.discount_type == RECEIPT_DISCOUNT_TYPE.CASH">
            {{ currency(record?.discount_value) }}
          </span>
          <span v-else-if="record?.discount_type == RECEIPT_DISCOUNT_TYPE.PERCENT">
            {{ record?.discount_value + '%' }}
          </span>
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
    <!--    <div class="flex flex-col items-end gap-y-1 mt-4">-->
    <!--      <div class="grid grid-cols-[150px_150px] gap-4" v-for="(item, i) in tableDataTotal" :key="i">-->
    <!--        <p class="font-bold">{{ item.label }}</p>-->
    <!--        <p class="text-right">{{ item.value }}</p>-->
    <!--      </div>-->
    <!--    </div>-->
    <add-product-modal
      :inventory-id="subDataState?.inventory_id"
      :issue-list="issue_items"
      ref="addProductModalRef"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, reactive } from 'vue'
import type { ISSUE_RESPONSE, RECEIPT_RESPONSE } from '@/types/inventory/inventory'
import type { COLUMN_TYPE } from '@/types/table'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { RECEIPT_DISCOUNT_TYPE } from '@/constant/receipt'

// COMPONENT
import CTableAnt from '@/components/common/table/CTable.vue'
import AddProductModal from '@/views/inventory/issue/detail/AddProductModal.vue'
import PopoverProduct from '@/components/common/popover/Product.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { currency } from '@/utils/currency'
import { handle_error } from '@/utils/message'
import BoxAction from '@/components/common/table/BoxAction.vue'

type Props = {
  data: ISSUE_RESPONSE | null
  isEdit: boolean
  subDataState: any
  modelValue?: number
  subDataRef: any
}

const props = withDefaults(defineProps<Props>(), {})

const selectDataStore = useSelectDataStore()

const column = computed<COLUMN_TYPE[]>(() => {
  let result = [] as COLUMN_TYPE[]
  result.push({
    title: 'Tên sản phẩm',
    key: 'product_variant_name'
  })
  result.push({
    title: 'Kho',
    key: 'number_inventory',
    align: 'right'
  })
  result.push({
    title: 'SL xuất kho',
    key: 'quantity',
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
    pageCount: Math.floor((props.data?.issue_items?.length ?? 0) / 10),
    totalCount: props.data?.issue_items?.length ?? 0,
    perPage: 10
  }
})

onMounted(async () => {})

const currentPage = ref(1)
const addProductModalRef = ref<InstanceType<typeof AddProductModal> | null>(null)
const issue_items = ref<any>([])
const currentId = ref(0)

const handlePageChange = (data: any) => {
  currentPage.value = data.page ?? 1
}

const addProduct = async () => {
  if (await checkSubDataValidate()) {
    const res = await addProductModalRef.value?.addProduct()
    const index = issue_items.value.findIndex(
      (e: any) => e.product_variant_id == res?.product_variant_id
    )
    if (index > -1) {
      issue_items.value[index] = res
    } else {
      currentId.value++
      issue_items.value.push({ ...res, fe_id: currentId.value })
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
  if (await checkSubDataValidate()) {
    const res = await addProductModalRef.value?.addProduct(product)
    const fe_index = issue_items.value?.findIndex((e: any) => e.fe_id == res.fe_id && res.fe_id)
    if (fe_index > -1) {
      issue_items.value[fe_index] = { ...res }
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
  const id = product.fe_id
  const index = issue_items.value?.findIndex((e: any) => e.fe_id == id && id)
  if (index > -1) {
    issue_items.value.splice(index, 1)
  }
}

// const getTotalForm = () => {
//   return {
//     sub_total_price: receiptTotalPrice.value,
//     total_price: receiptTotalPrice.value - receiptTotalDiscount.value,
//     quantity: receiptTotalQuantity.value
//   }
// }

const fillFormData = (issue: ISSUE_RESPONSE) => {

}

defineExpose({ issue_items })
</script>

<style lang="scss"></style>
