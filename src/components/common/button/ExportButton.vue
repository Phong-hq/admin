<template>
  <a-button type="primary" :loading="loading" @click="handleClick">
    <template #icon>
      <file-excel-outlined />
    </template>
    <span>Xuất file</span>
  </a-button>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { FileExcelOutlined } from '@ant-design/icons-vue'
import { handle_error } from '@/utils/message'
import FileDownload from 'js-file-download'
import dayjs from 'dayjs'
import { DATE_RESPONSE_FORMAT } from '@/utils/dayjs-helper'
// COMPONENT

// PINIA

//UTILS

type Props = {
  action: (id?: any) => Promise<string>
  params?: any
  name: string
}

const props = withDefaults(defineProps<Props>(), {})

const loading = ref(false)

const handleClick = async () => {
  try {
    loading.value = true
    const res = await props.action()
    FileDownload(
      res,
      `${props.name}-${dayjs().format(DATE_RESPONSE_FORMAT)}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

  } catch (error) {
    handle_error(error, 'Xuất file thất bại!')
  }
  loading.value = false
}
</script>

<style lang="scss"></style>
