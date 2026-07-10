<template>
  <div class="w-full flex-center gap-2">
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { SelectSearchConfig } from '@/types/index'
import { useSelectDataStore } from '@/stores/select_data'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

interface Props {
  searchConfig: SelectSearchConfig
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'update:modelValue', id: any): void
}>()

const selectDataStore = useSelectDataStore()
</script>

<style lang="scss"></style>
