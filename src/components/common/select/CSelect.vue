<template>
  <a-select popupClassName="select-custom" ref="select" class="w-[160px]" allowClear :show-search="hasSearch">
    <template #suffixIcon v-if="suffix">
      <slot name="suffixIcon"></slot>
    </template>
    <template #notFoundContent v-if="hasSearch">
      <a-spin size="small" v-if="searchLoading" />
      <a-empty :image="simpleImage" v-else />
    </template>
    <template v-for="(item, index) in data" :key="index">
      <template v-if="typeof item === 'string'">
        <a-select-option :value="item">{{ item }}</a-select-option>
      </template>
      <template v-else-if="typeof item === 'object'">
        <a-select-option :value="item?.value" :disabled="item?.disabled">
          <div class="!flex gap-2">
            <img class="w-8 h-8" :src="image(item.image ?? '')" v-show="item.image" />
            <div>
              <p>{{ item.label || item.value || '' }}</p>
              <p class="text-gray text-sm" v-show="item.description">
                {{ item.description ?? '' }}
              </p>
            </div>
          </div>
        </a-select-option>
      </template>
    </template>
  </a-select>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { SelectConfig, SelectConfigItem } from '@/types/index'
import { isJsonString } from '@/utils/json'
import { Empty } from 'ant-design-vue';
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

interface Props {
  // modelValue: any,
  data: SelectConfig
  hasSearch?: boolean
  searchLoading?: boolean
  suffix?: boolean
}

const props = withDefaults(defineProps<Props>(), { suffix: false })

const emits = defineEmits<{
  (e: 'update:modelValue', id: any): void
}>()

const image = (value: string) => {
  if (isJsonString(value)) {
    return JSON.parse(value)[0]
  } else {
    return value || ''
  }
}
</script>

<style lang="scss">
.ant-select-selector {
  .ant-select-selection-item {
    img {
      display: none !important;
    }

    .text-gray {
      display: none !important;
    }
  }
}

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
