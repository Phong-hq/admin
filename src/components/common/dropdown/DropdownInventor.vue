<template>
  <tag-inventor
    :type="currentStatus ?? data?.status ?? ''"
    v-if="
      data?.status == RECEIPT_STATUS.Done ||
      data?.status == RECEIPT_STATUS.Cancel ||
      currentStatus == RECEIPT_STATUS.Cancel ||
      currentStatus == RECEIPT_STATUS.Done
    "
  />

  <a-dropdown :placement="'bottomRight'" :trigger="['click']" :disabled="disable" v-else>
    <div class="flex-center gap-2 cursor-pointer">
      <tag-inventor :type="currentStatus ?? data?.status ?? ''" />
      <caret-down-outlined />
    </div>
    <template #overlay>
      <a-menu>
<!--        <a-menu-item-->
<!--          @click="changeStatus('approved')"-->
<!--          v-if="data?.status == RECEIPT_STATUS.Approved_Pending"-->
<!--        >-->
<!--          Phê Duyệt-->
<!--        </a-menu-item>-->
        <a-menu-item @click="changeStatus(RECEIPT_STATUS.Cancel)"> Hủy</a-menu-item>
        <a-menu-item @click="changeStatus(RECEIPT_STATUS.Done)"> Hoàn thành</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { RECEIPT_STATUS, RECEIPT_STATUS_DATA } from '@/constant/receipt'
import { CaretDownOutlined } from '@ant-design/icons-vue'

// COMPONENT
import TagInventor from '@/components/common/tag/TagInventor.vue'

// PINIA
import { useInventoryStore } from '@/stores/inventory'
import { handle_success } from '@/utils/message'
import type { RECEIPT_RESPONSE } from '@/types/inventory/inventory'

//UTILS

interface Props {
  data?: RECEIPT_RESPONSE
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'getData', data: RECEIPT_RESPONSE): void
}>()

const disable = ref(false)
const currentStatus = ref<any>(null)

const inventoryStore = useInventoryStore()

const changeStatus = async (type: any) => {
  try {
    disable.value = true
    const res =  await inventoryStore.changeReceiptStatus(type, props.data)
    currentStatus.value = type
    handle_success('Cập nhập thành công!')
    emits('getData', res)
  } catch (e) {
    console.log(e)
  }
  disable.value = false
}

onMounted(() => {})
</script>

<style lang="scss"></style>
