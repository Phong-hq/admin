<template>
  <div @click="quickCreate()">
    <slot></slot>
  </div>
  <a-modal
    v-model:open="open"
    :title="(isEdit ? 'Cập nhập' : 'Tạo') + ' chi nhánh'"
    @ok="onFinish"
    :width="1000"
    :after-close="handleAfterClose"
  >
    <template #footer>
      <div class="flex justify-end gap-2">
        <a-button @click="open = false">Hủy</a-button>
        <a-button type="primary" @click="onFinish" :loading="loading">Tạo</a-button>
      </div>
    </template>
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
      @finish="onFinish"
      @keyEnter="onFinish"
    >
      <a-form-item class="" label="Tên" name="name">
        <a-input class="!w-full" v-model:value="formState.name" />
      </a-form-item>

      <a-form-item class="" label="Địa chỉ 1" name="address1">
        <a-input class="!w-full" v-model:value="formState.address1" />
      </a-form-item>

      <a-form-item class="" label="Email" name="email">
        <a-input class="!w-full" v-model:value="formState.email" />
      </a-form-item>

      <a-form-item class="" label="Địa chỉ 2" name="address2">
        <a-input class="!w-full" v-model:value="formState.address2" />
      </a-form-item>

      <a-form-item class="" label="Phân loại" name="type">
        <c-select class="!w-full" :data="OFFICE_TYPE_DATA" v-model:value="formState.type" />
      </a-form-item>

      <div class="grid grid-cols-2  gap-4">
      <a-form-item class="" label="Tỉnh/Thành phố" name="province_code">
        <c-select-search class="" default-data="province" v-model:value="formState.province_code" />
      </a-form-item>

        <a-form-item class="" label="Quận/Huyện" name="district_code">
          <c-select-search class="" :search="selectDataStore.searchDistrictList" :params="{province_code: formState.province_code}" default-data="" v-model:value="formState.district_code" />
        </a-form-item>
      </div>

<!--      <a-form-item class="" label="Điện thoại công ty" name="phone" @input="formState.phone = phoneNumberFormat(formState.phone)">-->
<!--        <a-input class="!w-full" v-model:value="formState.phone" />-->
<!--      </a-form-item>-->

      <a-form-item class="" label="Liên hệ" name="contact_person_id">
        <div class="flex-center gap-2">
          <c-select-search class="grow"  default-data="contact" :extra-data="formState.contact_person" v-model:value="formState.contact_person_id" />
          <create-contact-modal><create-button></create-button></create-contact-modal>
        </div>
      </a-form-item>

      <a-form-item class="" label="Khu vực" name="ward_code">
        <c-select-search class="" :search="selectDataStore.searchWardList" :params="{district_code: formState.district_code}" default-data="" v-model:value="formState.ward_code" />
      </a-form-item>

      <a-form-item class="" label="Trạng thái" name="status">
        <c-checkbox-number v-model="formState.status">Kích hoạt</c-checkbox-number>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'

// COMPONENT
import CSelect from '@/components/common/select/CSelect.vue'
import CCheckboxNumber from '@/components/common/checkbox/CCheckboxNumber.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import CreateContactModal from '@/views/contact/action/CreateContactModal.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

// PINIA
import { useOfficeStore } from '@/stores/setting/office'
import { useRootStore } from '@/stores/root'
import { useSelectDataStore } from '@/stores/select_data'
//UTILS
import { isValidEmail, phoneNumberFormat } from '@/utils/form-rule-helper'
import { handle_error, handle_success } from '@/utils/message'
import type { SelectConfigItem } from '@/types'
import type { OFFICE_RESPONSE } from '@/types/setting/office'
import { OFFICE_TYPE_DATA } from '@/constant/setting/office'

const route = useRoute()
const officeStore = useOfficeStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()

const { createOffice, updateOffice } = officeStore
const { showLoading, hideLoading } = rootStore

const emits = defineEmits<{
  (e: 'getData'): void
}>()


const rules = computed(() => {
  return {
    email: [
      { validator: isValidEmail, trigger: 'blur', message: 'Email không hợp lệ!' },
      {
        required: true,
        trigger: 'blur',
        message: 'Email để trống!'
      }
    ],
    name: [{ required: true, trigger: 'blur', message: 'Tên chi nhánh để trống!' }],
    address1: [{ required: true, trigger: 'blur', message: 'Địa chỉ để trống!' }],
    contact_person_id: [{ required: true, trigger: 'blur', message: 'Liên hệ để trống!' }],
    district_code: [{ required: true, trigger: 'blur', message: 'Tỉnh/Thành phố để trống!' }],
    province_code: [{ required: true, trigger: 'blur', message: 'Quận/Huyện để trống!' }],
    ward_code: [{ required: true, trigger: 'blur', message: 'Khu vực để trống!' }],
  }
})
const user_id = computed(() => String(route?.params?.id))

onMounted(() => {
  selectDataStore.getProvinceList()
  selectDataStore.getContactList()
})

const open = ref<boolean>(false)
const isQuickCreate = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const formState = reactive({
  id: null as number | null,
  email: '',
  address1: '',
  address2: '',
  contact_person_id: null as number | null,
  contact_person: [] as SelectConfigItem[],
  district_code: '',
  name: '',
  phone: '',
  province_code: '',
  status: 0,
  type: '',
  ward_code: ''
})

const fillFormData = (data?: OFFICE_RESPONSE) => {
  formState.id = data?.id ?? null
  formState.status = data?.status ?? 0
  formState.address1 = data?.address_1 ?? ''
  formState.contact_person_id = data?.contact_person?.id ?? null
  formState.contact_person = data?.contact_person
    ? [
        {
          label: data?.contact_person?.name,
          value: data?.contact_person?.id
        }
      ]
    : []
  formState.name = data?.name ?? ''
  formState.email = data?.email ?? ''
  formState.address2 = data?.address_2 ?? ''
  formState.district_code = data?.district_code ?? ''
  formState.province_code = data?.province_code ?? ''
  formState.phone = data?.phone ?? ''
  formState.type = data?.type ?? ''
  formState.ward_code = data?.ward_code ?? ''
}

const onFinish = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    if (isEdit.value) {
      await updateOffice(formState)
      handle_success('Cập nhập chi nhánh thành công!')
    } else {
      await createOffice(formState)
      handle_success('Tạo chi nhánh thành công!')
    }
    if(isQuickCreate.value) await selectDataStore.getOfficeList(true)
    emits('getData')
    open.value = false
  } catch (e) {
    handle_error(e, isEdit.value ? 'Cập nhập chi nhánh thất bại!' : 'Tạo chi nhánh thất bại!')
  }
  loading.value = false
}

const showModal = (office?: OFFICE_RESPONSE) => {
  if (office) {
    isEdit.value = true
  }
    fillFormData(office)
  open.value = true
}

const handleAfterClose = () => {
  formRef.value?.clearValidate()
  isEdit.value = false
  isQuickCreate.value = false
}

const quickCreate = () => {
  showModal()
  isQuickCreate.value = true
  formState.status = 1
}

defineExpose({ showModal })
</script>

<style lang="scss"></style>
