<template>
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
  >
    <a-form-item class="" label="Tên:" name="name">
      <a-input v-model:value="formState.name" />
    </a-form-item>

    <a-form-item class="" label="Mã bưu điện:" name="code">
      <a-input v-model:value="formState.postal_code" />
    </a-form-item>

    <a-form-item
      class=""
      label="Số điện thoại:"
      name="phone"
      @input="formState.phone = phoneNumberFormat(formState.phone)"
    >
      <a-input v-model:value="formState.phone" />
    </a-form-item>

    <div class="grid grid-cols-2 gap-2">
      <a-form-item class="" label="Tỉnh/Thành phố:" name="province_code">
        <!--          <a-input v-model:value="formState.province_code" />-->
        <c-select-search v-model:value="formState.province_code" default-data="province" />
      </a-form-item>

      <a-form-item class="" label="Quận/Huyện:" name="district_code">
        <c-select-search
          v-model:value="formState.district_code"
          default-data=""
          :search="selectDataStore.searchDistrictList"
          :params="{ province_code: formState.province_code }"
        />
      </a-form-item>
    </div>

    <a-form-item class="" label="Email:" name="email">
      <a-input v-model:value="formState.email" />
    </a-form-item>

    <a-form-item class="" label="Khu vực:" name="ward_code">
      <c-select-search
        v-model:value="formState.ward_code"
        default-data=""
        :search="selectDataStore.searchWardList"
        :params="{ district_code: formState.district_code }"
      />
    </a-form-item>

    <a-form-item class="" label="Trang web:" name="website">
      <a-input v-model:value="formState.website" />
    </a-form-item>

    <a-form-item class="" label="Địa chỉ 1:" name="address_1">
      <a-input v-model:value="formState.address_1" />
    </a-form-item>

    <a-form-item class="" label="Phân loại:" name="type">
      <a-input v-model:value="formState.type" />
    </a-form-item>

    <a-form-item class="" label="Địa chỉ 2:" name="address_2">
      <a-input v-model:value="formState.address_2" />
    </a-form-item>

    <a-form-item class="!col-span-2" label="Ghi chú" name="note">
      <a-input v-model:value="formState.note" />
    </a-form-item>

    <a-form-item class="!col-span-2" label="" name="status">
      <a-checkbox v-model:checked="formState.status">Kích hoạt</a-checkbox>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import type { SelectConfigItem } from '@/types'

// COMPONENT
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'
import { useCustomerStore } from '@/stores/customer'

//UTILS
import { isValidEmail, phoneNumberFormat } from '@/utils/form-rule-helper'
import { handle_error, handle_success } from '@/utils/message'
import type { CUSTOMER_RESPONSE } from '@/types/customer/customer'

type FORM = {
  id: null | number
  address_1: string
  address_2: string
  district_code: string
  email: string
  group: string
  name: string
  note: string
  phone: string
  postal_code: string
  time_zone: string
  province_code: string
  ward_code: string
  website: string
  type: string
  status: boolean
}

type Props = {
  modelValue: any
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'update:modelValue', id: any): void
}>()

const formState = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})

const selectDataStore = useSelectDataStore()
const customerStore = useCustomerStore()

const rules = {
  name: [{ required: true, message: 'Tên bỏ trống!', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email bỏ trống!', trigger: 'blur' },
    {
      validator: isValidEmail,
      trigger: 'change'
    }
  ],
  province_code: [{ required: true, message: 'Tỉnh thành bỏ trống!', trigger: 'blur' }],
  district_code: [{ required: true, message: 'Quận huyện bỏ trống!', trigger: 'blur' }],
  ward_code: [{ required: true, message: 'Khu vực bỏ trống!', trigger: 'blur' }],
  address_1: [{ required: true, message: 'Địa chỉ bỏ trống!', trigger: 'blur' }],
  phone: [{ required: true, message: 'Số điện thoại chỉ bỏ trống!', trigger: 'blur' }]
}

onMounted(async () => {
  selectDataStore.getProvinceList()
})

const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)

const fillFormData = (e?: CUSTOMER_RESPONSE) => {
  formRef.value?.clearValidate()
  formState.value.address_1 = e?.address_1 ?? ''
  formState.value.address_2 = e?.address_1 ?? ''
  formState.value.district_code = e?.address_1 ?? ''
  formState.value.email = e?.address_1 ?? ''
  formState.value.group = e?.address_1 ?? ''
  formState.value.name = e?.address_1 ?? ''
  formState.value.note = e?.address_1 ?? ''
  formState.value.phone = e?.address_1 ?? ''
  formState.value.postal_code = e?.address_1 ?? ''
  formState.value.time_zone = e?.address_1 ?? ''
  formState.value.province_code = e?.address_1 ?? ''
  formState.value.ward_code = e?.address_1 ?? ''
  formState.value.website = e?.address_1 ?? ''
  formState.value.type = e?.type ?? ''
  formState.value.status = e ? e?.status == 1 : true
}

const validate = async () => {
  return await formRef.value?.validate()
}

defineExpose({ fillFormData, validate })
</script>

<style lang="scss"></style>
