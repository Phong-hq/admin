<template>
  <div>
    <a-divider class="!my-0"></a-divider>
    <div class="" v-for="(item, i) in optionData" :key="i" @click="showEditOptionModal(item.key)">
      <div class="grid grid-cols-[80px_auto_20px] hover:bg-item_hover cursor-pointer gap-7 px-4 py-4">
        <div class="flex items-center">
          <p>{{ item.name }}</p>
        </div>
        <div>
          <a-tag class="!text-base" :bordered="false" v-for="tag in item.values" :key="tag">{{ tag.value }}
          </a-tag>
        </div>
        <a-dropdown>
          <div class="flex-center sc-full cursor-pointer">
            <small-dash-outlined class="text-lg" />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item class="h-10">
                <a-space>
                  <edit-outlined />
                  <p @click="showEditOptionModal(item.key)">Chỉnh sửa</p>
                </a-space>
              </a-menu-item>

              <a-menu-item class="h-10">
                <a-space>
                  <delete-outlined />
                  <p @click="handleRemoveOptionItem(item.key)">Xóa</p>
                </a-space>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <a-divider class="!my-0"></a-divider>
    </div>
    <p class="text-blue cursor-pointer mt-4" @click="showEditOptionModal()">+ Thêm thuộc tính</p>
    <div class="flex flex-wrap md:justify-between justify-end md:gap-7 gap-5 md:mt-7 mt-5" v-if="optionData.length || result.length">
      <variants-total-info :data="managerResult" />
      <variants-total-manager v-model="managerResult" :name="productName" @submit="handleSubmitManagerVariants" />
    </div>
    <a-modal
      class="duration-300"
      v-model:open="infoModal"
      :title="activeKey != null ? 'Chỉnh sửa thông tin' : 'Thêm thông tin'"
      :width="showSelectionAdditionalInput ? 700 : 500"
      @ok="handleModalConfirm"
      :bodyStyle="{ padding: '16px' }"
      :after-close="handleAdditionalModalClose"
    >
      <a-checkbox class="!mb-7" v-model:checked="showSelectionAdditionalInput">
        <p>Thêm giá trị bổ sung cho các lựa chọn (dev only)</p>
      </a-checkbox>
      <a-form :model="optionState" :class="showSelectionAdditionalInput ? 'form-2' : ''" ref="optionFormRef"
        name="basic" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" :rules="rules" labelWrap autocomplete="off"
        @finish="handleModalConfirm">
        <a-form-item class="!col-span-2" label="thuộc tính:" name="name">
          <a-input class="!w-full" v-model:value="optionState.name" placeholder="VD:Size,màu,..." />
        </a-form-item>
        <template v-for="(item, i) in optionState.values" :key="i">
          <a-form-item class="!duration-[1s]" :label="i == 0 ? 'Các lựa chọn:' : ''" :name="`slug-${i}`">
            <div class="flex-col gap-4">
              <div class="flex item-center gap-4">
                <a-input class="grow duration-[1s]" v-model:value="optionState.values[i].value"
                  placeholder="VD:Đỏ,S,Lớn,..." />
                <a-button class="shrink-0" :disabled="optionState.values.length <= 1"
                  @click="handleRemoveSelectionItem(i)" v-if="!showSelectionAdditionalInput">
                  <template #icon>
                    <delete-outlined />
                  </template>
                </a-button>
              </div>
            </div>
          </a-form-item>
          <a-form-item class="" :label="i == 0 ? 'Bổ sung:' : ''" :name="`additional_data`"
            v-if="showSelectionAdditionalInput">
            <div class="flex-col gap-4">
              <div class="flex item-center gap-4">
                <a-input class="grow" v-model:value="optionState.values[i].additional_data" placeholder="" />
                <a-button class="shrink-0" :disabled="optionState.values.length <= 1"
                  @click="handleRemoveSelectionItem(i)">
                  <template #icon>
                    <delete-outlined />
                  </template>
                </a-button>
              </div>
            </div>
          </a-form-item>
        </template>
        <p class="text-blue cursor-pointer !col-span-2"
          @click="optionState.values.push({ value: '', additional_data: '', slug: '' })">
          + Thêm lựa chọn
        </p>
        <a-button class="opacity-[0]" type="primary" html-type="submit"></a-button>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { EditOutlined, DeleteOutlined, SmallDashOutlined } from '@ant-design/icons-vue'
import { formatSlug, getRandomDigits } from '@/utils/string-helper'
import { clone } from '@/utils/clone'
import type { PRODUCT_VARIANTS_RESPONSE, OPTION, OPTION_ITEM } from '@/types/product/product'

//COMPONENTS
import CEditor from '@/components/common/editor/CEditor.vue'
import VariantsTotalInfo from './VariantsTotalInfo.vue'
import VariantsTotalManager from './VariantsTotalManager.vue'
import { currencyInput, currencyNumber } from '@/utils/currency'

//PINIA
import { useRootStore } from '@/stores/root'

type VARIANTS_FORM = {
  id: number | undefined
  barcode: string
  sku: string
  name: string
  sll_price: string
  unit_price: string
  images: string[]
  selection: string
  isUse: boolean
  skuIndex: number
}

type Props = {
  modelValue: VARIANTS_FORM[]
  productName: string
  isEdit?: boolean
  sllPrice: number
  unitPrice: number
  sku: string
  barCode: string
  images: string[]
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'update:modelValue', id: VARIANTS_FORM[]): void
}>()

const rootStore = useRootStore()

// const result = computed<VARIANTS_FORM[]>({
//   set(value: VARIANTS_FORM[]) {
//     emits('update:modelValue', value)
//   },
//   get() {
//     return props.modelValue
//   }
// })

const result = ref<VARIANTS_FORM[]>([])

const checkDuplicateSelection = (rule: any, value: string, call: any) => {
  const index = rule?.field?.split('-')[1]
  if (!index) return Promise.resolve()
  const currentValue = optionState.values[index].value

  const hasDuplicate =
    optionState.values.filter((e) => formatSlug(e.value) === formatSlug(currentValue)).length > 1
  if (hasDuplicate) {
    return Promise.reject('Lựa chọn phải là duy nhất!!')
  }
  return Promise.resolve()
}

const checkDuplicateKey = (rule: string, value: string, call: any) => {
  if (
    optionData.value.length &&
    optionData.value.some((e: any) => formatSlug(e.title) == e.title(value) && activeKey.value != value)
  ) {
    return Promise.reject('Tiều đề bị trùng!!')
  }
  return Promise.resolve()
}

const rules = computed(() => {
  let result = {
    name: [
      { required: true, message: 'thuộc tính bỏ trống!', trigger: 'blur' },
      { validator: checkDuplicateKey, trigger: 'blur', message: 'Tiều đề bị trùng!!' }
    ]
  } as any

  optionState.values.forEach((e, i) => {
    result[`slug-${i}`] = [
      {
        validator: checkDuplicateSelection,
        trigger: 'blur',
        message: 'Lựa chọn phải là duy nhất!!'
      }
    ]
  })
  return result
})

const optionState = reactive<OPTION>({
  name: '',
  key: '',
  values: [] as OPTION_ITEM[]
})

const infoModal = ref<any>(false)
const activeKey = ref<string | null>(null)
const optionData = ref<OPTION[]>([])
const optionFormRef = ref<any>(null)
const managerResult = ref<any>([])
const showSelectionAdditionalInput = ref(false)
const skuIndex = ref(0)

const showEditOptionModal = async (key?: string) => {
  activeKey.value = key || null
  showSelectionAdditionalInput.value = false
  optionState.name = ''
  optionState.key = ''
  optionState.values = [{ value: '', additional_data: '', slug: '' }]
  if (key) {
    const item = optionData.value.find((e: any) => e.key === key)
    const cloneItem = clone(item)

    optionState.name = cloneItem?.name || ''
    optionState.values = cloneItem?.values || [{ value: '', additional_data: '', slug: '' }]
    optionState.key = formatSlug(optionState.name)
  }
  infoModal.value = true
}

const handleRemoveOptionItem = async (key: string) => {
  const index = optionData.value.findIndex((e: any) => e.key === key)

  if (index > -1) {
    await rootStore.confirm({
      bodyTitle: 'Xóa thuộc tính',
      bodyMessage: `Bạn có chắc chắn xóa thuộc tính <strong>${optionData.value[index].name}</strong>!`,
      confirmButtonText: 'Có',
      cancelButtonText: 'không'
    })
    optionData.value.splice(index, 1)
    updateVariantsData()
  }
}

const handleRemoveSelectionItem = (i: number) => {
  if (i > -1) {
    optionState.values.splice(i, 1)
  }
}

const handleModalConfirm = async () => {
  await optionFormRef.value?.validate()

  //CLEAR EMPTY SELECTION
  optionState.values = optionState.values.filter((e) => e.value != '')

  if (activeKey.value != null) {
    const index = optionData.value.findIndex((e: any) => e.key === activeKey.value)
    if (index > -1) {
      optionData.value[index] = {
        ...getObjectWithKeyValue(optionState, 'key', 'name'),
        values: [...optionState.values.map((e) => getObjectWithKeyValue(e, 'slug', 'value'))]
      }
    }
  } else {
    optionData.value.push({
      ...getObjectWithKeyValue(optionState, 'key', 'name'),
      values: [...optionState.values.map((e) => getObjectWithKeyValue(e, 'slug', 'value'))]
    })
  }
  updateVariantsData()
  infoModal.value = false
}

const handleAdditionalModalClose = () => {
  activeKey.value = null
  optionFormRef.value?.clearValidate()
}

const updateVariantsData = () => {
  let variants_result = [] as string[]
  for (let i = 0; i < optionData.value.length; i++) {
    const option = optionData.value[i]
    let variants = [] as string[]
    for (let j = 0; j < option.values.length; j++) {
      const selection = option.values[j]
      if (i == 0) {
        variants.push(selection.slug)
      } else {
        variants_result.forEach((variant) => {
          result.value = [...managerResult.value]
          let item: any = variant.split(',')
          item.push(selection.slug)
          item = item.toString()
          variants.push(item)
        })
      }
    }
    variants_result = [...variants]
  }
  addOrRemoveVariantsData(variants_result)
}

const addOrRemoveVariantsData = (data: string[]) => {
  const cloneResult = clone(result.value) as VARIANTS_FORM[]
  result.value = []
  for (let i = 0; i < data.length; i++) {
    const item = cloneResult.find((resultItem: VARIANTS_FORM) => resultItem.selection == data[i])
    if (item) result.value.push(item)
    else {
      result.value.push(getDefaultVariantWithSelection(data[i]))
      skuIndex.value++
    }
  }
  managerResult.value = clone(result.value)
}

const handleSubmitManagerVariants = (data: any) => {
  result.value = clone(data)
  managerResult.value = clone(data)
}

const getVariantsData = () => {
  console.log(result.value, 'result.value')
  const data = result.value
    .filter((e) => e.isUse)
    .map((e) => {
      const keyValueData = e.selection?.split(',')
      const meta_field = keyValueData?.map((key: string, i: number) => {
        return {
          key: optionData.value[i]?.key || '',
          name: optionData.value[i]?.name || '',
          value: getSelection(i, key)?.value,
          slug: key,
          additional_data: getSelection(i, key)?.additional_data,
        }
      })
      return {
        ...e,
        name: getDefaultVariantWithSelection(e.selection)?.name,
        sll_price: currencyNumber(e.sll_price),
        unit_price: currencyNumber(e.unit_price),
        images: e.images,
        meta_field,
        selection: null,
        inventories: [
          {
            id: 1,
            name: "Moon Coffee",
            office_id: 1,
            quantity: 10000,
            inventory_id: 1,
            unit_price: currencyNumber(props.sllPrice),
            sll_price: currencyNumber(props.sllPrice)
          }
        ]
      }
    })
  if (data.length > 0) return data
  else {
    return [
      {
        barcode: props.barCode,
        sku: props.sku,
        name: props.productName,
        sll_price: currencyNumber(props.sllPrice),
        unit_price: currencyNumber(props.unitPrice),
        images: props.images,
        skuIndex: skuIndex.value,
        meta_field: [],
        inventories: [
          {
            id: 1,
            name: "Moon Coffee",
            office_id: 1,
            quantity: 10000,
            inventory_id: 1,
            unit_price: currencyNumber(props.sllPrice),
            sll_price: currencyNumber(props.sllPrice)
          }
        ]
      }
    ]
  }
}

const getOptionsData = () => {
  return optionData.value
}

const getObjectWithKeyValue = (data: any, key1: string, key2: string) => {
  let result = data
  result[key1] = formatSlug(data[key2])
  return result
}

const getSelection = (index: number, slug: string): OPTION_ITEM | null => {
  return optionData.value[index]?.values?.find((e) => e.slug == slug) || null
}

const getDefaultVariantWithSelection = (selection: string): VARIANTS_FORM => {
  const name =
    props.productName +
    ' ' +
    selection
      ?.split(',')
      .map((slug, i) => getSelection(i, slug)?.value)
      .join(' - ')
  console.log((Number(props.barCode) + skuIndex.value).toString())
  return {
    id: undefined,
    selection,
    barcode: (Number(props.barCode) + skuIndex.value).toString(),
    sku: (Number(props.sku) * 10 + skuIndex.value).toString(),
    name: name,
    sll_price: currencyInput(props.sllPrice),
    unit_price: currencyInput(props.unitPrice),
    images: [],
    isUse: true,
    skuIndex: skuIndex.value
  }
}

const fillFormData = (option: OPTION[], variants: PRODUCT_VARIANTS_RESPONSE[] | null) => {
  if (variants) {
    result.value = variants?.map((variant) => {
      const selection = variant?.meta_field?.map(meta => meta.slug).toString()
      return {
        selection,
        id: variant?.id || '',
        barcode: variant?.barcode || '',
        sku: variant?.sku || '',
        name: variant?.name || '',
        sll_price: currencyInput(variant.sll_price),
        unit_price: currencyInput(variant.unit_price),
        isUse: true,
        images: variant?.images || []
      } as VARIANTS_FORM
    })
    managerResult.value = clone(result.value)
  }

  if (option) optionData.value = option
}

defineExpose({ getVariantsData, getOptionsData, fillFormData })
</script>
