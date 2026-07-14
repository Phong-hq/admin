<template>
  <a-modal v-model:open="open" title="Chi tiết phản hồi" :width="700" :footer="null">
    <div class="flex flex-col gap-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <p class="text-C82">Họ tên</p>
          <p class="font-medium">{{ feedback?.fullname }}</p>
        </div>
        <div>
          <p class="text-C82">Số điện thoại</p>
          <p class="font-medium">{{ feedback?.phone }}</p>
        </div>
        <div>
          <p class="text-C82">Email</p>
          <p class="font-medium">{{ feedback?.email }}</p>
        </div>
        <div>
          <p class="text-C82">Chủ đề</p>
          <p class="font-medium">{{ feedback?.subject }}</p>
        </div>
      </div>
      <div>
        <p class="text-C82">Tiêu đề</p>
        <p class="font-medium">{{ feedback?.title }}</p>
      </div>
      <div>
        <p class="text-C82">Nội dung</p>
        <p class="whitespace-pre-line">{{ feedback?.content }}</p>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FEEDBACK_RESPONSE } from '@/types/feedback/feedback'

const open = ref<boolean>(false)
const feedback = ref<FEEDBACK_RESPONSE | null>(null)

const showModal = (data: FEEDBACK_RESPONSE) => {
  feedback.value = data
  open.value = true
}

defineExpose({ showModal })
</script>
