<template>
  <a-tag :color="color" v-if="type != undefined">{{ getStatusLabel(Number(type)) }}</a-tag>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { RECEIPT_STATUS, getStatusLabel } from '@/constant/receipt'
import C from '@/constant/color'

// COMPONENT

// PINIA

//UTILS
interface Props {
  type: string | number | undefined
}

const props = withDefaults(defineProps<Props>(), {})

const color = computed(() => {
  if (Number(props.type) == RECEIPT_STATUS.Done) return C.Success
  else if (Number(props.type) == RECEIPT_STATUS.Pack) return C.Teal
  else if (Number(props.type) == RECEIPT_STATUS.Cancel) return C.Error
  else if (Number(props.type) == RECEIPT_STATUS.Approved) return C.Blue
  else if (Number(props.type) == RECEIPT_STATUS.Approved_Pending) return C.Warning
  return ''
})
onMounted(() => {})
</script>

<style lang="scss"></style>
