<template>
  <a-tag :color="color" v-if="type != undefined">{{ getStatusLabel(Number(type)) }}</a-tag>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import C from '@/constant/color'
import { ORDER_STATUS, getStatusLabel } from '@/constant/order'
// COMPONENT

// PINIA

//UTILS
interface Props {
  type: string | number | undefined
}

const props = withDefaults(defineProps<Props>(), {})

const color = computed(() => {
  if (Number(props.type) == ORDER_STATUS.Done) return C.Success
  else if (Number(props.type) == ORDER_STATUS.Pack) return C.Teal
  else if (Number(props.type) == ORDER_STATUS.Cancel) return C.Error
  else if (Number(props.type) == ORDER_STATUS.Approved) return C.Blue
  else if (Number(props.type) == ORDER_STATUS.Approved_Pending) return C.Warning
  else if (Number(props.type) == ORDER_STATUS.Out_Of_Stock) return C.Purple
  return ''
})
onMounted(() => {})
</script>

<style lang="scss"></style>