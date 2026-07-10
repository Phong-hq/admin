<template>
  <a-tag :color="color" v-if="type != undefined">{{ getStatusLabel(Number(type)) }}</a-tag>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { ISSUE_STATUS, getStatusLabel } from '@/constant/issue'
import C from '@/constant/color'
// COMPONENT

// PINIA

//UTILS
interface Props {
  type: string | number | undefined
}

const props = withDefaults(defineProps<Props>(), {})

const color = computed(() => {
  if (Number(props.type) == ISSUE_STATUS.Done) return C.Success
  else if (Number(props.type) == ISSUE_STATUS.Approved_Pending) return C.Warning
  else if (Number(props.type) == ISSUE_STATUS.Cancel) return C.Error
  return ''
})
onMounted(() => {})
</script>

<style lang="scss"></style>