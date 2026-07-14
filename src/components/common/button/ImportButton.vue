<template>
  <a-upload
    :show-upload-list="false"
    accept=".xlsx,.xls"
    :before-upload="handleBeforeUpload"
  >
    <a-button type="primary" :loading="loading">
      <template #icon>
        <file-excel-outlined />
      </template>
      <span>Nhập file</span>
    </a-button>
  </a-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { notification } from 'ant-design-vue'
import { FileExcelOutlined } from '@ant-design/icons-vue'
import { handle_error, handle_success } from '@/utils/message'

type Props = {
  action: (file: File) => Promise<ImportResponse>
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (e: 'success'): void
}>()

const loading = ref(false)

const handleBeforeUpload = async (file: File) => {
  try {
    loading.value = true
    const res = await props.action(file)
    if (res?.errors?.length) {
      notification.warning({
        message: `Nhập thành công ${res.success} dòng, bỏ qua ${res.skipped} dòng`,
        description: res.errors.join('; ')
      })
    } else {
      handle_success(`Nhập file thành công! (${res?.success ?? 0} dòng)`)
    }
    emits('success')
  } catch (error) {
    handle_error(error, 'Nhập file thất bại!')
  }
  loading.value = false
  return false
}
</script>

<style lang="scss"></style>
