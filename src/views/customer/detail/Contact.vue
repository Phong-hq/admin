<template>
  <div>
    <div class="flex justify-between items-center gap-7 mb-2">
      <p class="heading-1">Liên hệ</p>
      <add-contact @add-contact="handleAddContact" />
    </div>
    <c-table :columns="columns" :data="data?.items ?? []" :loading="loading" :meta="data?._meta">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key == 'action'">
          <box-action hide-edit @remove="removeContact(record)"> </box-action>
        </template>
      </template>
    </c-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { CONTACT_CUSTOMER_RESPONSE } from '@/types/customer/customer'
import CTable from '@/components/common/table/CTable.vue'
import type { COLUMN_TYPE } from '@/types/table'
import CreateButton from '@/components/common/button/CreateButton.vue'

// COMPONENT

// PINIA

//UTILS
import { useCustomerStore } from '@/stores/customer'
import { handle_error } from '@/utils/message'
import AddContact from '@/views/customer/detail/AddContact.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'

type Props = {
  customerId: any
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'update', value: any): void
}>()
const customerStore = useCustomerStore()

const { getContactCustomerDetail, addContactCustomer, removeContactCustomer } = customerStore

const columns = [
  {
    title: 'Tên',
    key: {
      name: 'name',
      label: 'contact,name',
      value: 'contact,name'
    }
  },
  {
    title: 'Email',
    key: {
      name: 'email',
      label: 'contact,email',
      value: 'contact,email'
    }
  },
  {
    title: 'Số điện thoại',
    key: {
      name: 'phone',
      label: 'contact,phone',
      value: 'contact,phone'
    }
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
const data = ref<DataWithMetaResponse<CONTACT_CUSTOMER_RESPONSE[]> | null>(null)

const initData = async () => {
  try {
    loading.value = true
    data.value = await getContactCustomerDetail(props.customerId)
  } catch (error) {
    handle_error(error)
  }
  loading.value = false
}

const handleAddContact = async (id: any) => {
  try {
    loading.value = true
    await addContactCustomer({
      customer_id: props.customerId,
      contact_id: id
    })
    await initData()
    emits('update', (data.value?.items?.length ?? 0) + 1)
  } catch (error) {
    handle_error(error)
    loading.value = false
  }
}

const removeContact = async (data: any) => {
  try {
    loading.value = true
    await removeContactCustomer(data)
    await initData()
    emits('update', (data.value?.items?.length ?? 0) - 1)
  } catch (error) {
    handle_error(error)
    loading.value = false
  }
}
</script>

<style lang="scss"></style>
