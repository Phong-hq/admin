<template>
  <a-modal
    v-model:open="open"
    title="Thay đổi địa chỉ"
    @ok="handleOk"
    :after-close="handleAfterClose"
    :okButtonProps="{
      loading: loading
    }"
  >
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
    >
      <a-form-item class="!col-span-1" label="Tên địa chỉ" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item class="!col-span-1" label="Số điện thoại" name="phone" @input="formState.phone = phoneNumberFormat(formState.phone)" >
        <a-input v-model:value="formState.phone" />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Địa chỉ" name="address">
        <a-input v-model:value="formState.address" />
      </a-form-item>

      <a-button class="!opacity-0 !absolute" html-type="submit"></a-button>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { RECEIPT_DISCOUNT_TYPE } from '@/constant/receipt'

// COMPONENT
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

// PINIA
import { useSelectDataStore } from '@/stores/select_data'
import { useProductStore } from '@/stores/product'

//UTILS
import { phoneNumberFormat } from '@/utils/form-rule-helper'
import { currencyInput, currencyNumber } from '@/utils/currency'


const selectDataStore = useSelectDataStore()
const productStore = useProductStore()

const { getVariant } = productStore

type FORM = {
  name: string
  phone: string
  address: string
}

const rules = {
  name: [{ required: true, message: 'Tên địa chỉ bỏ trống!', trigger: 'blur' }],
  phone: [{ required: true, message: 'Số điện thoại bỏ trống!', trigger: 'blur' }],
  address: [{ required: true, message: 'Địa chỉ bỏ trống!', trigger: 'blur' }]
}

const formState = reactive<FORM>({
  name: '',
  phone: '',
  address: ''
})

onMounted(() => {
})

const open = ref(false)
const formRef = ref<any>(null)
const handleResole = ref<any>(null)
const handleReject = ref<any>(null)
const isSubmit = ref(false)
const loading = ref(false)

const editAddress = (product?: any) => {
  formState.name = product?.name ?? ''
  formState.phone = product?.phone ?? ''
  formState.address = product?.address ?? ''

  open.value = true
  return new Promise<FORM>( (resolve, reject) => {
    handleResole.value = (data: FORM) => {
      resolve(data)
      isSubmit.value = true
      open.value = false
    }
    handleReject.value = () => {
      reject()
      open.value = false
    }
  })
}
const handleOk = async () => {
  formRef.value?.validate()
  let data = {
    ...formState
  }
  if (handleResole.value) handleResole.value(data)
}

const handleAfterClose = () => {
  if (!isSubmit.value && handleReject.value) {
    handleReject.value()
  }
  isSubmit.value = false
  handleReject.value = null
  handleResole.value = null
}

defineExpose({ editAddress })
</script>

<style lang="scss"></style>
