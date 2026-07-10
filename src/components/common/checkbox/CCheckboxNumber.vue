<template>
  <a-checkbox :checked="result == 1" @change="handleChange"><slot /></a-checkbox>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'

type Props = {
  modelValue: number
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'update:modelValue', id: number): void
}>()

const result = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})
const handleChange = () => {
  if (result.value == 1) result.value = 0
  else result.value = 1
}
</script>
