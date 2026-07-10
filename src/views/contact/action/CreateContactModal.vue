<template>
  <div @click="quickCreate()">
    <slot></slot>
  </div>
  <a-modal
    v-model:open="open"
    :title="(isEdit ? 'Cập nhập' : 'Tạo') + ' liên hệ'"
    @ok="handleOk"
    :width="800"
    :after-close="handleAfterClose"
  >
    <template #footer>
      <div class="flex justify-end gap-2">
        <a-button @click="hide">Hủy</a-button>
        <a-button type="primary" @click="handleOk" :loading="loading">{{
          isEdit ? 'Cập nhập' : 'Tạo'
        }}</a-button>
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
    >
      <a-form-item class="" label="Tên:" name="last_name">
        <a-input v-model:value="formState.last_name" />
      </a-form-item>

      <a-form-item class="" label="Địa chỉ 1:" name="address_1">
        <a-input v-model:value="formState.address_1" />
      </a-form-item>

      <a-form-item class="" label="Họ:" name="first_name">
        <a-input v-model:value="formState.first_name" />
      </a-form-item>

      <a-form-item class="" label="Địa chỉ 2:" name="address_2">
        <a-input v-model:value="formState.address_2" />
      </a-form-item>

      <a-form-item
        class=""
        label="Số điện thoại:"
        name="phone"
        @input="formState.phone = phoneNumberFormat(formState.phone)"
      >
        <a-input v-model:value="formState.phone" />
      </a-form-item>

      <a-form-item class="" label="Email:" name="email">
        <a-input v-model:value="formState.email" />
      </a-form-item>

      <a-form-item class="" label="Mã bưu điện:" name="office_code">
        <a-input v-model:value="formState.office_code" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import type { CONTACT_RESPONSE } from '@/types/customer/contact'

// COMPONENT

// PINIA
import { useSelectDataStore } from '@/stores/select_data'
import { useContactStore } from '@/stores/contact'

//UTILS
import { isValidEmail, phoneNumberFormat } from '@/utils/form-rule-helper'
import { handle_error, handle_success } from '@/utils/message'

const emits = defineEmits<{
  (e: 'getData'): void
}>()

const selectDataStore = useSelectDataStore()
const contactStore = useContactStore()

const rules = {
  address_1: [{ required: true, message: 'Địa chỉ bỏ trống!', trigger: 'blur' }],
  first_name: [{ required: true, message: 'Họ bỏ trống!', trigger: 'blur' }],
  last_name: [{ required: true, message: 'Tên bỏ trống!', trigger: 'blur' }],
  phone: [{ required: true, message: 'Số điện thoại bỏ trống!', trigger: 'blur' }],
  email: [{ required: true, message: 'Email bỏ trống!', trigger: 'blur' }]
}

const formState = reactive({
  id: null as number | null,
  address_1: '',
  address_2: '',
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  office_code: '',
  time_zone: ''
})

onMounted(async () => {})

const open = ref<boolean>(false)
const isQuickCreate = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)

const handleOk = async (e: MouseEvent) => {
  try {
    await formRef.value?.validate()
    loading.value = true
    if (isEdit.value) {
      await contactStore.updateContact(formState)
      handle_success('Cập nhập liên hệ thành công')
    } else {
      await contactStore.createContact(formState)
      handle_success('Tạo mới liên hệ thành công')
    }
    if(isQuickCreate.value)  await selectDataStore.getContactList(true)
    emits('getData')
    open.value = false
  } catch (e) {
    handle_error(e, isEdit.value ? 'Cập nhập liên hệ thất bại!' : 'Tạo mới liên hệ thất bại!')
  }
  loading.value = false
}

const hide = () => {
  open.value = false
}

const showModal = (contact?: CONTACT_RESPONSE) => {
  if (contact) {
    isEdit.value = true
  }
  formState.id = contact?.id ?? null
  formState.email = contact?.email ?? ''
  formState.address_1 = contact?.address_1 ?? ''
  formState.address_2 = contact?.address_2 ?? ''
  formState.first_name = contact?.first_name ?? ''
  formState.last_name = contact?.last_name ?? ''
  formState.phone = contact?.phone ?? ''
  formState.office_code = ''
  formState.time_zone = ''
  open.value = true
}

const handleAfterClose = () => {
  formRef.value?.clearValidate()
  isEdit.value = false
  isQuickCreate.value = false
  loading.value = false
}

const quickCreate = () => {
  showModal()
  isQuickCreate.value = true
}

defineExpose({ showModal })
</script>

<style lang="scss"></style>
