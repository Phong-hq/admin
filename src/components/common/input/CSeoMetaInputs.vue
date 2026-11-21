<template>
  <div class="w-full flex flex-col gap-3">
    <div>
      <p class="mb-1">Meta title (tiêu đề trên Google)</p>
      <a-input
        :value="title"
        :maxlength="255"
        :placeholder="titlePlaceholder || 'Để trống = website tự tạo từ tên'"
        @update:value="(v: string) => emit('update:title', v)"
      />
      <p class="text-xs mt-1" :class="counterClass(titleLength, TITLE_LIMIT)">
        {{ titleLength }}/{{ TITLE_LIMIT }} ký tự
        <span v-if="titleLength > TITLE_LIMIT"> — dài quá, Google sẽ cắt bớt phần sau</span>
      </p>
    </div>
    <div>
      <p class="mb-1">Meta description (đoạn mô tả dưới tiêu đề trên Google)</p>
      <a-textarea
        :value="description"
        :maxlength="500"
        auto-size
        :placeholder="descriptionPlaceholder || 'Để trống = website tự tạo từ mô tả'"
        @update:value="(v: string) => emit('update:description', v)"
      />
      <p class="text-xs mt-1" :class="counterClass(descriptionLength, DESCRIPTION_LIMIT)">
        {{ descriptionLength }}/{{ DESCRIPTION_LIMIT }} ký tự
        <span v-if="descriptionLength > DESCRIPTION_LIMIT"> — dài quá, Google sẽ cắt bớt phần sau</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Ô nhập meta title / meta description cho danh mục, nhãn hiệu, sản phẩm.
// Giới hạn 60 / 160 chỉ là GỢI Ý (Google cắt bớt khi hiển thị), không chặn lưu.
// Chặn cứng theo cột DB (255 / 500) qua `maxlength`.
import { computed } from 'vue'

const TITLE_LIMIT = 60
const DESCRIPTION_LIMIT = 160

const props = defineProps<{
  title?: string | null
  description?: string | null
  titlePlaceholder?: string
  descriptionPlaceholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:title', value: string): void
  (e: 'update:description', value: string): void
}>()

const titleLength = computed(() => (props.title || '').trim().length)
const descriptionLength = computed(() => (props.description || '').trim().length)

const counterClass = (length: number, limit: number) =>
  length > limit ? 'text-[#d46b08]' : 'text-gray-400'
</script>
