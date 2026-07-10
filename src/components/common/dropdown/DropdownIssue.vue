<template>
  <tag-issue
    :type="currentStatus ?? data?.status ?? ''"
    v-if="
      data?.status == ISSUE_STATUS.Done ||
      data?.status == ISSUE_STATUS.Cancel ||
      currentStatus == ISSUE_STATUS.Cancel ||
      currentStatus == ISSUE_STATUS.Done
    "
  />

  <a-dropdown :placement="'bottomRight'" :trigger="['click']" :disabled="disable" v-else>
    <div class="flex-center gap-2 cursor-pointer">
      <tag-issue :type="currentStatus ?? data?.status ?? ''" />
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
import { ISSUE_STATUS } from '@/constant/issue'
import { CaretDownOutlined } from '@ant-design/icons-vue'
import type { ISSUE_RESPONSE } from '@/types/inventory/inventory'

// COMPONENT
import TagIssue from '@/components/common/tag/TagIssue.vue'

// PINIA
import { useInventoryStore } from '@/stores/inventory'
import { handle_success } from '@/utils/message'

//UTILS

interface Props {
  // type: string | number | undefined
  data?: ISSUE_RESPONSE
}

const props = withDefaults(defineProps<Props>(), {})
const disable = ref(false)
const currentStatus = ref<any>(null)

const inventoryStore = useInventoryStore()

const changeStatus = async (type: 'done' | 'cancel') => {
  try {
    disable.value = true
    await inventoryStore.changeIssueStatus(props.data?.id, type)
    if (type == 'done') currentStatus.value = ISSUE_STATUS.Done
    else if (type == 'cancel') currentStatus.value = ISSUE_STATUS.Cancel
    handle_success('Cập nhập thành công!')
  } catch (e) {
    console.log(e)
  }
  disable.value = false
}

onMounted(() => {})
</script>

<style lang="scss"></style>
