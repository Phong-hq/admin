<template>
  <a-select popupClassName="select-custom" ref="select" class="w-[160px]" allowClear>
    <template #suffixIcon v-if="suffix">
      <slot name="suffixIcon"></slot>
    </template>
    <template #notFoundContent v-if="hasSearch">
      <a-spin size="small" />
    </template>
    <template v-for="(item, index) in data" :key="index">
      <template v-if="typeof item === 'string'">
        <a-select-option :value="item">{{ item }}</a-select-option>
      </template>
      <template v-else-if="typeof item === 'object'">
        <a-select-option :value="item?.value" :disabled="item?.disabled"
          >{{ item.label || item.value || '' }}
        </a-select-option>
      </template>
    </template>
  </a-select>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { SelectConfig, SelectConfigItem } from '@/types/index'

interface Props {
  // modelValue: any,
  data: SelectConfig
  hasSearch?: boolean
  suffix?: boolean
}

const props = withDefaults(defineProps<Props>(), { suffix: false })

const emits = defineEmits<{
  (e: 'update:modelValue', id: any): void
}>()
</script>

<style lang="scss">
.select-custom {
  padding: 10px !important;

  .ant-select-item-option {
    border-bottom: 1px solid #dee2e6;
    border-radius: 0px !important;
    padding-left: 20px;
    padding-right: 30px !important;

    &.ant-select-item-option-selected {
      background-color: transparent !important;
      color: var(--color-primary) !important;
      position: relative;

      &:after {
        content: '';
        z-index: 123;
        width: 20px;
        height: 20px;
        //background-image: url('../../../assets/icons/check-blue.svg');
        background-size: cover;
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
