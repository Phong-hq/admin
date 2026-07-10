<template>
  <div>
    <div class="flex justify-between items-center gap-7 mb-2">
      <p class="heading-1">Đơn hàng</p>
      <create-button type="primary" @click="router.push({ name: 'order-create-detail', query: { client_id: customerId } })"
        >Tạo đơn hàng
      </create-button>
    </div>
    <c-table :columns="columns" :data="data?.items ?? []" :loading="loading" :meta="data?._meta">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key == 'payments'">
          {{ currency(text) }}
        </template>
        <template v-else-if="column.key == 'status'">
          <dropdown-order :data="record" />
        </template>
        <template v-else-if="column.key == 'created_at'">
          <box-created-time :time="text" />
        </template>
        <template v-else-if="column.key == 'action'">
          <box-action hide-edit hide-remove view @view="router.push({ name: 'order-edit-detail', params: { id: record.id } })" />
        </template>
      </template>
    </c-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import CTable from '@/components/common/table/CTable.vue'
import type { COLUMN_TYPE } from '@/types/table'
import type { ORDER_RESPONSE } from '@/types/order/website'
import { useRouter } from 'vue-router'

// COMPONENT
import DropdownOrder from '@/components/common/dropdown/DropdownOrder.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

// PINIA
import { useOrderStore } from '@/stores/order'

//UTILS
import { useCustomerStore } from '@/stores/customer'
import { handle_error } from '@/utils/message'
import { currency } from '../../../utils/currency'
import BoxAction from '@/components/common/table/BoxAction.vue'

type Props = {
  customerId: any
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'update', key: string, value: string): void
}>()

const customerStore = useCustomerStore()
const orderStore = useOrderStore()
const router = useRouter()

const { getOrderList } = orderStore

const columns = [
  {
    title: 'Mã đơn hàng',
    key: 'code'
  },
  {
    title: 'Tạo bởi',
    key: 'created_by'
  },
  {
    title: 'Thanh toán',
    key: 'payments',
    align: 'right'
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    align: 'right'
  },
  {
    title: 'Trạng thái',
    key: 'status',
    align: 'center'
  },
  {
    title: '-',
    key: 'action',
    align: 'center'
  }
] as COLUMN_TYPE[]

onMounted(() => {
  initData()
})

const loading = ref(false)
const data = ref<DataWithMetaResponse<ORDER_RESPONSE[]> | null>(null)

const initData = async () => {
  try {
    loading.value = true
    data.value = await getOrderList({ client_id: props.customerId })
  } catch (error) {
    handle_error(error)
  }
  loading.value = false
}
</script>

<style lang="scss"></style>
