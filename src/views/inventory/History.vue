<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="w-full">
      <div class="flex justify-between items-center gap-2 mb-2">
        <div class="flex-center gap-4 mb-4">
          <p class="heading-1 mb-0">Lịch sử thay đổi</p>
          <div class="flex-center gap-2">
<!--            <p class="heading-2 mb-0">Kho:</p>-->
            <c-select-search
              class="w-[200px]"
              v-model:value="inventory_id"
              default-data="inventory"
              @change="initData()"
            />
          </div>
        </div>
        <div class="flex-center gap-2">
<!--          <p class="heading-2 mb-0">Kho:</p>-->
<!--          <c-select-search-->
<!--            class="w-[200px]"-->
<!--            v-model:value="inventory_id"-->
<!--            default-data="inventory"-->
<!--            @change="initData()"-->
<!--          />-->
          <!--          <p class="heading-2 mb-0 ml-4">Chi nhánh:</p>-->
          <!--          <c-select-search class="w-[200px]" v-model:value="office_id" default-data="office" @change="initData()"/>-->
        </div>
      </div>
      <c-table-ant
        class=""
        :columns="columns"
        :data="inventoryHistory"
        :meta="meta"
        primary-key="id"
        expand-title="test"
        :loading="tableLoading"
        @get-data="initData"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'created_at'">
            <box-created-time :time="text" />
          </template>
          <!--          <template v-else-if="column.key == 'voucher_code'">-->
          <!--            <p class="link" @click="goToViewDetail(record)">{{ text }}</p>-->
          <!--          </template>-->
          <template v-else-if="column.key == 'product_variant_id'">
            <popover-product :data="record.product_variant"
              ><span class="text-link">{{ text }}</span></popover-product
            >
          </template>
          <template v-else-if="column.key == 'action'">
            <box-action hide-edit hide-remove view @view="goToViewDetail(record)"></box-action>
          </template>
        </template>
      </c-table-ant>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { COLUMN_TYPE } from '@/types/table'
import { ORDER_STATUS_DATA, getStatusLabel } from '@/constant/order'
import type { INVENTORY_HISTORY_RESPONSE } from '@/types/inventory/inventory'
import { INVENTORY_MANAGER_CODE, INVENTORY_MANAGER_TYPE } from '@/constant/inventory'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { currency } from '@/utils/currency'

//PINIA
import { useInventoryStore } from '@/stores/inventory'
import { useSelectDataStore } from '@/stores/select_data'
import { useRootStore } from '@/stores/root'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import PopoverProduct from '@/components/common/popover/Product.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

const inventoryStore = useInventoryStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()
const router = useRouter()
const route = useRoute()

const { getInventoryHistory, viewInventoryModule, setWaitingIssueDetail, setWaitingReceiptDetail } =
  inventoryStore

const columns = [
  {
    title: 'Mã phiếu hàng',
    key: 'voucher_code',
    inputProps: { inputType: 'text' },
    isFilter: true,
    width: 'md'
  },
  {
    title: 'Tên sản phẩm',
    key: {
      name: 'product_variant_id',
      value: 'product_variant,id',
      label: 'product_variant,name'
    },
    align: 'left',
    // inputProps: { inputType: 'text' },
    inputProps: {
      inputType: 'select-search',
      data: {
        defaultData: 'variant',
        placeHolder: 'Chon sản phẩm'
      }
    },
  },
  {
    title: 'Chi nhánh',
    key: {
      name: 'office',
      value: 'office,id',
      label: 'office,name'
    },
    width: 'lg',
    inputProps: {
      inputType: 'select-search',
      data: {
        defaultData: 'office',
        placeHolder: 'Chon chi nhánh'
      }
    },
    // isFilter: true,
    hidden: true
    // inputProps: {
    //   inputType: 'text'
    // }
  },
  {
    title: 'Kho',
    key: {
      value: 'inventory,id',
      name: 'inventory_id',
      label: 'inventory,name'
    },
    inputProps: {
      inputType: 'select-search',
      data: {
        defaultData: 'inventory',
        placeHolder: 'Chon kho'
      }
    },
    // isFilter: true,
    hidden: true,
    width: 'lg'
  },
  {
    title: 'Tạo bởi',
    key: 'created_by',
    inputProps: { inputType: 'text' },
    width: 'lg'
  },
  {
    title: 'Hành động',
    key: {
      value: 'action',
      name: 'action_column',
      label: 'action'
    },
    width: 'lg'
  },
  {
    title: 'SL thay đổi',
    align: 'right',
    key: 'change_quantity',
    width: 'sm'
  },
  {
    title: 'SL sau thay đổi',
    key: 'number_inventory',
    align: 'right',
    width: 'sm'
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    sorter: true,
    align: 'right',
    width: 'lg'
  },
  {
    title: '-',
    key: 'action',
    align: 'center'
  }
] as COLUMN_TYPE[]

onMounted(() => {
  selectDataStore.getInventoryList()
  selectDataStore.getOfficeList()
  selectDataStore.getVariantList()
  inventory_id.value = Number(route?.params?.id)
  initData()
})

const tableLoading = ref(false)
const meta = ref<MetaResponse | null>(null)
const inventoryHistory = ref<INVENTORY_HISTORY_RESPONSE[]>([])
const inventory_id = ref<any>(null)
const office_id = ref<any>(null)

const initData = async (param?: any) => {
  try {
    tableLoading.value = true

    const data = { ...param, inventory_id: inventory_id.value, office: office_id.value }

    const res = await getInventoryHistory(data)
    meta.value = res._meta
    inventoryHistory.value = res.items
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const goToViewHistory = (item?: any) => {
  router.push({ name: 'order-detail', params: { id: 'sfd' } })
}

const showDetail = () => {}

// const supplierList = (data: any) => {
//   const key = Object.keys(data)
//   let result = [] as any
//   key?.forEach(key => {
//     if(data[key]?.name) result.push(data[key]?.name)
//   })
//   return result
// }

const goToViewDetail = async (item: any) => {
  try {
    rootStore.showLoading()
    const res = await viewInventoryModule(item?.id)
    if (res?.type == INVENTORY_MANAGER_TYPE.ISSUER) {
      setWaitingIssueDetail(res.result)
      router.push({ name: 'issue-detail', params: { id: res?.result?.id ?? '' } })
    } else if (res?.type == INVENTORY_MANAGER_TYPE.RECEIPT) {
      setWaitingReceiptDetail(res.result)
      router.push({ name: 'receipt-detail', params: { id: res?.result?.id ?? '' } })
    }
  } catch (e) {
    handle_error(e)
  }
  rootStore.hideLoading()
}
</script>
