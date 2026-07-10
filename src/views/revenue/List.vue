<template>
  <c-breadcrumb />
  <div class="page-box-white">
    <div class="grid lg:grid-cols-2 md:grid-cols-1 gap-3 mb-4">
      <div class="flex lg:justify-start justify-between items-center gap-2">
        <p class="heading-1 mb-0">Doanh thu</p>
        <c-select
          :value="listType"
          :data="[
            { label: 'Đơn hàng', value: TYPE.ORDER },
            { label: 'Sản phẩm', value: TYPE.PRODUCTION }
          ]"
          @change="handleTypeChange"
        ></c-select>
      </div>
      <div class="flex lg:justify-end justify-between flex-wrap items-center gap-2">
        <p class="font-semibold">Chọn ngày:</p>
          <div class="sm:hidden block w-full">
            <c-date-range-picker-mobile class="w-full" v-model:value="date" @change="initDataMobile" />
          </div>
          <div class="sm:block hidden sm:max-w-[285px] max-w-full">
            <c-date-range-picker class="w-full" v-model:value="date" @change="initData()" />
          </div>
      </div>
    </div>
    <c-table-ant
      class=""
      :columns="columns"
      :data="orders_revenue"
      :meta="meta"
      primary-key="id"
      expand-title="test"
      :loading="tableLoading"
      @get-data="initData"
      v-if="TYPE.ORDER == listType"
    >
      <template #bodyCell="{ text, record, column }">
        <template
          v-if="
            column.key == 'delivery_fee' ||
            column.key == 'sum_sub_total_product' ||
            column.key == 'sum_discount_product' ||
            column.key == 'total_price_return' ||
            column.key == 'total_price'
          "
        >
          {{ currency(text) }}
        </template>
        <template v-if="column.key == 'payment_1'">
          {{ currency(record.paymentMethods.TM_01?.payment) }}
        </template>
        <template v-if="column.key == 'payment_2'">
          {{ currency(record.paymentMethods.CK_02?.payment) }}
        </template>
        <template v-if="column.key == 'payment_3'">
          {{ currency(record.paymentMethods.QT_03?.payment) }}
        </template>

        <template v-else-if="column.key == 'action'">
          <box-action hide-remove hide-edit view @view="goToEditPageDetail(record)" />
        </template>
      </template>
      <template #summary>
        <a-table-summary fixed v-if="orders_revenue.length">
          <a-table-summary-row>
            <a-table-summary-cell class="heading-2">Tổng tiền:</a-table-summary-cell>
            <a-table-summary-cell class="heading-2 text-right"
              >{{ sum?.sum_quantity }}
            </a-table-summary-cell>
            <a-table-summary-cell class="heading-2 text-right"
              >{{ currency(sum?.sum_delivery_fee) }}
            </a-table-summary-cell>
            <a-table-summary-cell class="heading-2 text-right"
              >{{ currency(sum?.sum_cash_payment) }}
            </a-table-summary-cell>
            <a-table-summary-cell class="heading-2 text-right"
              >{{ currency(sum?.sum_transfer_payment) }}
            </a-table-summary-cell>
            <a-table-summary-cell class="heading-2 text-right"
              >{{ currency(sum?.sum_card_payment) }}
            </a-table-summary-cell>
            <a-table-summary-cell class="heading-2 text-right"
              >{{ currency(sum?.sum_all_sub_total_product) }}
            </a-table-summary-cell>
            <a-table-summary-cell class="heading-2 text-right"
              >{{ currency(sum?.sum_discount) }}
            </a-table-summary-cell>
            <a-table-summary-cell class="heading-2 text-right"
              >{{ currency(sum?.sum_return) }}
            </a-table-summary-cell>
            <a-table-summary-cell class="heading-2 text-right"
              >{{ currency(sum?.sum_total_price) }}
            </a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template>
    </c-table-ant>
    <c-table-ant
      class=""
      :columns="columns2"
      :data="variants_revenue"
      :meta="meta"
      primary-key="id"
      expand-title="test"
      :loading="tableLoading"
      @get-data="initData"
      v-else
    >
      <template #bodyCell="{ text, record, column }">
        <template
          v-if="
            column.key == 'sum_sub_total' ||
            column.key == 'total_discount_price' ||
            column.key == 'total_price_return' ||
            column.key == 'payment_after_return' ||
            column.key == 'payment_before_return'
          "
        >
          {{ currency(text) }}
        </template>
        <template v-if="column.key == 'supplier_name'">
          <div class="flex gap-2">
            <a-tag v-for="item in record?.suppliers" :key="item.id">{{ item.name }}</a-tag>
          </div>
        </template>
        <template v-if="column.key == 'product_variant_name'">
          <popover-product class="cursor-pointer" :data="record.product_variant" ><span class="text-link">{{text}}</span></popover-product>
        </template>
      </template>
    </c-table-ant>
  </div>
</template>

<script lang="ts" setup>
import type {
  REVENUE_ORDER_RESPONSE,
  REVENUE_SUM_RESPONSE,
  REVENUE_VARIANT_RESPONSE
} from '@/types/revenue/revenue'
import dayjs, { type Dayjs } from 'dayjs'
import { ref, onMounted, computed } from 'vue'
import { DATE_REQUEST_FORMAT } from '@/utils/dayjs-helper'
import type { COLUMN_TYPE } from '@/types/table'
import { useRouter } from 'vue-router'

// COMPONENT
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import PopoverProduct from '@/components/common/popover/Product.vue'

// PINIA
import { useRevenueStore } from '@/stores/revenue'
import { useRootStore } from '@/stores/root'

//UTILS
import { currency } from '@/utils/currency'
import { handle_error } from '@/utils/message'
import CDateRangePicker from '@/components/common/date-picker/CDateRangePicker.vue'
import CDateRangePickerMobile from '@/components/common/date-picker/CDateRangePickerMobile.vue'
import CSelect from '@/components/common/select/CSelect.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'

const revenueStore = useRevenueStore()
const router = useRouter()
const rootStore = useRootStore()
const isMobileComputed = computed(() => rootStore.isMobile)

const { getRevenueList, getRevenueVariantList } = revenueStore

enum TYPE {
  ORDER = 1,
  PRODUCTION = 2
}

const columns = [
  {
    title: 'Mã đơn hàng',
    key: 'code',
    width: 150
  },
  // {
  //   title: 'Kênh bán',
  //   key: 'channel',
  //   hidden: true
  // },
  {
    title: 'Số lượng',
    key: 'quantity',
    align: 'right'
  },
  {
    title: 'Phí vận chuyển',
    key: 'delivery_fee',
    align: 'right'
  },
  {
    title: 'Phương thức',
    key: 'payment',
    childrenKeys: ['payment_1', 'payment_2', 'payment_3']
  },
  {
    title: 'Tiền mặt',
    key: 'payment_1',
    align: 'right'
  },
  {
    title: 'Chuyển khoản',
    key: 'payment_2',
    align: 'right'
  },
  {
    title: 'Quẹt thẻ',
    key: 'payment_3',
    align: 'right'
  },
  {
    title: 'Tổng tiền hàng',
    key: 'sum_sub_total_product',
    align: 'right'
  },

  {
    title: 'Giảm giá',
    key: 'sum_discount_product',
    align: 'right'
  },
  {
    title: 'Hoàn trả',
    key: 'total_price_return',
    align: 'right'
  },
  {
    title: 'Tổng cộng',
    key: 'total_price',
    align: 'right'
  },

  {
    title: '-',
    key: 'action'
  }
] as COLUMN_TYPE[]

const columns2 = [
  {
    title: 'Nhà cung cấp',
    key: 'supplier_name',
    inputProps: { inputType: 'text' },
    width: 'lg',
    isFilter: true
  },
  {
    title: 'Mã sản phẩm',
    key: {
      name: 'sku',
      value: 'product_variant,sku',
      label: 'product_variant,sku'
    },
    width: 'md',
    inputProps: { inputType: 'text' }
  },
  {
    title: 'Tên sản phẩm',
    key: {
      name: 'product_variant_name',
      value: 'product_variant,name',
      label: 'product_variant,name'
    },
    inputProps: { inputType: 'text' }
  },
  {
    title: 'SL đã bán',
    key: 'bought',
    width: 'md',
    align: 'right',
    sorter: true
  },
  {
    title: 'Tổng bán',
    key: 'sum_sub_total',
    width: 'md',
    // sorter: true,
    align: 'right',
  },
  {
    title: 'Tổng khuyến mãi',
    key: 'total_discount_price',
    width: 'md',
    // sorter: true,
    align: 'right',
  },
  {
    title: 'Tổng trả',
    key: 'total_price_return',
    width: 'md',
    // sorter: true,
    align: 'right'
  },
  {
    title: 'Tổng cộng',
    key: 'payment_after_return',
    width: 'md',
    // sorter: true,
    align: 'right'
  }
] as COLUMN_TYPE[]

onMounted(() => {
  handleTypeChange(TYPE.ORDER)
})

const tableLoading = ref(false)
const orders_revenue = ref<REVENUE_ORDER_RESPONSE[]>([])
const variants_revenue = ref<REVENUE_VARIANT_RESPONSE[]>([])
const sum = ref<REVENUE_SUM_RESPONSE | null>(null)
const meta = ref<MetaResponse | null>(null)
const date = ref<[Dayjs | null, Dayjs | null]>([null, null])
const listType = ref(TYPE.ORDER)

const initDataMobile = async (value: any) => {
  date.value = value
  await initData()
}

const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    let data = {
      ...param,
      date: date.value
    }

    if (data.date && data.date[0]) {
      data.start_date = dayjs(data.date[0]).format(DATE_REQUEST_FORMAT)
      data.end_date = dayjs(data.date[1]).format(DATE_REQUEST_FORMAT)
    }
    if (listType.value == TYPE.ORDER) {
      const res = await getRevenueList(data)
      orders_revenue.value = res.items
      sum.value = res.sum_order
      meta.value = res._meta
    } else {
      const res = await getRevenueVariantList(data)
      variants_revenue.value = res.items
      meta.value = res._meta
    }
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const goToEditPageDetail = (item: any) => {
  // router.push({ name: 'order-edit-detail', params: { id: item.id } })
  window?.open(`/order/edit-detail/${item.id}`, '_blank')
}

const handleTypeChange = (e: TYPE) => {
  listType.value = e
  initData()
}
</script>

<style lang="scss"></style>
