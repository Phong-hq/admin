<template>
  <div>
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
      <a-form-item name="supplier_id">
        <c-select-search
          class="w-full !mb-4"
          :search="selectDataStore.searchSupplierList"
          @change="handleChooseSupplier"
          v-model:value="formState.supplier_id"
          default-data="supplier"
          placeholder="Chọn nhà cung cấp"
          v-if="!isEdit"
        />
      </a-form-item>
    </a-form>
    <div v-if="supplierLoading">
      <a-spin></a-spin>
    </div>
    <div class="grid grid-cols-2 gap-4" v-else-if="isEdit">
      <div class="w-full flex flex-col gap-2">
        <p class="heading-2 mb-0">Địa chỉ xuất hàng</p>
        <div>
          <user-outlined />
          <span class="ml-2">{{ data?.shipping_address?.name ?? '' }}</span>
        </div>
        <div>
          <phone-outlined />
          <span class="ml-2">{{ data?.shipping_address?.phone ?? '' }}</span>
        </div>
        <div>
          <home-outlined />
          <span class="ml-2">{{ data?.shipping_address?.address ?? '' }}</span>
        </div>
      </div>
      <div class="w-full flex flex-col gap-2">
        <p class="heading-2 mb-0">Địa chỉ xuất hoá đơn</p>
        <div>
          <user-outlined />
          <span class="ml-2">{{ data?.billing_address?.name ?? '' }}</span>
        </div>
        <div>
          <phone-outlined />
          <span class="ml-2">{{ data?.billing_address?.phone ?? '' }}</span>
        </div>
        <div>
          <home-outlined />
          <span class="ml-2">{{ data?.billing_address?.address ?? '' }}</span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4" v-else>
      <div class="w-full flex flex-col gap-2">
        <p class="heading-2 mb-0">Địa chỉ xuất hàng</p>
        <div>
          <user-outlined />
          <span class="ml-2">{{ formState.shipping_address?.name ?? '' }}</span>
        </div>
        <div>
          <phone-outlined />
          <span class="ml-2">{{ formState.shipping_address?.phone ?? '' }}</span>
        </div>
        <div>
          <home-outlined />
          <span class="ml-2">{{ formState.shipping_address?.address ?? '' }}</span>
        </div>
      </div>
      <div class="w-full flex flex-col gap-2">
        <p class="heading-2 mb-0">Địa chỉ xuất hoá đơn</p>
        <div>
          <user-outlined />
          <span class="ml-2">{{ formState?.billing_address?.name ?? '' }}</span>
        </div>
        <div>
          <phone-outlined />
          <span class="ml-2">{{ formState?.billing_address?.phone ?? '' }}</span>
        </div>
        <div>
          <home-outlined />
          <span class="ml-2">{{ formState?.billing_address?.address ?? '' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, reactive } from 'vue'
import type { RECEIPT_RESPONSE } from '@/types/inventory/inventory'
import type { SelectConfig } from '@/types'
import { UserOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons-vue'

// COMPONENT
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'
import { useSupplierStore } from '@/stores/supplier'

//UTILS

type Props = {
  data: RECEIPT_RESPONSE | null
  isEdit: boolean
  modelValue?: number
}

const props = withDefaults(defineProps<Props>(), {})

const selectDataStore = useSelectDataStore()
const supplierStore = useSupplierStore()

const { getSupplierDetail } = supplierStore

const rules = computed(() => {
  return {
    supplier_id: [{ required: !props.isEdit, trigger: 'blur', message: 'Nhà cung cấp để trống' }]
  }
})

onMounted(async () => {})

const supplierDetail = ref<any>(null)
const supplierLoading = ref(false)
const formRef = ref<any>(null)
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

const resetAddress = (data? : any) => {
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

defineExpose({ validate, formState })
</script>

<style lang="scss"></style>
