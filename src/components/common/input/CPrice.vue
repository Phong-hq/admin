<template>
    <a-input v-model:value="price" @input="handleInput" />
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { currency, currencyInput, currencyNumber } from '@/utils/currency'

type Props = {
  modelValue: number
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'update:modelValue', id: number): void
}>()

const price = computed({
  get() {
    return currency(props.modelValue)
  },
  set(value) {
    emits('update:modelValue', currencyNumber(value))
  }
})

const handleInput = () => {
  price.value = currencyInput(price.value)
}

</script>
