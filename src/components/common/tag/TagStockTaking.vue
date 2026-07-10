<template>
  <a-tag :color="color" v-if="type != undefined">{{ getStatusLabel(Number(type)) }}</a-tag>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import C from '@/constant/color'
import { STOCK_TALKING_STATUS, getStatusLabel } from '@/constant/stock-taking'

// COMPONENT

// PINIA

//UTILS
interface Props {
  type: string | number | undefined
}

const props = withDefaults(defineProps<Props>(), {})

const color = computed(() => {
  if (Number(props.type) == STOCK_TALKING_STATUS.Done) return C.Success
  else if (Number(props.type) == STOCK_TALKING_STATUS.Cancel) return C.Error
  else if (Number(props.type) == STOCK_TALKING_STATUS.Approved_Pending) return C.Warning
  return ''
})
onMounted(() => {})
</script>

<style lang="scss"></style>
