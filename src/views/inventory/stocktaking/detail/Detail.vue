<template>
  <c-breadcrumb :page="data?.code ?? ''"></c-breadcrumb>
<!--  <div class="w-full page-box-white mb-4" v-if="isEdit && data?.progress_status">-->
<!--    <div class="flex-center gap-4 p-4">-->
<!--      <receipt-progress class="max-w-[1200px]" :data="data?.progress_status ?? []" />-->
<!--    </div>-->
<!--  </div>-->
  <div class="flex gap-4">
    <div class="grow flex flex-col gap-4">
      <div class="page-box-white">
        <product-info
          :sub-data-state="subDataState"
          ref="productInfoRef"
          :data="data"
          :is-edit="isEdit"
          :sub-data-ref="subDataRef"
        />
      </div>
    </div>
    <div class="shrink-0 w-[30%] page-box-white">
      <p class="heading-1">Thông tin kiểm kê</p>
      <sub-data ref="subDataRef" v-model="subDataState" />
    </div>
  </div>
  <div class="sticky bottom-0 w-full flex-center gap-4 z-[2] mt-7">
    <a-button class="w-[150px]" type="primary" @click="createNewReceipt()"
    >Lưu</a-button
    >
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RECEIPT_RESPONSE, STOCKTAKING_RESPONSE } from '@/types/inventory/inventory'
import { RECEIPT_STATUS } from '@/constant/receipt'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import SubData from './SubData.vue'
import ProductInfo from './ProductInfo.vue'

// PINIA
import { useInventoryStore } from '@/stores/inventory'
import { useRootStore } from '@/stores/root'
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

const inventoryStore = useInventoryStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()
const route = useRoute()
const router = useRouter()

const { getStocktakingDetail, createStocktaking } = inventoryStore

const receiptId = computed(() => String(route?.params?.id))
const isEdit = computed(() => route?.name == 'stocktaking-detail')

const subDataState = reactive({
  office_id: null as number | null,
  inventory_id: null as number | null,
  tags: [] as string[],
  note: ''
})

onMounted(async () => {
  try {
    rootStore.showLoading()
    await selectDataStore.getOfficeList()
    await selectDataStore.getInventoryList()
    await selectDataStore.getSupplierList()
    if (isEdit.value) {
      data.value = await getStocktakingDetail(receiptId.value || '')
      console.log(data.value,'data.value')
    }
    fillFormData(data.value)
  } catch (error) {
    handle_error(error, 'Tải dữ liệu thất bại!')
  }
  rootStore.hideLoading()
})

const data = ref<STOCKTAKING_RESPONSE | null>(null)
const subDataRef = ref<InstanceType<typeof SubData> | null>(null)
const productInfoRef = ref<InstanceType<typeof ProductInfo> | null>(null)

const fillFormData = (res: STOCKTAKING_RESPONSE | null) => {
  subDataState.office_id = res?.office_id ?? null
  subDataState.inventory_id = res?.inventory_id ?? null
  subDataState.tags = res?.tags ?? []
  subDataState.note = res?.note ?? ''
}

const createNewReceipt = async () => {
  try {
    rootStore.showLoading()
    const data = {
      ...subDataRef.value?.formState,
      stocktaking_items: productInfoRef.value?.stocktaking_items,
    }

    const res = await createStocktaking(data)
    handle_success('Tạo phiếu kiểm kê thành công!')
    router.push({ name: 'stocktaking-detail', params: { id: res?.id ?? '' } })
  } catch (error) {
    console.log(error)
    handle_error(error, 'Tạo phiếu kiểm kê thất bại!')
  }
  rootStore.hideLoading()
}
</script>

<style lang="scss"></style>
