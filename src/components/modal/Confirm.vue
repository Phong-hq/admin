<template>
  <a-modal
    wrapClassName="confirm-modal"
    v-model:open="isVisible"
    :width="652"
    class="logout-modal"
    :title="confirmPayload?.headerTitle"
    :cancel-button-props="{
      // danger: true
    }"
    :cancelText="confirmPayload?.cancelButtonText || 'Không'"
    :okText="confirmPayload?.confirmButtonText || 'Có'"
    @cancel="handleCancel"
    @ok="handleOk"
    centered
  >
    <div class="text-center">
      <p class="text-lg font-semibold mb-1">{{ confirmPayload?.bodyTitle || '' }}</p>
      <div class="mb-0" v-html="confirmPayload?.bodyMessage"></div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, watch, computed } from 'vue'
import { useRootStore } from '@/stores/root'
import type { ConfirmPayload } from '@/types'

const rootStore = useRootStore()

// type ConfirmPayloadPromise = ConfirmPayload & { reject: Reject; resolve: Resolve }
const confirmPayload = computed(() => rootStore.confirmPayload)
const isVisible = ref(false)
const isResolved = ref(false)
// const confirmPayload = ref<null | ConfirmPayloadPromise>(null)

onMounted(() => {
  // handle_mitt_on('show_confirm', show);
})
onBeforeUnmount(() => {
  // handle_mitt_off('show_confirm');
})

// const show = (data: ConfirmPayloadPromise) => {
//   confirmPayload.value = data
//   isVisible.value = true
// }

watch(
  confirmPayload,
  (newValue) => {
    isVisible.value = Boolean(newValue && Object.keys(newValue).length > 0)
    if (newValue != null && Object.keys(newValue).length > 0) {
      isResolved.value = false
    }
  },
  {
    deep: true
  }
)
const handleOk = () => {
  confirmPayload.value?.resolve('ok')
  isVisible.value = false
  setTimeout(() => {
    rootStore.resetConfirm()
  }, 500)
}
const handleCancel = () => {
  if (!isResolved.value) confirmPayload.value!.reject()
  isVisible.value = false
  setTimeout(() => {
    rootStore.resetConfirm()
  }, 500)
}
</script>

<style lang="scss">
.confirm-modal {
  .ant-modal-footer {
    padding: 24px;
    padding-bottom: 12px;
  }
}
</style>
