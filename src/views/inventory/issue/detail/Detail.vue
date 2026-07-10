<template>
  <c-breadcrumb :page="data?.code ?? ''"></c-breadcrumb>
  <div class="flex gap-4">
    <div class="grow flex flex-col gap-4">
<!--      <div class="page-box-white">-->
<!--        <partner-info ref="partnerInfoRef" :data="data" :is-edit="isEdit" />-->
<!--      </div>-->
      <div class="page-box-white">
        <product-info
          ref="productInfoRef"
          :data="data"
          :is-edit="isEdit"
          :sub-data-ref="subDataRef"
          :sub-data-state="subDataState"
        />
      </div>
    </div>
    <div class="shrink-0 w-[30%] page-box-white">
      <p class="heading-1">Thông tin đơn nhập hàng</p>
      <sub-data ref="subDataRef" v-model="subDataState" :data="data" />
    </div>
  </div>
  <div class="sticky bottom-0 w-full flex-center gap-4 z-[2] mt-7">
    <a-button
      class="w-[150px]"
      type="primary"
      @click="createNewReceipt(RECEIPT_STATUS.Approved_Pending)"
      v-if="!disabled"
    >Lưu
    </a-button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ISSUE_RESPONSE, RECEIPT_RESPONSE } from '@/types/inventory/inventory'
import { RECEIPT_STATUS } from '@/constant/receipt'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import SubData from '@/views/inventory/issue/detail/SubData.vue'
import ProductInfo from '@/views/inventory/issue/detail/ProductInfo.vue'

// PINIA
import { useInventoryStore } from '@/stores/inventory'
import { useRootStore } from '@/stores/root'
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { ISSUE_STATUS, ISSUE_STATUS_DATA } from '@/constant/issue'

const inventoryStore = useInventoryStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()
const route = useRoute()
const router = useRouter()

const { getIssueDetail, createIssue } = inventoryStore

const receiptId = computed(() => String(route?.params?.id))
const isEdit = computed(() => route?.name == 'issue-detail')
const disabled = computed(() => data.value?.status == ISSUE_STATUS.Done && isEdit.value)

const subDataState = reactive({
  office_id: null as number | null,
  inventory_id: null as number | null,
  inventory_receive_id: null as number | null,
  office_receive_id: null as number | null,
  tags: [] as string[],
  note: ''
})

onMounted(async () => {
  selectDataStore.getOfficeList()
  selectDataStore.getInventoryList()
  selectDataStore.getSupplierList()
})

const data = ref<ISSUE_RESPONSE | null>(null)
const subDataRef = ref<InstanceType<typeof SubData> | null>(null)
const productInfoRef = ref<InstanceType<typeof ProductInfo> | null>(null)

const fillFormData = (res: ISSUE_RESPONSE | null) => {
  subDataState.office_id = res?.office_id ?? null
  subDataState.inventory_id = res?.inventory_id ?? null
  subDataState.office_receive_id = res?.office_receive_id ?? null
  subDataState.inventory_receive_id = res?.inventory_receive_id ?? null
  subDataState.note = res?.note ?? ''
}

const createNewReceipt = async (status: RECEIPT_STATUS) => {
  try {
    rootStore.showLoading()
    await subDataRef.value?.validate()
    const data = {
      ...subDataRef.value?.formState,
      issue_items: productInfoRef.value?.issue_items,
      status
    }

    const res = await createIssue(data)
    handle_success('Tạo xuất kho thành công!')
    router.push({ name: 'issue-list' })
  } catch (error) {
    console.log(error)
    handle_error(error, 'Tạo xuất kho thất bại!')
  }
  rootStore.hideLoading()
}

const initData = async () => {
  try {
    rootStore.showLoading()
    if (isEdit.value) {
      data.value = await getIssueDetail(receiptId.value || '')
    }
    fillFormData(data.value)
  } catch (error) {
    handle_error(error, 'Tải dữ liệu thất bại!')
  }
  rootStore.hideLoading()
}

watch(
  receiptId,
  (newValue) => {
    if (newValue && isEdit.value) {
      initData()
    }
  },
  { immediate: true }
)
</script>

<style lang="scss"></style>
