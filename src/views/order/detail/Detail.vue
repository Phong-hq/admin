<template>
  <div class="min-h-full relative">
    <c-breadcrumb :page="isEdit && order?.code ? ('Đơn hàng ' + order?.code) : ''" />

    <div class="page-box-white" v-if="isEdit && !(order?.channel == 'pos')">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div class="flex items-center gap-2.5">
          <span class="text-lg font-bold">{{ order?.code }}</span>
          <a-tag class="!m-0" v-if="order?.channel">{{ order?.channel }}</a-tag>
        </div>
        <p class="!mb-0 text-sm text-C82" v-if="order?.created_at">
          Tạo lúc {{ createdAtLabel }}
        </p>
      </div>
      <order-progress :order="order" @getData="handleGetData" :is-disabled="disabled" />
    </div>

    <div class="flex flex-col xl:flex-row gap-4 mt-4">
      <div class="grow min-w-0 flex flex-col gap-y-4">
        <div class="page-box-white" v-if="!isEdit">
          <p class="heading-1">Thông tin đơn hàng</p>
          <info ref="infoRef" :order="order" :is-edit="isEdit" :disabled="disabled" />
        </div>
        <product-list
          ref="productListRef"
          :data="order?.order_items || []"
          :order="order"
          :disabled="disabled"
          :is-edit="isEdit"
          @getData="handleGetData"
          v-else
        />
      </div>
      <div class="shrink-0 w-full xl:w-[360px] flex flex-col gap-y-4">
        <div class="page-box-white" v-if="isEdit">
          <p class="heading-1">Thông tin đơn hàng</p>
          <info ref="infoRef" :order="order" :is-edit="isEdit" :disabled="disabled" @get-data="handleGetData" />
        </div>
        <classify
          ref="classyRef"
          v-model="classyState"
          :disabled="disabled"
          :is-edit="isEdit"
          :order="order"
          @getData="handleGetData"
        />
      </div>
    </div>

    <div class="action-bar" v-if="!isEdit">
      <a-button class="min-w-[180px]" size="large" type="primary" @click="submit">Tạo đơn hàng</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import type { ORDER_RESPONSE } from '@/types/order/website'
import { ORDER_STATUS, ORDER_STATUS_DATA } from '@/constant/order'
import { DATE_RENDER, TIME_RENDER } from '@/utils/dayjs-helper'

// COMPONENT
import Classify from '@/views/order/detail/Classify.vue'
import ProductList from '@/views/order/detail/ProductList.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import Info from '@/views/order/detail/Info.vue'
import OrderProgress from '@/views/order/detail/OrderProgress.vue'

// PINIA
import { useOrderStore } from '@/stores/order'
import { useRootStore } from '@/stores/root'
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const rootStore = useRootStore()
const selectDataStore = useSelectDataStore()

const { getOrderDetail, updateOrderStatus, updateOrder, createOrder, setWaitingOrder } = orderStore
const { showLoading, hideLoading } = rootStore

const orderId = computed(() => String(route.params.id))
const isEdit = computed(() => route?.name == 'order-edit-detail')
const disabled = computed(
  () =>
    isEdit.value &&
    (ORDER_STATUS.Cancel == order.value?.status ||
      ORDER_STATUS.Done == order.value?.status ||
      ORDER_STATUS.Approved == order.value?.status ||
      ORDER_STATUS.Pack == order.value?.status ||
      ORDER_STATUS.Out_Of_Stock == order.value?.status ||
      order.value?.channel == 'pos')
)

const createdAtLabel = computed(() => {
  if (!order.value?.created_at) return ''
  return `${dayjs(order.value.created_at).format(DATE_RENDER)} ${dayjs(order.value.created_at).format(TIME_RENDER)}`
})

onMounted(() => {
  selectDataStore.getOfficeList()
  selectDataStore.getInventoryList()
  selectDataStore.getClientList()
  initData()
})

const classyState = reactive({
  inventory_id: null as number | null,
  office_id: null as number | null,
  price_policy: '',
  note: ''
})

const order = ref<ORDER_RESPONSE | null>(null)
const infoRef = ref<InstanceType<typeof Info> | null>(null)
const classyRef = ref<InstanceType<typeof Classify> | null>(null)
const productListRef = ref<InstanceType<typeof ProductList> | null>(null)

const initData = async () => {
  try {
    if (!orderId.value) return
    showLoading()
    if (isEdit.value) {
      order.value = await getOrderDetail(orderId.value)
      fillFormData(order.value)
    }
  } catch (error) {
    handle_error(error)
  } finally {
    hideLoading()
  }
}

const fillFormData = (order: ORDER_RESPONSE) => {
  classyState.inventory_id = order?.inventory_id ?? null
  classyState.note = order?.note ?? ''
  classyState.office_id = order?.office_id ?? null
  classyState.price_policy = order?.price_policy ?? ''
  productListRef.value?.fillFormData(order)
  infoRef.value?.fillFormData(order)
}

const handleGetData = (data: ORDER_RESPONSE) => {
  order.value = data
  fillFormData(data)
}

const submit = async () => {
  try {
    await classyRef.value?.validate()
    showLoading()
    let data = {
      ...order.value,
      ...classyState,
      ...infoRef.value?.getFormState(),
      ...productListRef.value?.formState
    }
    let res = null
    if (isEdit.value) {
      res = await updateOrder(data)
    } else {
      res = await createOrder(data)
      order.value = res
      await router.push({ name: 'order-edit-detail', params: { id: res?.id } })
    }
    handleGetData(res)
  } catch (e) {
    handle_error(e, isEdit.value ? 'Cập nhập đơn hàng  thất bại!' : 'Tạo đơn hàng thất bại!')
  }
  hideLoading()
}


</script>

<style lang="scss" scoped>
.action-bar {
  position: sticky;
  bottom: 0;
  z-index: 2;
  margin-top: 28px;
  padding: 14px 0;
  display: flex;
  justify-content: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  border-top: 1px solid var(--color-CDE);
}
</style>
