<template>
  <a-button class="!text-blue !border-blue" type="primary" ghost @click="handleOpen"
    >Quản lí sản phẩm
    <a-modal
      class="!w-[90%] !max-w-[1600px]"
      v-model:open="open"
      title="Quản lí sản phẩm"
      :body-style="{ padding: '16px' }"
      @ok="handleOk"
    >
      <p class="sub-heading italic">
        Các sản phẩm được tự động tạo khi bạn thêm thuộc tính cho sản phẩm
      </p>
      <div class="w-full overflow-auto rounded-md" style="box-shadow: rgb(51 51 51 / 50%) 0px 0px 5px;">
        <div class="grid grid-cols-[80px_auto_200px_150px_150px_160px_160px] min-w-[1300px] py-4 gap-3 bg-[#f8f8f8]">
          <p class="font-bold pl-2">Sử dụng</p>
          <p class="font-bold pl-2">Hình ảnh</p>
          <p class="font-bold pl-2">Tên</p>
          <p class="font-bold pl-2">Sku</p>
          <p class="font-bold pl-2">Mã vạch</p>
          <p class="font-bold pl-2">Đơn giá</p>
          <p class="font-bold pl-2">Giá sỉ</p>
        </div>
        <a-divider class="!mt-0 !min-w-[1300px]"></a-divider>
        <template v-for="(formState, index) in cloneData" :key="formState.key">
          <a-form
            :model="formState"
            class="!grid grid-cols-[80px_auto_200px_150px_150px_160px_160px] min-w-[1300px]"
            ref="formRef"
            name="basic"
            :label-col="{ span: 24 }"
            :wrapper-col="{ span: 24 }"
            :rules="rules"
            labelWrap
            autocomplete="off"
          >
            <a-form-item class="flex justify-center" label="" name="isUse">
              <a-checkbox v-model:checked="formState.isUse" size="large"></a-checkbox>
            </a-form-item>
            <a-form-item class="!w-full overflow-hidden" label="" name="images">
              <c-image
                class="flex-center"
                list-type="picture-card"
                type="multiple"
                v-model="formState.images"
                size="small"
              ></c-image>
            </a-form-item>
            <a-form-item class="" label="" name="name">
              {{ formState.name }}
            </a-form-item>
            <a-form-item class="" label="" name="sku">
              <a-input v-model:value="formState.sku" size="large" />
            </a-form-item>
            <a-form-item class="" label="" name="barcode">
              <a-input v-model:value="formState.barcode" size="large" />
            </a-form-item>
            <a-form-item class="" label="" name="unit_price">
              <!-- <a-input v-model:value="formState.unit_price" /> -->
              <a-input
                v-model:value="formState.unit_price"
                @input="handleCurrencyInput(index, 'unit_price')"
                size="large"
              ></a-input>
            </a-form-item>
            <a-form-item class="" label="" name="sll_price">
              <a-input
                v-model:value="formState.sll_price"
                @input="handleCurrencyInput(index, 'sll_price')"
                size="large"
              ></a-input>
              <!-- <a-input v-model:value="formState.sll_price" /> -->
            </a-form-item>
          </a-form>
          <a-divider class="!mt-0 !min-w-[1300px]"></a-divider>
        </template>
      </div>
    </a-modal>
  </a-button>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import { clone } from '@/utils/clone'

//COMPONENTS
import CTable from '@/components/common/table/CTable.vue'
import CImage from '@/components/common/upload/CImage.vue'
import { currencyInput } from '@/utils/currency'
//PINIA

type Props = {
  modelValue: any
  name: string
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'update:modelValue', id: any): void
  (e: 'submit', data: any): void
}>()

const checkDuplicateSku = (rule: string, value: string, call: any) => {
  const length = cloneData.value.filter((e: any) => e.sku == value)?.length
  if (length > 1 && value) {
    return Promise.reject('Mã SKU bị trùng!!')
  }
  return Promise.resolve()
}

const checkDuplicateBar = (rule: string, value: string, call: any) => {
  const length = cloneData.value.filter((e: any) => e.barcode == value)?.length
  if (length > 1 && value) {
    return Promise.reject('Mã SKU bị trùng!!')
  }
  return Promise.resolve()
}

const rules = {
  sku: [
    { required: true, message: 'Sku bỏ trống!', trigger: 'blur' },
    { validator: checkDuplicateSku, trigger: 'blur', message: 'Sku bị trùng!!' }
  ],
  barcode: [{ validator: checkDuplicateBar, trigger: 'blur', message: 'Bar code bị trùng!!' }]
}

const cloneData = ref<any>([])

const columns = [
  { title: 'Sử dụng', key: 'isUse', align: 'center', noResizable: true, width: 80 },
  { title: 'Hình ảnh', key: 'images', align: 'center' },
  {
    title: 'Tên mẫu mã sản phẩm',
    key: 'name',
    width: 200
  },
  { title: 'Mã SKU', key: 'sku', width: 150 },
  { title: 'Mã vạch	', key: 'barcode', width: 150 },
  { title: 'Đơn giá', key: 'unit_price', align: 'left', width: 150 },
  { title: 'Giá sỉ', key: 'sll_price', align: 'left', width: 150 }
] as COLUMN_TYPE[]

const result = computed<any>({
  set(value: any) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const open = ref(false)
const formRef = ref<any>([]) // Mảng ref
const handleOpen = () => {
  const length = formRef.value?.length
  if (length) {
    for (let i = 0; i < length; i++) {
      formRef.value[i]?.clearValidate()
    }
  }
  cloneData.value = clone(result.value)
  open.value = true
}

const handleCurrencyInput = (index: number, key: 'unit_price' | 'sll_price') => {
  cloneData.value[index][key] = currencyInput(cloneData.value[index][key])
}

const handleOk = async () => {
  const length = formRef.value?.length
  if (length) {
    for (let i = 0; i < length; i++) {
      await formRef.value[i]?.validate()
    }
  }
  emits('submit', cloneData.value)
  open.value = false
}
</script>
