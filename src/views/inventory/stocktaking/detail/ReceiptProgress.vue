<template>
  <a-steps
    class="receipt-progress-custom"
    :current="data.length - 1"
    status="finish"
    :items="progressSteps"
  >
  </a-steps>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { getStatusLabel, RECEIPT_STATUS } from '@/constant/receipt'

// COMPONENT

// PINIA

//UTILS

const props = withDefaults(defineProps<{ data: { status: number; date: string }[] }>(), {})

const progressSteps = computed(() => {
  return [RECEIPT_STATUS.Approved_Pending, RECEIPT_STATUS.Approved, RECEIPT_STATUS.Done].map(
    (status) => {
      const data = props.data?.find((e, index: number) => e.status === status)
      if (data) {
        return {
          title: getStatusLabel(status),
          description: data.date
        }
      } else {
        return {
          title: getStatusLabel(status),
          description: ''
        }
      }
    }
  )
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
