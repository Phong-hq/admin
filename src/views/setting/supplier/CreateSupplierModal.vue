<template>
  <div @click="quickCreate()">
    <slot></slot>
  </div>
  <a-modal
    v-model:open="open"
    :title="(isEdit ? 'Cập nhập' : 'Tạo') + ' nhà cung cấp'"
    @ok="onFinish"
    :width="800"
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

      <a-form-item class="" label="Mã số thuế" name="tax_code">
        <div class="flex-center gap-4">
          <a-input v-model:value="formState.tax_code" />
        </div>
      </a-form-item>

      <a-form-item
        class=""
        label="Số điện thoại"
        name="phone"
        @input="formState.phone = phoneNumberFormat(formState.phone)"
      >
        <a-input v-model:value="formState.phone" />
      </a-form-item>

      <a-form-item class="" label="Liên hệ" name="contact_id">
        <c-select-search default-data="contact" v-model:value="formState.contact_id" />
      </a-form-item>

      <a-form-item class="" label="Email" name="email">
        <a-input v-model:value="formState.email" />
      </a-form-item>

      <a-form-item class="" label="Địa chỉ 1" name="address_1">
        <a-input v-model:value="formState.address_1" />
      </a-form-item>

      <a-form-item class="" label="Trang web" name="website">
        <a-input v-model:value="formState.website" />
      </a-form-item>

      <a-form-item class="" label="Địa chỉ 2" name="address_2">
        <a-input v-model:value="formState.address_2" />
      </a-form-item>

      <a-form-item class="" label="Phân loại" name="type">
        <c-select :data="OFFICE_TYPE_DATA" v-model:value="formState.type" />
      </a-form-item>

      <a-form-item class="" label="Fax" name="fax">
        <a-input v-model:value="formState.fax" />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Trạng thái" name="status">
        <c-checkbox-number v-model="formState.status" >Kích hoạt</c-checkbox-number>
      </a-form-item>

      <a-form-item class="!col-span-2" label="Ghi chú" name="note">
        <a-input v-model:value="formState.note" />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Mô tả" name="description">
        <a-textarea v-model:value="formState.description" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { SelectConfigItem } from '@/types'
import type { SUPPLIER_RESPONSE } from '@/types/setting/supplier'

// COMPONENT
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

// PINIA
import { useSupplierStore } from '@/stores/setting/supplier'
import { useRootStore } from '@/stores/root'
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import CreateOfficeModal from '@/views/setting/office/CreateOfficeModal.vue'
import { phoneNumberFormat } from '@/utils/form-rule-helper'
import CSelect from '@/components/common/select/CSelect.vue'
import { OFFICE_TYPE_DATA } from '@/constant/setting/office'
import CCheckboxNumber from '@/components/common/checkbox/CCheckboxNumber.vue'

const route = useRoute()
const supplierStore = useSupplierStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()

const { createSupplier, updateSupplier } = supplierStore
const { showLoading, hideLoading } = rootStore

const emits = defineEmits<{
  (e: 'getData'): void
}>()

const rules = computed(() => {
  return {
    name: [{ required: true, trigger: 'blur', message: 'Tên nhà cung cấp để trống!' }],
    office_id: [{ required: true, trigger: 'blur', message: 'Chi nhánh để trống!' }],
    user_id: [{ required: true, trigger: 'blur', message: 'Người dùng để trống!' }]
  }
})
const user_id = computed(() => String(route?.params?.id))

onMounted(() => {
  selectDataStore.getContactList()
})

const open = ref<boolean>(false)
const isQuickCreate = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const formState = reactive({
  id: null as number | null,
  address_1: '',
  address_2: '',
  contact_id: null as number | null,
  description: '',
  email: '',
  fax: '',
  groups: '',
  name: '',
  note: '',
  phone: '',
  status: 0,
  contact: [] as SelectConfigItem[],
  tax_code: '',
  type: '',
  website: ''
})

const fillFormData = (data?: SUPPLIER_RESPONSE) => {
  formState.id = data?.id ?? null
  formState.contact = data?.contact
    ? [
        {
          label: data?.contact?.name,
          value: data?.contact?.id
        }
      ]
    : []
  formState.name = data?.name ?? ''
  formState.contact_id = data?.contact?.id ?? null
  formState.fax = data?.fax ?? ''
  formState.address_1 = data?.address_1 ?? ''
  formState.address_2 = data?.address_2 ?? ''
  formState.description = data?.description ?? ''
  formState.email = data?.email ?? ''
  formState.groups = data?.groups ?? ''
  formState.note = data?.note ?? ''
  formState.phone = data?.phone ?? ''
  formState.status = data?.status ?? 0
  formState.type = data?.type ?? ''
  formState.tax_code = data?.tax_code ?? ''
  formState.website = data?.website ?? ''
}

const onFinish = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    if (isEdit.value) {
      await updateSupplier(formState)
      handle_success('Cập nhập nhà cung cấp thành công!')
    } else {
      await createSupplier(formState)
      handle_success('Tạo nhà cung cấp thành công!')
    }
    // if (isQuickCreate.value) await selectDataStore.getSupplierList(true)
    emits('getData')
    open.value = false
  } catch (e) {
    handle_error(e, isEdit.value ? 'Cập nhập nhà cung cấp thất bại!' : 'Tạo nhà cung cấp thất bại!')
  }
  loading.value = false
}

const showModal = (supplier?: SUPPLIER_RESPONSE) => {
  if (supplier) {
    isEdit.value = true
  }
  fillFormData(supplier)
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
}

defineExpose({ showModal })
</script>

<style lang="scss"></style>
