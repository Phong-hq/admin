<template>
  <a-steps
    class="receipt-progress-custom"
    :current="current"
    :status="order?.status == ORDER_STATUS.Cancel ? 'error' : 'finish'"
    :items="progressSteps"
    @change="handleChange"
  >
  </a-steps>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { ORDER_STATUS, getStatusLabel } from '@/constant/order'
import dayjs from 'dayjs'

// COMPONENT

// PINIA
import { useOrderStore } from '@/stores/order'
import { useRootStore } from '@/stores/root'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { DATE_RENDER, TIME_RENDER } from '@/utils/dayjs-helper'
import type { ORDER_RESPONSE } from '@/types/order/website'

const props = withDefaults(defineProps<{ order: ORDER_RESPONSE | null, isDisabled: boolean }>(), {})

const emits = defineEmits<{
  (e: 'getData', data: ORDER_RESPONSE): void
}>()

const STATUS_DATA = [
  ORDER_STATUS.Approved_Pending,
  ORDER_STATUS.Approved,
  ORDER_STATUS.Pack,
  ORDER_STATUS.Out_Of_Stock,
  ORDER_STATUS.Done
]

const orderStore = useOrderStore()
const rootStore = useRootStore()

const progressSteps = computed(() => {
  const getDescription = (time: any, index: number) => {
    if(index == 0) return dayjs(props.order?.created_at).format(DATE_RENDER) + ' '+ dayjs(props.order?.created_at).format(TIME_RENDER)
    if (!time || !dayjs(time).isValid()) return ''
    return dayjs(time).format(DATE_RENDER) + ' '+ dayjs(time).format(TIME_RENDER)
  }
  const getTitle = (status: any, index: number) => {
    if(props.order?.status == ORDER_STATUS.Cancel && index == current.value) return 'Đã hủy'
    return getStatusLabel(status)
  }
  return STATUS_DATA.map((status, i) => {
    let item = props.order?.progress_status?.find(
      (e: any) => e.status == status || (i == current.value && e.status == ORDER_STATUS.Cancel)
    )
    return {
      title: getTitle(status, i),
      disabled: (current.value + 1) != i ,
      description: getDescription(item?.date, i)
    }
  })
})

const handleChange = async (index: any) => {
  try {
    // rootStore.showLoading()
    const res = await orderStore.updateOrderStatus(props.order, STATUS_DATA[index])
    emits('getData', res)
    handle_success('Đổi trạng thái thành công!!')
  } catch (e) {
    handle_error(e, 'Cập nhập thất bại!')
    rootStore.hideLoading()
  }
}

const current = computed<number>(() => {
  if (props.order?.status == ORDER_STATUS.Cancel) {
    if(props.order?.progress_status?.length == 5) return 4
    return props.order?.progress_status?.length ?? 0
  }
  return STATUS_DATA.findIndex((e) => e == props.order?.status)
})

onMounted(() => {})
</script>

<style lang="scss">
.receipt-progress-custom {
  //.ant-steps-item-finish {
  //  .ant-steps-item-content {
  //    .ant-steps-item-title {
  //      color: var(--color-success) !important;
  //
  //      &::after {
  //        background-color: var(--color-success) !important;
  //        height: 2px !important;
  //      }
  //    }
  //
  //    .ant-steps-item-description {
  //      color: var(--color-success) !important;
  //    }
  //  }
  //
  //  .ant-steps-item-icon {
  //    background-color: var(--color-success) !important;
  //    border-color: var(--color-success) !important;
  //
  //    span {
  //      color: #fff !important;
  //    }
  //  }
  //}
}
</style>
