<template>
  <div class="w-full">
    <a-input
      :value="modelValue"
      :addon-before="prefix"
      placeholder="Để trống = tự tạo từ tên"
      @update:value="(v: string) => emit('update:modelValue', v)"
      @blur="normalize"
    />
    <p v-if="changed" class="text-xs text-[#d46b08] mt-1">
      Đổi slug sẽ đổi đường dẫn trên website: link cũ (Google, Facebook, bài viết đã chia sẻ) sẽ báo
      lỗi không tìm thấy trang. Chỉ đổi khi thật cần.
    </p>
    <p v-else class="text-xs text-gray-400 mt-1">
      Đường dẫn trên website. Chỉ gồm chữ thường không dấu, số và dấu gạch ngang. Sửa tên không làm
      đổi slug.
    </p>
  </div>
</template>

<script lang="ts" setup>
// Ô nhập slug (đường dẫn công khai trên website) cho danh mục, nhãn hiệu, sản phẩm.
// Backend tự chuẩn hoá và báo lỗi nếu trùng; ở đây chuẩn hoá sẵn khi rời ô để người nhập
// thấy ngay slug thật sẽ được lưu.
import { computed } from 'vue'
import { formatSlugUrl } from '@/utils/string-helper'

const props = defineProps<{
  modelValue: string
  // Slug đang lưu trong hệ thống (chế độ sửa) -- dùng để cảnh báo khi người dùng đổi.
  original?: string
  // Phần đường dẫn đứng trước slug, vd "/category/".
  prefix?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const changed = computed(() => !!props.original && formatSlugUrl(props.modelValue) !== props.original)

const normalize = () => {
  const value = formatSlugUrl(props.modelValue)
  if (value !== props.modelValue) emit('update:modelValue', value)
}
</script>
