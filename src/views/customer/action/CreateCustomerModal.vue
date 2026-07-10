<template>
  <div @click="showModal">
    <slot></slot>
  </div>
  <a-modal
    v-model:open="open"
    title="Tạo khách hàng"
    @ok="handleOk"
    :width="1000"
    :after-close="handleAfterClose"
  >
    <template #footer>
      <div class="flex justify-end gap-2">
        <a-button @click="hide">Hủy</a-button>
        <a-button type="primary" @click="handleOk" :loading="loading">Tạo</a-button>
      </div>
    </template>
    <p class="col-span-2 heading-1">Thông tin khách hàng</p>
    <customer-info ref="customerInfoRef" v-model="customerInfoState" />
    <a-form
      :model="formState"
      class="form-2"
      ref="formRef"
      name="basic"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
      :rules="rules"
      labelWrap
      autocomplete="off"
      @finish="handleOk"
      @keyEnter="handleOk"
    >

      <div class="col-span-2 flex justify-between">
        <p class="heading-1">Thông tin cửa hàng</p>
        <a-button type="primary" @click="autoFill(true)"> Điền nhanh</a-button>
      </div>

      <a-form-item class="" label="Tên:" name="owner_first_name">
        <a-input v-model:value="formState.owner_first_name" />
      </a-form-item>

      <a-form-item class="" label="Địa chỉ 1:" name="owner_address_1">
        <a-input v-model:value="formState.owner_address_1" />
      </a-form-item>

      <a-form-item class="" label="Số điện thoại:" name="owner_phone">
        <a-input
          v-model:value="formState.owner_phone"
          @input="formState.owner_phone = phoneNumberFormat(formState.owner_phone)"
        />
      </a-form-item>

      <a-form-item class="" label="Địa chỉ 2:" name="owner_address_2">
        <a-input v-model:value="formState.owner_address_2" />
      </a-form-item>
      <a-form-item class="" label="Email:" name="owner_email">
        <a-input v-model:value="formState.owner_email" />
      </a-form-item>
      <a-form-item class="" label="Mã bưu điện:" name="postal_code_2">
        <a-input v-model:value="formState.postal_code_2" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import type { SelectConfigItem } from '@/types'

// COMPONENT
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import CustomerInfo from '@/views/customer/CustomerInfo.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'
import { useCustomerStore } from '@/stores/customer'

//UTILS
import { isValidEmail, phoneNumberFormat } from '@/utils/form-rule-helper'
import { handle_error, handle_success } from '@/utils/message'

const selectDataStore = useSelectDataStore()
const customerStore = useCustomerStore()

const rules = {
  owner_address_1: [{ required: true, message: 'Địa chỉ bỏ trống!', trigger: 'blur' }],
  owner_first_name: [{ required: true, message: 'Tên bỏ trống!', trigger: 'blur' }],
}

const customerInfoState = reactive({
  id: null as null | number,
  address_1: '',
  address_2: '',
  district_code: '',
  email: '',
  group: '',
  name: '',
  note: '',
  phone: '',
  postal_code: '',
  time_zone: '',
  type: '',
  province_code: '',
  ward_code: '',
  website: '',
  status: true
})

const formState = reactive({
  owner_address_1: '',
  owner_address_2: '',
  owner_email: '',
  owner_first_name: '',
  owner_phone: '',
  postal_code_2: '',
  time_zone_2: '',
})

onMounted(async () => {
})

const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const customerInfoRef = ref<InstanceType<typeof CustomerInfo> | null >(null)

const handleOk = async (e: MouseEvent) => {
  try {
    await customerInfoRef.value?.validate()
    await formRef.value?.validate()
    loading.value = true
    await customerStore.createCustomer(formState)
    handle_success('Tạo khách hàng thành công')
    open.value = false
  } catch (e) {
    handle_error(e, 'Tạo mới khách hàng thất bại!')
  }
}

const hide = () => {
  open.value = false
}

const showModal = () => {
  open.value = true
}

const handleAfterClose = () => {
  formRef.value?.clearValidate()
  customerInfoRef.value?.fillFormData()
  formState.owner_address_1 = ''
  formState.owner_address_2 = ''
  formState.owner_email = ''
  formState.owner_first_name = ''
  formState.owner_phone = ''
  formState.postal_code_2 = ''
}

const autoFill = (e: any) => {
  if (e) {
    formState.owner_address_1 = customerInfoState.address_1
    formState.owner_address_2 = customerInfoState.address_2
    formState.owner_first_name = customerInfoState.name
    formState.owner_phone = customerInfoState.phone
    formState.owner_email = customerInfoState.email
    formState.postal_code_2 = customerInfoState.postal_code
  }
}
</script>

<style lang="scss"></style>
