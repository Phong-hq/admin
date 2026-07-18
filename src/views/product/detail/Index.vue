<template>
  <c-breadcrumb :page="isEdit ? infoState.name : 'Tạo sản phẩm'"></c-breadcrumb>
  <div class="flex gap-4">
    <div class="grow flex-col gap-4 xl:w-auto w-full">
      <div class="page-box-white">
        <div class="flex justify-between items-center flex-wrap xl:gap-7 gap-0">
          <p class="heading-1">{{ isEdit ? 'Sửa' : 'Tạo' }} sản phẩm</p>
          <div class="md:flex grid sm:grid-cols-2 grid-cols-1 justify-end items-center gap-2 md:w-auto w-full sm:mb-0 mb-4">
            <note v-model="noteState" />
            <div class="xl:hidden block">
              <a-button
                type="primary" 
                @click="show"
                class="w-full"
              >
                {{ isEdit ? 'Sửa' : 'Tạo' }} phân loại và kho hàng
              </a-button>
            </div>
          </div>
        </div>
        <product-info ref="productInfoRef" v-model="infoState" />
      </div>
      <div class="page-box-white">
        <p class="heading-1">Giá sản phẩm</p>
        <product-price ref="productPriceRef" v-model="priceState" />
      </div>
      <!--        <div class="page-box-white">-->
      <!--          <product-warehouse ref="productPriceRef" v-model="warehouseState" />-->
      <!--        </div>-->
      <div class="page-box-white">
        <p class="heading-1 mb-2">Thông tin bổ sung</p>
        <p class="sub-heading">
          Bổ sung thông tin thêm về sản phẩm hoặc chính sách cửa hàng của bạn.
        </p>

        <product-additional-data v-model="additional_data" />
      </div>
      <div class="page-box-white">
        <p class="heading-1 mb-2">Thuộc tính</p>
        <p class="sub-heading">
          Thêm nhiều thuộc tính cho sản phẩm này, như kích thước hoặc màu sắc.
        </p>

        <product-variants-data
          ref="productVariantsDataRef"
          v-model="variants"
          :product-name="infoState.name"
          :sll-price="currencyNumber(priceState.sll_price)"
          :unit-price="currencyNumber(priceState.unit_price)"
          :sku="infoState.sku"
          :bar-code="infoState.bar_code"
          :images="subDataState.images"
        />
      </div>
    </div>
    <div class="shrink-0 w-[30%] xl:flex-col hidden gap-4">
      <div class="page-box-white">
        <p class="heading-1">Phân loại</p>
        <product-sub-data ref="productSubDataRef" v-model="subDataState" />
      </div>
      <div class="page-box-white">
        <product-warehouse ref="productPriceRef" v-model="warehouseState" />
      </div>
    </div>
  </div>
  <div class="sticky bottom-0 w-full flex-center z-[10] mt-7">
    <a-button
      class="w-[150px]"
      type="primary"
      @click="onFinish"
      :loading="submitLoading"
      :disabled="submitLoading"
      >Lưu
    </a-button>
  </div>
  <!-- Mobile Drawer -->
  <a-drawer
    v-model:open="open"
    :title="isEdit ? 'Sửa' : 'Tạo' + ' phân loại và kho hàng'"
    placement="right"
    :bodyStyle="{ padding: '0' }"
    :width="isMobileComputed ? 350 : 500"
  >
    <template #footer>
      <div class="flex justify-end">
        <a-button @click="hide">Hủy</a-button>
      </div>
    </template>
    <div class="bg-[#f3f5f8] flex-col gap-3 p-3">
      <div class="page-box-white">
        <p class="heading-1">Phân loại</p>
        <product-sub-data ref="productSubDataRef" v-model="subDataState" />
      </div>
      <div class="page-box-white">
        <product-warehouse ref="productPriceRef" v-model="warehouseState" />
      </div>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
// import { } from '@/constant/bank'
import { handle_error, handle_success } from '@/utils/message'
import type { PRODUCT_RESPONSE } from 'src/types/product/product.ts'
import { getRandomDigits } from '@/utils/string-helper'
import { useRoute, useRouter } from 'vue-router'

//COMPONENTS
import ProductInfo from './Info.vue'
import ProductSubData from './SubData.vue'
import ProductPrice from './Price.vue'
import ProductWarehouse from './Warehouse.vue'
import ProductAdditionalData from './AdditionalData.vue'
import ProductVariantsData from './variants/VariantsData.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
//PINIA
import { useProductStore } from '@/stores/product'
import { useRootStore } from '@/stores/root'
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { currencyInput, currencyNumber } from '@/utils/currency'
import Note from '@/views/product/detail/Note.vue'

const emits = defineEmits<{
  (e: 'getData'): void
}>()

// const bankStore = useBankStore()
const productStore = useProductStore()
const rootStore = useRootStore()
const selectDataStore = useSelectDataStore()
const route = useRoute()
const router = useRouter()

const { createProductItem, getProductItem, updateProductItem } = productStore
const isMobileComputed = computed(() => {
  return rootStore.isMobile
})
const isEdit = computed(() => route.name == 'product-detail')
const productId = computed(() => String(route.params?.id))

const CURRENCY_KEY = ['unit_price', 'sll_price', 'compare_price']

// const formState = reactive<PRODUCT_REQUEST>({
//   id: null,
//   allow_sell: 0,
//   brand: null,
//   category: null,
//   created_at: '',
//   description: '',
//   bar_code: '',
//   category_id: null,
//   dimension: null,
//   has_tax: null,
//   images: [],
//   import_price: null,
//   name: null,
//   short_description: null,
//   sku: null,
//   sll_price: null,
//   slug: null,
//   status: null,
//   suppliers: null,
//   tags: null,
//   unit_price: null,
//   updated_at: null,
//   weight: null,
//   weight_type: null,
//   product_variants: null
// })

const infoState = reactive({
  sku: getRandomDigits(9),
  bar_code: getRandomDigits(10),
  name: '',
  allow_sell: 0
})

const noteState = reactive({
  description: '',
  short_description: ''
})

const subDataState = reactive({
  brand_id: null as number | null,
  suppliers: [] as number[],
  tags: [],
  images: [] as string[],
  category_id: null as number | null
})

const priceState = reactive({
  sll_price: '0',
  unit_price: '0',
  compare_price: '',
  // allow_sell: 0
})

const warehouseState = reactive({
  weight: 0,
  weight_type: '',
  dimension: ''
})

onMounted(async () => {
  try {
    selectDataStore.getCategoryList()
    selectDataStore.getBrandList()
    selectDataStore.getSupplierList()
    if (isEdit.value && productId.value) {
      rootStore.showLoading()
      // await selectDataStore.getCategoryList()
      // await selectDataStore.getBrandList()
      // await selectDataStore.getSupplierList()
      const data: PRODUCT_RESPONSE = await getProductItem(productId.value)
      fillFormData(data)
    }
  } catch (error) {
    handle_error(error)
  }
  rootStore.hideLoading()
})

const additional_data_string = ref()
const additional_data = ref<{ name: string; value: string }[]>([])
const variants = ref([])
const name = ref('')

const loading = ref<boolean>(false)
const submitLoading = ref<boolean>(false)
const productInfoRef = ref<InstanceType<typeof ProductInfo> | null>(null)
const productSubDataRef = ref<InstanceType<typeof ProductSubData> | null>(null)
const productPriceRef = ref<InstanceType<typeof ProductPrice> | null>(null)
const productVariantsDataRef = ref<InstanceType<typeof ProductVariantsData> | null>(null)

const onFinish = async (values: any) => {
  try {
    await checkFormValidate()
    submitLoading.value = true
    let data = {
      ...infoState,
      ...noteState,
      ...subDataState,
      ...priceState,
      ...warehouseState,
      variants: productVariantsDataRef.value?.getVariantsData() || [],
      product_options: productVariantsDataRef.value?.getOptionsData() || [],
      additional_data: additional_data.value
    } as any

    CURRENCY_KEY.forEach((key) => {
      data[key] = currencyNumber(data[key])
    })
    data.compare_price = priceState.compare_price ? data.compare_price : null
    if (isEdit.value) {
      await updateProductItem(productId.value, data)
    } else {
      await createProductItem(data)
      router.push({ name: 'product-list' })
    }
    loading.value = true

    handle_success(isEdit.value ? 'Cập nhập thành công!' : 'Tạo thành công!')
  } catch (error) {
    handle_error(error)
  }
  submitLoading.value = false
  loading.value = false
}

const checkFormValidate = async () => {
  await productInfoRef.value?.validate()
  await productSubDataRef.value?.validate()
  await productPriceRef.value?.validate()
}

const fillFormData = async (res: PRODUCT_RESPONSE) => {
  if (!res) return
  name.value = res.name || ''
  infoState.sku = res.sku || ''
  infoState.allow_sell = res.allow_sell || 0
  infoState.bar_code = res.bar_code || ''
  noteState.description = res.description || ''
  noteState.short_description = res.short_description || ''
  infoState.name = res.name || ''

  subDataState.brand_id = res.brand?.id || null
  subDataState.category_id = res.category?.id || null
  subDataState.images = res.images || []
  subDataState.suppliers = res.suppliers?.map((supplier) => supplier.id) || []
  subDataState.tags = res.tags || []

  priceState.sll_price = currencyInput(res.sll_price) || '0'
  priceState.unit_price = currencyInput(res.unit_price) || '0'
  priceState.compare_price = res.compare_price ? currencyInput(res.compare_price) : ''
  // priceState.allow_sell = res.allow_sell || 0

  warehouseState.weight = Number(res.weight) || 0
  warehouseState.weight_type = res.weight_type || ''
  warehouseState.dimension = res.dimension || ''

  additional_data.value = res.additional_data || []

  // va
  // infoState.category_id = res.category?.id || ''
  // productInfoRef.value?.fillFormData()
  // productSubDataRef.value?.fillFormData()
  productVariantsDataRef.value?.fillFormData(res.product_options, res.product_variants)
}
//
// const formatResultToSting = (data: any): string => {
//   let result = {} as any
//   if (data.length > 0) {
//     data.forEach((e: any) => {
//       let keyArr = Object.keys(result)
//       if (e.title && !keyArr.includes(e.title)) {
//         result[e.title] = e.value
//       }
//     })
//   }
//   return JSON.stringify(result)
// }
//
// const getAdditionalData = () => {
//   additional_data.value = []
//   if (isJsonString(additional_data_string.value)) {
//     const data = JSON.parse(additional_data_string.value)
//     if (Object.keys(data).length) {
//       additional_data.value = Object.keys(data).map((e) => {
//         return {
//           name: e,
//           value: data[e]
//         }
//       })
//     }
//   }
// }

// Mobile Drawer
const open = ref<boolean>(false)
const show = () => {
  open.value = true
}

const hide = () => {
  open.value = false
}
</script>

<style lang="scss" scoped>
:deep(.ant-drawer-body) {
  padding: 0 !important;
}
</style>
