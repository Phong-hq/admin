<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="w-full">
      <div class="flex justify-between items-center mb-2">
        <p class="heading-1">Mã khuyến mãi</p>
        <div class="flex gap-2">
          <create-button type="primary" @click="router.push({ name: 'promotion-create' })"
            >Tạo mã giảm giá</create-button
          >
        </div>
      </div>
      <!-- db-click -->
      <c-table-ant
        class=""
        :columns="columns"
        :data="promotions"
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
            <box-action @edit="goToPageDetail(record)">
              <template #remove><span></span></template>
            </box-action>
          </template>
          <template v-else-if="column.key == 'start_date' || column.key == 'end_date'">
            <box-created-time :time="text" />
          </template>
        </template>
      </c-table-ant>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { COLUMN_TYPE } from '@/types/table'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { currency } from '@/utils/currency'

//PINIA
import { usePromotionStore } from '@/stores/promotion'
import { useSelectDataStore } from '@/stores/select_data'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import type { RECEIPT_RESPONSE } from '@/types/inventory/inventory'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'
import type { PROMOTION_RESPONSE } from '@/types/promotion'

const promotionStore = usePromotionStore()
const selectDataStore = useSelectDataStore()
const router = useRouter()

const { getPromotionList } = promotionStore

// const promotions = computed(() => promotionStore.promotionList)
// const meta = computed(() => getReceiptList.orderMeta)

const columns = [
  // { title: 'Id', key: 'id' },
  {
    title: 'Mã',
    key: 'code',
    width: 'md',
    inputProps: { inputType: 'text' },
    isFilter: true,
  },
  {
    title: 'Tên',
    key: 'title',
    align: 'left',
    inputProps: {
      inputType: 'text'
    }
  },
  {
    title: 'Số lượng mã',
    key: 'limit',
    inputProps: { inputType: 'number' },
    width: 'md',
    align: 'right',
    sorter: true
  },
  {
    title: 'Đã dùng',
    key: 'used',
    width: 'md',
    align: 'right',
    sorter: true
    // inputProps: { inputType: 'text' },
    // isFilter: true
  },
  {
    title: 'Ngày bắt đầu',
    key: 'start_date',
    inputProps: { inputType: 'date' },
    sorter: true,
    isFilter: true,
    width: 'md',
    align: 'right'
  },
  {
    title: 'Ngày kết thúc',
    key: 'end_date',
    inputProps: { inputType: 'date' },
    sorter: true,
    isFilter: true,
    width: 'md',
    align: 'right'
  },
  {
    title: 'Trạng thái',
    key: 'status',
    inputProps: {
      inputType: 'select',
      data: [
        { value: 0, label: 'Chưa kích hoạt' },
        { value: 1, label: 'Kích hoạt' }
      ]
    },
    width: 'md',
    isFilter: true
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
const promotions = ref<PROMOTION_RESPONSE[]>([])

const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    const res = await getPromotionList(param)
    meta.value = res._meta
    promotions.value = res.items
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const goToPageDetail = (item: any) => {
  // router.push({ name: 'order-detail', params: { id: item.id } })
}
</script>
