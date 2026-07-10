<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="w-full">
      <div class="flex justify-between items-center mb-2">
        <p class="heading-1">Liên hệ</p>
        <create-button type="primary" @click="createContactModalRef?.showModal()"
          >Tạo liên hệ</create-button
        >
      </div>
      <!-- db-click -->
      <c-table-ant
        class=""
        :columns="columns"
        :data="contacts"
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
          <template v-else-if="column.key == 'action'">
            <box-action @edit="editContact(record)" @remove="removeContact(record)"></box-action>
          </template>
          <template v-else-if="column.key == 'created_at'">
            <box-created-time :time="text" />
          </template>
        </template>
      </c-table-ant>
    </div>
  </div>
  <create-contact-modal ref="createContactModalRef" @getData="initData()"> </create-contact-modal>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { COLUMN_TYPE } from '@/types/table'
import type { CONTACT_RESPONSE } from '@/types/customer/contact'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { currency } from '@/utils/currency'

//PINIA
import { useContactStore } from '@/stores/contact'
import { useSelectDataStore } from '@/stores/select_data'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CreateContactModal from '@/views/contact/action/CreateContactModal.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

const contactStore = useContactStore()
const selectDataStore = useSelectDataStore()
const router = useRouter()

const { getContactList, deleteContact } = contactStore

// const receipt = computed(() => inventoryStore.receiptList)
// const meta = computed(() => getReceiptList.orderMeta)

const columns = [
  {
    title: 'Tên',
    key: 'name',
    inputProps: {
      inputType: 'text'
    },
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
    title: 'Số điện thoại',
    key: 'phone',
    inputProps: { inputType: 'text' },
    width: 'md',
    isFilter: true
  },
  {
    title: 'Địa chỉ',
    key: 'address_1',
    inputProps: { inputType: 'text' },
    width: 'xl',
    isFilter: true
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 'md',
    // inputProps: { inputType: 'select', data: ORDER_STATUS_DATA },
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
    // inputProps: { inputType: 'date' },
  }
] as COLUMN_TYPE[]

onMounted(() => {
  initData()
})

const tableLoading = ref(false)
const meta = ref<MetaResponse | null>(null)
const contacts = ref<CONTACT_RESPONSE[]>([])
const createContactModalRef = ref<InstanceType<typeof CreateContactModal> | null>(null)

const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    const res = await getContactList(param)
    meta.value = res._meta
    contacts.value = res.items
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const goToPageDetail = (item: any) => {
  router.push({ name: 'order-detail', params: { id: item.id } })
}

const editContact = async (data: any) => {
  createContactModalRef.value?.showModal(data)
}

const removeContact = async (data: any) => {
  try {
    const res = await deleteContact(data)
    initData()
  } catch (error) {
    handle_error(error)
  }
}
</script>
