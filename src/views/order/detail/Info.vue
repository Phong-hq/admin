<template>
  <div>
    <div class="flex items-center gap-4 mb-4" v-if="order?.code">
      <p class="heading-2 !mb-0">Mã đơn hàng</p>
      {{ order?.code }}
    </div>

    <div class="flex items-center gap-4 mb-4" v-if="order?.channel">
      <p class="heading-2 !mb-0">Kênh bán</p>
      <a-tag class="">{{ order?.channel }}</a-tag>
    </div>

    <div class="flex items-center gap-4 mb-4" v-if="order && order?.channel != 'pos'">
      <p class="heading-2 !mb-0">Trạng thái</p>
      <dropdown-order :data="order" @getData="handleEmitData" />
    </div>

    <a-form
      ref="formRef"
      :model="formState"
      name="basic"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
      :rules="rules"
      labelWrap
      autocomplete="off"
    >
      <a-form-item lav name="supplier_id">
        <p class="heading-2 !mb-2">Khách hàng</p>
        <div class="w-full flex gap-2">
          <c-select-search
            :disabled="disabled"
            class="grow !mb-4"
            @change="handleChooseClient"
            v-model:value="formState.client_id"
            :extra-data="[{ value: order?.client?.id, label: order?.client?.name }]"
            default-data="client"
            placeholder="Chọn khách hàng"
          />
          <a :href="'/person/detail/' + formState.client_id" v-if="formState.client_id">
            <a-button class="shrink-0">
              <template #icon>
                <eye-outlined />
              </template>
            </a-button>
          </a>
        </div>
      </a-form-item>
    </a-form>
    <div class="p-2" v-if="loading">
      <a-spin></a-spin>
    </div>
    <div class="grid grid-cols-2">
      <div
        class="flex flex-col gap-4"
        v-if="
          formState?.shipping_address.name ||
          formState?.shipping_address.phone ||
          formState?.shipping_address.address
        "
      >
        <p class="heading-2 !mb-2">Địa chỉ giao hàng</p>
        <div class="flex items-start gap-2">
          <user-outlined class="mt-[2px]" />
          <p class="">{{ formState?.shipping_address?.name ?? '' }}</p>
        </div>
        <div class="flex items-start gap-2">
          <phone-outlined class="mt-[2px]" />
          <p class="">{{ formState?.shipping_address?.phone ?? '' }}</p>
        </div>
        <div class="flex items-start gap-2">
          <home-outlined class="mt-[2px]" />
          <p class="">{{ formState?.shipping_address?.address ?? '' }}</p>
        </div>
        <a-button
          class="w-[100px] !bg-blue"
          type="primary"
          @click="editAddress('shipping_address')"
          v-if="
            (formState?.shipping_address?.name ||
              formState?.shipping_address?.address ||
              formState?.shipping_address?.phone) &&
            !disabled
          "
          >Chỉnh sửa
        </a-button>
      </div>
      <!--  </div>-->
      <!--  <div class="grid grid-cols-2">-->
      <div
        class="flex flex-col gap-4"
        v-if="
          formState?.order_address.name ||
          formState?.order_address.phone ||
          formState?.order_address.address
        "
      >
        <p class="heading-2 !mb-2">Hóa đơn đến</p>
        <div class="flex items-start gap-2">
          <user-outlined class="mt-[2px]" />
          <p class="">{{ formState?.order_address?.name ?? '' }}</p>
        </div>
        <div class="flex items-start gap-2">
          <phone-outlined class="mt-[2px]" />
          <p class="">{{ formState?.order_address?.phone ?? '' }}</p>
        </div>
        <div class="flex items-start gap-2">
          <home-outlined class="mt-[2px]" />
          <p class="">{{ formState?.order_address?.address ?? '' }}</p>
        </div>
        <a-button
          class="w-[100px] !bg-blue"
          type="primary"
          @click="editAddress('order_address')"
          v-if="
            (formState?.order_address?.name ||
              formState?.order_address?.address ||
              formState?.order_address?.phone) &&
            !disabled
          "
          >Chỉnh sửa
        </a-button>
      </div>
    </div>
    <edit-address-modal ref="editAddressModalRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { HomeOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons-vue'
import type { ORDER_RESPONSE } from '@/types/order/website'
import type { RECEIPT_RESPONSE } from '@/types/inventory/inventory'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons-vue'

// COMPONENT
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import AddProductModal from '@/components/modal/EditAddressModal.vue'
import EditAddressModal from '@/components/modal/EditAddressModal.vue'
import DropdownOrder from '@/components/common/dropdown/DropdownOrder.vue'

// PINIA
import { useClientStore } from '@/stores/client'
import { useRootStore } from '@/stores/root'
import { useOrderStore } from '@/stores/order'

//UTILS
import { useDebounce } from '@/utils/debounce'
import { handle_error, handle_success } from '@/utils/message'

type Props = {
  order: ORDER_RESPONSE | null
  isEdit: boolean
  disabled: boolean
  modelValue?: number
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'getData', data: ORDER_RESPONSE): void
}>()

const clientStore = useClientStore()
const rootStore = useRootStore()
const orderStore = useOrderStore()

const { getClientDetail, getClientList } = clientStore

const formState = reactive({
  client_id: null as number | null,
  order_address: {
    name: '',
    phone: '',
    address: ''
  },
  shipping_address: {
    name: '',
    phone: '',
    address: ''
  }
})

const checkRequiredClientId = (rule: string, value: string, call: any) => {
  if (!formState.client_id && formState.client_id != 0) {
    return Promise.reject('')
  }
  return Promise.resolve()
}

const rules = computed(() => {
  return {
    supplier_id: [
      {
        required: !props.isEdit,
        validator: checkRequiredClientId,
        trigger: 'blur',
        message: 'Khách hàng để trống'
      }
    ]
  }
})

const fillFormData = (order?: ORDER_RESPONSE) => {
  formState.client_id = order?.client?.id ?? null
  formState.order_address.phone = order?.order_address?.phone ?? ''
  formState.order_address.address = order?.order_address?.address ?? ''
  formState.order_address.name = order?.order_address?.name ?? ''
  formState.shipping_address.phone = order?.shipping_address?.phone ?? ''
  formState.shipping_address.address = order?.shipping_address?.address ?? ''
  formState.shipping_address.name = order?.shipping_address?.name ?? ''
}

const handleChooseClient = async (id: any) => {
  try {
    loading.value = true
    if (props.isEdit) rootStore.showLoading()
    const res = await getClientDetail(id)
    formState.order_address.phone = res?.phone ?? ''
    formState.order_address.address = res?.address_1 ?? ''
    formState.order_address.name = res?.name ?? ''
    formState.shipping_address.phone = res?.phone ?? ''
    formState.shipping_address.address = res?.address_1 ?? ''
    formState.shipping_address.name = res?.name ?? ''
    handleInputChange()
  } catch (error) {
    handle_error(error, 'lấy thông tin khách hàng thất bại!!')
    rootStore.hideLoading()
  }
  loading.value = false
}

onMounted(async () => {
  if (!props.isEdit) {
    let urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('client_id')) {
      const client_id_param = urlParams.get('client_id')
      await handleChooseClient(client_id_param)
      formState.client_id = Number(client_id_param)
    }
  }
})

const editAddressModalRef = ref<InstanceType<typeof EditAddressModal> | null>(null)
const loading = ref(false)

const editAddress = async (key: 'order_address' | 'shipping_address') => {
  const res = await editAddressModalRef.value?.editAddress(formState[key])
  if (res != undefined) {
    formState[key] = res
    handleInputChange()
  }
}

const getFormState = () => {
  return formState
}

const handleEmitData = (data: ORDER_RESPONSE) => {
  emits('getData', data)
}

const handleInputChange = useDebounce(async () => {
  try {
    if (props.isEdit && !props.disabled) {
      rootStore.showLoading()
      let data = { ...formState, id: props.order?.id } as any
      const res = await orderStore.updateOrder(data)
      emits('getData', res)
      handle_success('cập nhập thành công')
    }
  } catch (e) {
    handle_error(e, 'Cập nhập thất bại')
  }
  rootStore.hideLoading()
}, 300) as () => void

defineExpose({ fillFormData, getFormState })
</script>

<style lang="scss"></style>
