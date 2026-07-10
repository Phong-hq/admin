<template>
  <a-input-group class="" compact>
    <a-input v-model:value="random" style="width: calc(100% - 32px)" />
    <a-button @click="getCode">
      <template #icon>
        <reload-outlined />
      </template>
    </a-button>
  </a-input-group>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useDebounce } from '@/utils/debounce'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { getRandomDigits, getRandomString } from '@/utils/string-helper'

type Props = {
  modelValue: string
  length: number
  type?: 'number' | 'string'
}

const props = withDefaults(defineProps<Props>(), { type: 'number' })

const emits = defineEmits<{
  (e: 'update:modelValue', id: string): void
}>()

const random = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})

const getCode = () => {
  if (props.type === 'number') {
    random.value = getRandomDigits(props.length)
  } else {
    random.value = getRandomString(props.length)
  }
}
</script>
