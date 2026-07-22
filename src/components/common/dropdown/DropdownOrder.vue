<template>
  <tag-order
    :type="currentStatus ?? data?.status ?? ''"
    v-if="
      data?.status == ORDER_STATUS.Done ||
      data?.status == ORDER_STATUS.Cancel ||
      currentStatus == ORDER_STATUS.Cancel ||
      currentStatus == ORDER_STATUS.Done
    "
  />

  <a-dropdown :placement="'bottomRight'" :trigger="['click']" :disabled="disable" v-else>
    <div class="flex-center gap-2 cursor-pointer">
      <tag-order :type="currentStatus ?? data?.status ?? ''" />
      <caret-down-outlined />
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item
          v-if="(currentStatus ?? data?.status) == ORDER_STATUS.Approved_Pending"
          @click="changeStatus(ORDER_STATUS.Approved)"
        >
          Phê duyệt
        </a-menu-item>
        <a-menu-item
          v-else-if="(currentStatus ?? data?.status) == ORDER_STATUS.Approved"
          @click="changeStatus(ORDER_STATUS.Waiting_Shipper)"
          >Chờ giao
        </a-menu-item>
        <a-menu-item
          v-else-if="(currentStatus ?? data?.status) == ORDER_STATUS.Waiting_Shipper"
          @click="changeStatus(ORDER_STATUS.Done)"
          >Hoàn thành
        </a-menu-item>
        <a-menu-item @click="changeStatus(ORDER_STATUS.Cancel)">Huỷ đơn hàng</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { CaretDownOutlined } from '@ant-design/icons-vue'
import { ORDER_STATUS } from '@/constant/order'
import type { ORDER_RESPONSE } from '@/types/order/website'

// COMPONENT
import TagOrder from '@/components/common/tag/TagOrder.vue'

// PINIA
import { useOrderStore } from '@/stores/order'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

interface Props {
  // type: string | number | undefined
  data?: ORDER_RESPONSE
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'getData', data: ORDER_RESPONSE): void
}>()
const disable = ref(false)
const currentStatus = ref<any>(null)

const orderStore = useOrderStore()

const changeStatus = async (type: number) => {
  try {
    disable.value = true
    const res = await orderStore.updateOrderStatus(props.data, type)
    currentStatus.value = type
    handle_success('Cập nhập thành công!')
    emits('getData', res)
  } catch (e) {
    handle_error(e, 'Cập nhập thất bại!')
  }
  disable.value = false
}

onMounted(() => {})
</script>

<style lang="scss"></style>
