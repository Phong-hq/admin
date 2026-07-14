<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="w-full">
      <div class="flex justify-between items-center mb-2">
        <p class="heading-1">Phản hồi</p>
      </div>
      <!-- db-click -->
      <c-table-ant
        class=""
        :columns="columns"
        :data="feedbacks"
        :meta="meta"
        primary-key="id"
        expand-title="test"
        :loading="tableLoading"
        @get-data="initData"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'status'">
            <box-active :value="text" />
          </template>
          <template v-else-if="column.key == 'is_confirm_term'">
            {{ text == 1 ? 'Có' : 'Không' }}
          </template>
          <template v-else-if="column.key == 'action'">
            <box-action view hide-edit @view="viewFeedback(record)" @remove="removeFeedback(record)">
            </box-action>
          </template>
          <template v-else-if="column.key == 'created_at'">
            <box-created-time :time="text" />
          </template>
        </template>
      </c-table-ant>
    </div>
  </div>
  <view-feedback-modal ref="viewFeedbackModalRef"></view-feedback-modal>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import type { FEEDBACK_RESPONSE } from '@/types/feedback/feedback'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

//PINIA
import { useFeedbackStore } from '@/stores/feedback'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import ViewFeedbackModal from '@/views/feedback/action/ViewFeedbackModal.vue'

const feedbackStore = useFeedbackStore()

const { getFeedbackList, deleteFeedback } = feedbackStore

const columns = [
  {
    title: 'Chủ đề',
    key: 'subject',
    inputProps: { inputType: 'text' },
    isFilter: true
  },
  {
    title: 'Tiêu đề',
    key: 'title',
    inputProps: { inputType: 'text' },
    isFilter: true
  },
  {
    title: 'Họ tên',
    key: 'fullname',
    inputProps: { inputType: 'text' },
    width: 'lg',
    isFilter: true
  },
  {
    title: 'Số điện thoại',
    key: 'phone',
    inputProps: { inputType: 'text' },
    width: 'md',
    isFilter: true
  },
  {
    title: 'Email',
    key: 'email',
    inputProps: { inputType: 'text' },
    width: 'lg',
    isFilter: true
  },
  {
    title: 'Đồng ý điều khoản',
    key: 'is_confirm_term',
    width: 'md'
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 'md',
    isFilter: true
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    align: 'right',
    sorter: true,
    width: 'md',
    inputProps: { inputType: 'date' }
  },
  {
    title: '-',
    key: 'action'
  }
] as COLUMN_TYPE[]

onMounted(() => {
  initData()
})

const tableLoading = ref(false)
const meta = ref<MetaResponse | null>(null)
const feedbacks = ref<FEEDBACK_RESPONSE[]>([])
const viewFeedbackModalRef = ref<InstanceType<typeof ViewFeedbackModal> | null>(null)

const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    const res = await getFeedbackList(param)
    meta.value = res._meta
    feedbacks.value = res.items
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const viewFeedback = (data: FEEDBACK_RESPONSE) => {
  viewFeedbackModalRef.value?.showModal(data)
}

const removeFeedback = async (data: FEEDBACK_RESPONSE) => {
  try {
    await deleteFeedback(data)
    handle_success('Xóa phản hồi thành công')
    initData()
  } catch (error) {
    handle_error(error)
  }
}
</script>
