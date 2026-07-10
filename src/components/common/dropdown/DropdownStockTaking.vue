<template>
  <tag-inventor
    :type="currentStatus ?? data?.status ?? ''"
    v-if="
      data?.status == STOCK_TALKING_STATUS.Done ||
      data?.status == STOCK_TALKING_STATUS.Cancel ||
      currentStatus == STOCK_TALKING_STATUS.Cancel ||
      currentStatus == STOCK_TALKING_STATUS.Done
    "
  />

  <a-dropdown :placement="'bottomRight'" :trigger="['click']" :disabled="disable" v-else>
    <div class="flex-center gap-2 cursor-pointer">
      <tag-inventor :type="currentStatus ?? data?.status ?? ''" />
      <caret-down-outlined />
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item @click="changeStatus('cancel')"> Hủy</a-menu-item>
        <a-menu-item @click="changeStatus('done')"> Hoàn thành</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { STOCK_TALKING_STATUS } from '@/constant/stock-taking'
import { CaretDownOutlined } from '@ant-design/icons-vue'
import type { STOCKTAKING_RESPONSE } from '@/types/inventory/inventory'

// COMPONENT
import TagInventor from '@/components/common/tag/TagInventor.vue'

// PINIA
import { useInventoryStore } from '@/stores/inventory'
import { handle_success } from '@/utils/message'

//UTILS

interface Props {
  // type: string | number | undefined
  data?: STOCKTAKING_RESPONSE
}

const props = withDefaults(defineProps<Props>(), {})
const disable = ref(false)
const currentStatus = ref<any>(null)

const inventoryStore = useInventoryStore()

const changeStatus = async (type: 'done' | 'cancel') => {
  try {
    disable.value = true
    await inventoryStore.changeReceiptStatus(type, props.data?.id)
    if (type == 'done') currentStatus.value = STOCK_TALKING_STATUS.Done
    else if (type == 'cancel') currentStatus.value = STOCK_TALKING_STATUS.Cancel
    handle_success('Cập nhập thành công!')
  } catch (e) {
    console.log(e)
  }
  disable.value = false
}

onMounted(() => {})
</script>

<style lang="scss"></style>
