<template>
  <a-space class="">
    <a-tooltip v-if="props.view">
      <template v-if="!isMobileComputed" #title>Xem chi tiết</template>
      <eye-outlined class="text-[20px] text-blue cursor-auto" @click="emits('view')" />
    </a-tooltip>
    <slot name="edit" v-if="!hideEdit">
      <a-tooltip>
        <template v-if="!isMobileComputed" #title>Chỉnh sửa</template>
        <edit-outlined class="text-[20px] text-blue cursor-auto" @click="emits('edit')" />
      </a-tooltip> 
    </slot>
    <slot name="remove" v-if="!hideRemove">
      <a-tooltip>
        <template v-if="!isMobileComputed" #title>Xóa</template>
        <delete-outlined class="text-[20px] text-blue cursor-auto" @click="emits('remove')" />
      </a-tooltip>
    </slot>
  </a-space>
</template>

<script lang="ts" setup>
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { useRootStore } from '@/stores/root'
import { computed } from 'vue';
const rootStore = useRootStore()
const isMobileComputed = computed(() => rootStore.isMobile)
const emits = defineEmits<{
  (e: 'remove'): void
  (e: 'edit'): void
  (e: 'view'): void
}>()
const props = withDefaults(
  defineProps<{ view?: boolean; hideEdit?: boolean; hideRemove?: boolean }>(),
  {}
)
</script>
