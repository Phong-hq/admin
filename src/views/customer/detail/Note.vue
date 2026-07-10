<template>
  <div>
    <div class="flex justify-between items-center gap-7 mb-2">
      <p class="heading-1">Ghi chú</p>
      <add-note @add-note="handleAddNote" />
    </div>
    <c-table :columns="columns" :data="data?.items ?? []" :loading="loading" :meta="data?._meta">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key == 'action'">
          <box-action hide-edit @remove="removeNote(record)"></box-action>
        </template>
        <template v-else-if="column.key == 'created_at'">
          <box-created-time :time="text" />
        </template>
      </template>
    </c-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { CONTACT_CUSTOMER_RESPONSE, NOTE_CUSTOMER_RESPONSE } from '@/types/customer/customer'
import CTable from '@/components/common/table/CTable.vue'
import type { COLUMN_TYPE } from '@/types/table'
import CreateButton from '@/components/common/button/CreateButton.vue'

// COMPONENT
import BoxAction from '@/components/common/table/BoxAction.vue'
import AddNote from '@/views/customer/detail/AddNote.vue'

// PINIA

//UTILS
import { useCustomerStore } from '@/stores/customer'
import { handle_error } from '@/utils/message'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'

type Props = {
  customerId: any
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'update', key: string, value: any): void
}>()

const customerStore = useCustomerStore()

const { getContactCustomerDetail, addNoteCustomer, removeNoteCustomer, getNoteCustomerDetail } =
  customerStore

const columns = [
  {
    title: 'Ghi chú',
    key: 'note'
  },
  {
    title: 'Tạo bởi',
    key: 'created_by'
  },
  {
    title: 'Ngày tạo',
    key: 'created_at'
  },
  {
    title: '-',
    key: 'action'
  }
] as COLUMN_TYPE[]

onMounted(() => {
  initData()
})

const loading = ref(false)
const data = ref<DataWithMetaResponse<NOTE_CUSTOMER_RESPONSE[]> | null>(null)

const initData = async () => {
  try {
    loading.value = true
    data.value = await getNoteCustomerDetail(props.customerId)
  } catch (error) {
    handle_error(error)
  }
  loading.value = false
}

const handleAddNote = async (note: any) => {
  try {
    loading.value = true
    await addNoteCustomer({
      customer_id: props.customerId,
      note
    })
    await initData()
    emits('update', 'count_note', (data.value?.items?.length ?? 0) + 1)
  } catch (error) {
    handle_error(error)
    loading.value = false
  }
}

const removeNote = async (data: any) => {
  try {
    loading.value = true
    await removeNoteCustomer(data)
    await initData()
    emits('update', 'count_note', (data.value?.items?.length ?? 0) - 1)
  } catch (error) {
    handle_error(error)
    loading.value = false
  }
}
</script>

<style lang="scss"></style>
