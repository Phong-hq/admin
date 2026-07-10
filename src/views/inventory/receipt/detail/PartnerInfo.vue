<template>
  <div>
    <div class="flex items-center gap-4 mb-4">
      <p class="heading-2 !mb-0">Trạng thái:</p>
      <dropdown-inventor :data="data" v-if="isEdit && data" @getData="handleEmitData" />
    </div>
    <p class="heading-2">
      Nhà cung cấp:
      <span class="font-normal text-base ml-1" v-if="isEdit">{{ data?.supplier?.name ?? '' }}</span>
    </p>
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
      <a-form-item name="supplier_id" v-if="!isEdit">
        <c-select-search
          class="w-full !mb-4"
          :search="selectDataStore.searchSupplierList"
          @change="handleChooseSupplier"
          v-model:value="formState.supplier_id"
          :extra-data="[{ value: data?.supplier?.id, label: data?.supplier?.name }]"
          default-data="supplier"
          placeholder="Chọn nhà cung cấp"
        />
      </a-form-item>
    </a-form>
    <div v-if="supplierLoading">
      <a-spin></a-spin>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div
        class="w-full flex flex-col gap-2"
        v-if="
          formState?.shipping_address?.name ||
          formState?.shipping_address?.phone ||
          formState?.shipping_address?.address
        "
      >
        <p class="heading-2 mb-0">Địa chỉ xuất hàng</p>
        <div>
          <user-outlined />
          <span class="ml-2">{{ formState.shipping_address?.name ?? '' }}</span>
        </div>
        <div>
          <phone-outlined />
          <span class="ml-2">{{ phoneNumberFormat(formState.shipping_address?.phone ?? '') }}</span>
        </div>
        <div>
          <home-outlined />
          <span class="ml-2">{{ formState.shipping_address?.address ?? '' }}</span>
        </div>
        <a-button
          class="w-[100px] !bg-blue"
          type="primary"
          @click="editAddress('shipping_address')"
          v-if="
            (formState.shipping_address?.name ||
              formState.shipping_address?.phone ||
              formState.shipping_address?.address) &&
            !disabled
          "
          >Chỉnh sửa
        </a-button>
      </div>
      <div
        class="w-full flex flex-col gap-2"
        v-if="
          formState?.billing_address?.name ||
          formState?.billing_address?.phone ||
          formState?.billing_address?.address
        "
      >
        <p class="heading-2 mb-0">Địa chỉ xuất hoá đơn</p>
        <div>
          <user-outlined />
          <span class="ml-2">{{ formState?.billing_address?.name ?? '' }}</span>
        </div>
        <div>
          <phone-outlined />
          <span class="ml-2">{{ phoneNumberFormat(formState?.billing_address?.phone ?? '') }}</span>
        </div>
        <div>
          <home-outlined />
          <span class="ml-2">{{ formState?.billing_address?.address ?? '' }}</span>
        </div>
        <a-button
          class="w-[100px] !bg-blue"
          type="primary"
          @click="editAddress('billing_address')"
          v-if="
            (formState.billing_address?.name ||
              formState.billing_address?.phone ||
              formState.billing_address?.address) &&
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
import { ref, onMounted, computed, reactive } from 'vue'
import type { RECEIPT_RESPONSE } from '@/types/inventory/inventory'
import type { SelectConfig } from '@/types'
import { UserOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons-vue'

// COMPONENT
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import EditAddressModal from '@/views/inventory/receipt/detail/EditAddressModal.vue'
import DropdownInventor from '@/components/common/dropdown/DropdownInventor.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'
import { useSupplierStore } from '@/stores/supplier'
import { phoneNumberFormat } from '../../../../utils/form-rule-helper'

//UTILS

type Props = {
  data: RECEIPT_RESPONSE | null
  isEdit: boolean
  disabled: boolean
  modelValue?: number
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'getData', data: RECEIPT_RESPONSE): void
}>()

const selectDataStore = useSelectDataStore()
const supplierStore = useSupplierStore()

const { getSupplierDetail } = supplierStore

const rules = computed(() => {
  return {
    supplier_id: [{ required: !props.isEdit, trigger: 'blur', message: 'Nhà cung cấp để trống' }]
  }
})

onMounted(async () => {})

const supplierLoading = ref(false)
const formRef = ref<any>(null)
const editAddressModalRef = ref<InstanceType<typeof EditAddressModal> | null>(null)
const formState = reactive({
  supplier_id: null as number | null,
  shipping_address: {
    name: '',
    phone: '',
    address: ''
  },
  billing_address: {
    name: '',
    phone: '',
    address: ''
  }
})

const handleChooseSupplier = async (id: any) => {
  try {
    if (id == undefined) {
      resetAddress()
      return
    }
    supplierLoading.value = true
    const res: any = await getSupplierDetail(id)
    resetAddress(res)
  } finally {
    supplierLoading.value = false
  }
}

const resetAddress = (data?: any) => {
  formState.shipping_address.name = data?.name ?? ''
  formState.shipping_address.phone = data?.phone ?? ''
  formState.shipping_address.address = data?.address_1 ?? ''
  formState.billing_address.name = data?.name ?? ''
  formState.billing_address.phone = data?.phone ?? ''
  formState.billing_address.address = data?.address_1 ?? ''
}

const validate = async () => {
  return await formRef.value?.validate()
}

const editAddress = async (key: 'billing_address' | 'shipping_address') => {
  const res = await editAddressModalRef.value?.editAddress(formState[key])
  if (res) formState[key] = res
}

const fillFormData = (receipt: RECEIPT_RESPONSE) => {
  formState.supplier_id = receipt?.supplier?.id ?? null
  formState.shipping_address.name = receipt?.shipping_address?.name ?? ''
  formState.shipping_address.phone = receipt?.shipping_address?.phone ?? ''
  formState.shipping_address.address = receipt?.shipping_address?.address ?? ''
  formState.billing_address.address = receipt?.billing_address?.address ?? ''
  formState.billing_address.name = receipt?.billing_address?.name ?? ''
  formState.billing_address.phone = receipt?.billing_address?.phone ?? ''
}

const handleEmitData = (data: RECEIPT_RESPONSE) => {
  emits('getData', data)
}

defineExpose({ validate, formState, fillFormData })
</script>

<style lang="scss"></style>
