<template>
  <c-breadcrumb :page="data?.code ?? ''"></c-breadcrumb>
  <div class="w-full page-box-white mb-4" v-if="isEdit && data?.progress_status">
    <div class="flex-center gap-4 p-4">
      <receipt-progress
        class="max-w-[600px]"
        :data="data?.progress_status ?? []"
        @change-status="handleChangeStatus"
      />
    </div>
  </div>
  <div class="flex gap-4">
    <div class="grow flex flex-col gap-4">
      <!--      <div class="page-box-white">-->
      <!--        <p class="heading-1">Thông tin nhà cung  cấp</p>-->
      <!--        <partner-info ref="partnerInfoRef" :data="data" :is-edit="isEdit" />-->
      <!--      </div>-->
      <div class="page-box-white">
        <product-info
          ref="productInfoRef"
          :data="data"
          :is-edit="isEdit"
          :sub-data-ref="subDataRef"
          :partner-ref="partnerInfoRef"
          :disabled="disabled"
        />
      </div>
    </div>
    <div class="shrink-0 w-[30%] flex flex-col gap-y-4">
      <div class="page-box-white">
        <p class="heading-1">Thông tin phiếu nhập hàng</p>
        <partner-info ref="partnerInfoRef" :data="data" :is-edit="isEdit" :disabled="disabled" @getData="fillFormData"/>
      </div>
      <div class="page-box-white">
        <p class="heading-1">Phân loại</p>
        <sub-data ref="subDataRef" v-model="subDataState" :data="data" />
      </div>
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
    <a-button
      class="!bg-success"
      type="primary"
      @click="createNewReceipt(RECEIPT_STATUS.Done)"
      v-if="!isEdit"
    >Lưu và hoàn thành phiếu
    </a-button>
<!--    <a-dropdown placement="top" v-if="!disabled && isEdit">-->
<!--      <a-button class="w-[150px] !bg-blue" type="primary">Đổi trạng thái</a-button>-->
<!--      <template #overlay>-->
<!--        <a-menu>-->
<!--          <a-menu-item class="h-10" @click="handleChangeStatus('done')">-->
<!--            <a-space>-->
<!--              <p>Hoàn thành nhập kho</p>-->
<!--            </a-space>-->
<!--          </a-menu-item>-->
<!--          <a-menu-item class="h-10" @click="handleChangeStatus('cancel')">-->
<!--            <a-space>-->
<!--              <p>Hủy nhập kho</p>-->
<!--            </a-space>-->
<!--          </a-menu-item>-->
<!--        </a-menu>-->
<!--      </template>-->
<!--    </a-dropdown>-->
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RECEIPT_RESPONSE } from '@/types/inventory/inventory'
import { RECEIPT_STATUS } from '@/constant/receipt'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import SubData from '@/views/inventory/receipt/detail/SubData.vue'
import ReceiptProgress from './ReceiptProgress.vue'
import PartnerInfo from '@/views/inventory/receipt/detail/PartnerInfo.vue'
import ProductInfo from '@/views/inventory/receipt/detail/ProductInfo.vue'

// PINIA
import { useInventoryStore } from '@/stores/inventory'
import { useRootStore } from '@/stores/root'
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { ORDER_STATUS } from '@/constant/order'

const inventoryStore = useInventoryStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()
const route = useRoute()
const router = useRouter()

const { getReceiptDetail, createReceipt, changeReceiptStatus, updateReceipt } = inventoryStore

const receiptId = computed(() => String(route?.params?.id))
const isEdit = computed(() => route?.name == 'receipt-detail')
const disabled = computed(
  () =>
    isEdit.value &&
    (data.value?.status == RECEIPT_STATUS.Done || data.value?.status == RECEIPT_STATUS.Cancel)
)

const subDataState = reactive({
  office_id: null as number | null,
  inventory_id: null as number | null,
  tags: [] as string[],
  note: ''
})

onMounted(async () => {
  selectDataStore.getOfficeList()
  selectDataStore.getInventoryList()
  selectDataStore.getSupplierList()
})

const data = ref<RECEIPT_RESPONSE | null>(null)
const subDataRef = ref<InstanceType<typeof SubData> | null>(null)
const partnerInfoRef = ref<InstanceType<typeof PartnerInfo> | null>(null)
const productInfoRef = ref<InstanceType<typeof ProductInfo> | null>(null)

const fillFormData = (res: RECEIPT_RESPONSE) => {
  data.value = res
  subDataState.office_id = res?.office_id ?? null
  subDataState.inventory_id = res?.inventory_id ?? null
  subDataState.tags = res?.tags ?? []
  subDataState.note = res?.note ?? ''
  partnerInfoRef.value?.fillFormData(res)
  productInfoRef.value?.fillFormData(res)
}

const createNewReceipt = async (status: RECEIPT_STATUS) => {
  try {
    await partnerInfoRef.value?.validate()
    await subDataRef.value?.validate()
    rootStore.showLoading()
    const form = {
      id: null,
      ...partnerInfoRef.value?.formState,
      ...subDataRef.value?.formState,
      ...productInfoRef.value?.getTotalForm(),
      receipt_items: productInfoRef.value?.receipt_items,
      status
    } as any

    let res = null as any
    if (isEdit.value) {
      form.id = data.value?.id
      console.log(form)
      console.log(data.value)
      res = await updateReceipt(form)
    } else {
      res = await createReceipt(form)
    }
    handle_success(isEdit.value ? 'Cập nhập thành công!' : 'Tạo nhập kho thành công!')
    router.push({ name: 'receipt-detail', params: { id: res?.id ?? '' } })
  } catch (error) {
    console.log(error)
    handle_error(error, isEdit.value ? 'Cập nhập thất bại!' : 'Tạo nhập kho thất bại!')
  }
  rootStore.hideLoading()
}

const initData = async () => {
  try {
    rootStore.showLoading()
    if (isEdit.value) {
      data.value = await getReceiptDetail(receiptId.value || '')
    }
    if(data.value) fillFormData(data.value)
  } catch (error) {
    handle_error(error, 'Tải dữ liệu thất bại!')
  }
  rootStore.hideLoading()
}

const handleChangeStatus = async (type: 'done' | 'approved' | 'cancel') => {
  try {
    // rootStore.showLoading()
    const res = await changeReceiptStatus(type, data.value)
    // await initData()
    fillFormData(res)
    handle_success('Cập nhập thành công')
  } catch (error) {
    rootStore.hideLoading()
    handle_error(error, 'Cập nhập thất bại!')
  }
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
