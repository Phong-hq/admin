<template>
  <div class="min-h-full relative">
    <c-breadcrumb :page="isEdit && order?.code ? ('Chỉnh sửa đơn hàng ' + order?.code) : ''" />
    <div class="w-full page-box-white" v-if="isEdit && !(order?.channel == 'pos')">
      <order-progress :order="order" @getData="handleGetData" :is-disabled="disabled" />
    </div>
    <div class="grid xl:grid-cols-[1fr_280px] grid-cols-1 gap-4 mt-4">
      <div class="w-full">
        <div class="page-box-white" v-if="!isEdit">
          <p class="heading-1">Thông tin đơn hàng</p>
          <info class="" ref="infoRef" :order="order" :is-edit="isEdit" :disabled="disabled"/>
        </div>
        <product-list
          ref="productListRef"
          class=""
          :data="order?.order_items || []"
          :order="order"
          :disabled="disabled"
          :is-edit="isEdit"
          @getData="handleGetData"
          v-else
        />
      </div>
      <div class="flex flex-col gap-y-4">
        <div class="page-box-white" v-if="isEdit">
          <div class="flex justify-between items-center gap-2">
            <p class="heading-1">Thông tin đơn hàng</p>
          </div>
          <info ref="infoRef" :order="order" :is-edit="isEdit" :disabled="disabled" @get-data="handleGetData" />
        </div>
        <classify
          class=""
          ref="classyRef"
          v-model="classyState"
          :disabled="disabled"
          :is-edit="isEdit"
          :order="order"
          @getData="handleGetData"
        />
      </div>
    </div>
    <div class="sticky bottom-0 w-full flex-center gap-4 z-[2] mt-7">
      <a-button class="w-[150px]" type="primary" @click="submit" v-if="!isEdit">Tạo</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ORDER_RESPONSE } from '@/types/order/website'
import { ORDER_STATUS, ORDER_STATUS_DATA } from '@/constant/order'

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

<style lang="scss"></style>
