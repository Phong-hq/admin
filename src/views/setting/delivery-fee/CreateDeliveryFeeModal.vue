<template>
  <div @click="quickCreate()">
    <slot></slot>
  </div>
  <a-modal
    v-model:open="open"
    :title="(isEdit ? 'Cập nhập' : 'Tạo') + ' phí vận chuyển'"
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
      class=""
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

      <a-form-item class="" label="Giá tuỳ chỉnh" name="price" @input="formState.price = currencyInput(formState.price)">
        <a-input class="!w-full" v-model:value="formState.price" />
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
import { useDeliveryFeeStore } from '@/stores/setting/delivery-fee'
import { useRootStore } from '@/stores/root'
import { useSelectDataStore } from '@/stores/select_data'
//UTILS
import { isValidEmail, phoneNumberFormat } from '@/utils/form-rule-helper'
import { handle_error, handle_success } from '@/utils/message'
import type { SelectConfigItem } from '@/types'
import type { DELIVERY_FEE_RESPONSE } from '@/types/setting/delivery-fee'
import { currencyInput, currencyNumber } from '@/utils/currency'

const route = useRoute()
const deliveryFeeStore = useDeliveryFeeStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()

const { createDeliveryFee, updateDeliveryFee } = deliveryFeeStore
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
    name: [{ required: true, trigger: 'blur', message: 'Tên phí vận chuyển để trống!' }],
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
  name: '',
  price: '',
  status: 0,
})

const fillFormData = (data?: DELIVERY_FEE_RESPONSE) => {
  formState.id = data?.id ?? null
  formState.status = data?.status ?? 0
  formState.name = data?.name ?? ''
  formState.price = currencyInput(formState.price) ?? ''
}

const onFinish = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    
    let form  = {...formState, price: currencyNumber(formState.price)}
    
    if (isEdit.value) {
      await updateDeliveryFee(form)
      handle_success('Cập nhập phí vận chuyển thành công!')
    } else {
      await createDeliveryFee(form)
      handle_success('Tạo phí vận chuyển thành công!')
    }
    emits('getData')
    open.value = false
  } catch (e) {
    handle_error(e, isEdit.value ? 'Cập nhập phí vận chuyển thất bại!' : 'Tạo phí vận chuyển thất bại!')
  }
  loading.value = false
}

const showModal = (deliveryFee?: DELIVERY_FEE_RESPONSE) => {
  if (deliveryFee) {
    isEdit.value = true
  }
    fillFormData(deliveryFee)
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
