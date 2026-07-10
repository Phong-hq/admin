<template>
  <a-input class="search-input" @input="handleChange" placeholder="Tìm kiếm..." allowClear>
    <template #prefix><SearchOutlined /></template>
  </a-input>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useDebounce } from '@/utils/debounce'
import { SearchOutlined } from '@ant-design/icons-vue'

const emits = defineEmits<{
  (e: 'search'): void
}>()

const handleChange = useDebounce((e: any) => {
  emits('search')
}, 500)
</script>
