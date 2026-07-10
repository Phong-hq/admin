<template>
  <c-breadcrumb :page="customer?.name ?? ''"></c-breadcrumb>

  <div class="flex gap-4">
    <div class="w-[30%] max-w-[320px]">
      <div class="h-auto page-box-white !px-0">
        <template v-for="item in menu" :key="item.value">
          <div
            class="flex items-center justify-between cursor-pointer py-4 px-4"
            :class="{ 'bg-primary text-white duration-200': item.value == menuActive }"
            @click="changeMenu(item.value)"
          >
            <div class="flex-center gap-2">
              <component class="text-lg" :is="item.icon"></component>
              <p class="heading-2 mb-0">{{ item.title }}</p>
            </div>
            <span>{{ item.description }}</span>
          </div>
          <div class="px-4">
            <a-divider class="!my-0" />
          </div>
        </template>
      </div>
    </div>
    <div class="grow page-box-white">
      <template v-if="MENU.INFO == menuActive">
        <p class="heading-1">Thông tin khách hàng</p>
        <customer-info v-model="customer" v-if="customer" />
        <div class="flex-center">
          <a-button
            class="!w-[200px]"
            type="primary"
            @click="updateCustomer"
            :loading="submitLoading"
            >Lưu
          </a-button>
        </div>
      </template>
      <div v-if="initDone">
        <contact
          :customer-id="customerId"
          v-show="MENU.CONTACT == menuActive"
          @update="handleDataUpdate($event, 'count_contact')"
        />
        <note
          :customer-id="customerId"
          v-show="MENU.NOTE == menuActive"
          @update="handleDataUpdate($event, 'count_note')"
        />
        <order :customer-id="customerId" v-show="MENU.ORDER == menuActive" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  ReadOutlined,
  ContactsOutlined,
  ContainerOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons-vue'
import type {
  CUSTOMER_RESPONSE,
  CONTACT_CUSTOMER_RESPONSE,
  NOTE_CUSTOMER_RESPONSE
} from '@/types/customer/customer'
import type { ORDER_RESPONSE } from '@/types/order/website'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CustomerInfo from '@/views/customer/CustomerInfo.vue'
import Contact from '@/views/customer/detail/Contact.vue'
import Note from '@/views/customer/detail/Note.vue'
import Order from '@/views/customer/detail/Order.vue'

// PINIA
import { useCustomerStore } from '@/stores/customer'
import { useRootStore } from '@/stores/root'
import { useOrderStore } from '@/stores/order'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

const customerStore = useCustomerStore()
const rootStore = useRootStore()
const orderStore = useOrderStore()
const route = useRoute()

const { getCustomerDetail, updateCustomerDetail, getContactCustomerDetail, getNoteCustomerDetail } =
  customerStore
const { showLoading, hideLoading } = rootStore
const { getOrderList } = orderStore

enum MENU {
  INFO = 'view',
  CONTACT = 'contact',
  NOTE = 'note',
  ORDER = 'order'
}

const customerId = computed(() => String(route.params?.id))
const menu = computed(() => [
  {
    title: 'Hồ sơ',
    value: MENU.INFO,
    description: customer.value?.code,
    icon: ReadOutlined
  },
  {
    title: 'Liên hệ',
    value: MENU.CONTACT,
    description: customer.value?.count_contact ?? '0',
    icon: ContactsOutlined
  },
  {
    title: 'Ghi chú',
    value: MENU.NOTE,
    description: customer.value?.count_note ?? '0',
    icon: ContainerOutlined
  },
  {
    title: 'Đơn hàng',
    value: MENU.ORDER,
    description: customer.value?.count_order ?? '0',
    icon: ShoppingCartOutlined
  }
])

onMounted(() => {
  initData()
})

const customer = ref<CUSTOMER_RESPONSE | null>(null)
const contactData = ref<DataWithMetaResponse<CONTACT_CUSTOMER_RESPONSE[]> | null>(null)
const noteData = ref<DataWithMetaResponse<NOTE_CUSTOMER_RESPONSE[]> | null>(null)
const orderData = ref<DataWithMetaResponse<ORDER_RESPONSE[]> | null>(null)
const menuActive = ref(MENU.INFO)
const submitLoading = ref(false)
const loading3 = ref(false)
const loading4 = ref(false)
const initDone = ref(false)

const initData = async () => {
  try {
    showLoading()
    initDone.value = false
    customer.value = await getCustomerDetail(customerId.value)
    hideLoading()
    // initContactCustomerDetail()
    // initNoteCustomerDetail()
    // initOrderCustomerDetail()
  } catch (error) {
    hideLoading()
    handle_error(error)
  }
  initDone.value = true
}

// const initContactCustomerDetail = async () => {
//   try {
//     loading2.value = true
//     contactData.value = await getContactCustomerDetail(customerId.value)
//   } catch (error) {
//     handle_error(error)
//   }
//   loading2.value = false
// }

const initNoteCustomerDetail = async () => {
  try {
    loading3.value = true
    noteData.value = await getNoteCustomerDetail(customerId.value)
  } catch (error) {
    handle_error(error)
  }
  loading3.value = false
}

const initOrderCustomerDetail = async () => {
  try {
    loading4.value = true
    orderData.value = await getOrderList({ client_id: customerId.value })
  } catch (error) {
    handle_error(error)
  }
  loading4.value = false
}

const changeMenu = (value: MENU) => {
  menuActive.value = value
}

const updateCustomer = async () => {
  try {
    submitLoading.value = true
    customer.value = await updateCustomerDetail(customer.value)
    handle_success('Cập nhập thông tin khách hàng thành công!')
  } catch (e) {
    handle_error(e, 'Cập nhập thất bại!')
  }
  submitLoading.value = false
}

const handleDataUpdate = ( value: any, key: 'count_contact' | 'count_note') => {
  if (customer.value) customer.value[key] = value
}
</script>

<style lang="scss"></style>
