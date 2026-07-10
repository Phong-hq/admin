<template>
  <c-breadcrumb />
  <div class="page-box-white">
    <div class="flex justify-between items-center gap-7 mb-2">
      <p class="heading-1">Phí vận chuyển</p>
      <create-delivery-fee-modal ref="createDeliveryFeeModalRef" @getData="initData()">
        <create-button type="primary">Tạo phí vận chuyển </create-button>
      </create-delivery-fee-modal>
    </div>
    <c-table :columns="column" :data="data" :meta="meta" :loading="loading" @getData="initData">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key == 'action'">
          <box-action
            remove
            @edit="editDeliveryFee(record)"
            @remove="removeDeliveryFee(record)"
          ></box-action>
        </template>
        <template v-else-if="column.key == 'created_at'">
          <box-created-time :time="text" />
        </template>
        <template v-else-if="column.key == 'status'">
          <box-active :value="text" />
        </template>
        <template v-else-if="column.key == 'price'">
          {{ currency(text)
          }}
        </template>
      </template>
    </c-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import { useRouter } from 'vue-router'
import type { DELIVERY_FEE_RESPONSE } from '@/types/setting/delivery-fee'
// import { OFFICE_TYPE_DATA, getTypeLabel } from '@/constant/setting/delivery-fee'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CTable from '@/components/common/table/CTable.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import CreateDeliveryFeeModal from '@/views/setting/delivery-fee/CreateDeliveryFeeModal.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

// PINIA
import { useDeliveryFeeStore } from '@/stores/setting/delivery-fee'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { currency } from '../../../utils/currency'

const deliveryFeeStore = useDeliveryFeeStore()
const router = useRouter()

const { getDeliveryFeeList, deleteDeliveryFee } = deliveryFeeStore

const column = [
  {
    title: 'Tên',
    key: 'name',
    inputProps: { inputType: 'text' },
    isFilter: true
  },
  {
    title: 'Giá  tiền',
    key: 'price',
    sorter: true,
    width: 'md',
    align: 'right'
  },
  {
    title: 'Trạng thái',
    key: 'status',
    sorter: true,
    width: 'md',
    align: 'center'
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    sorter: true,
    inputProps: { inputType: 'date' },
    width: 'md',
    align: 'center'
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
const data = ref<DELIVERY_FEE_RESPONSE[]>([])
const meta = ref<MetaResponse | null>(null)
const createDeliveryFeeModalRef = ref<InstanceType<typeof CreateDeliveryFeeModal> | null>(null)

const initData = async (params?: any) => {
  try {
    loading.value = true
    let querry_params = { ...params }
    const res = await getDeliveryFeeList(querry_params)
    data.value = res.items
    meta.value = res._meta
  } catch (e) {
    handle_error(e)
  }
  loading.value = false
}

const goToPageEdit = (data: any) => {
  router.push({ name: 'setting-user-detail', params: { id: data?.id } })
}

const removeDeliveryFee = async (data: any) => {
  try {
    await deleteDeliveryFee(data)
    handle_success('Xóa phí vận chuyển thành công!')
    initData()
  } catch (error) {
    handle_error(error, 'Xóa phí vận chuyển thất bại!')
  }
}

const editDeliveryFee = (data: any) => {
  createDeliveryFeeModalRef.value?.showModal(data)
}
</script>

<style lang="scss"></style>
