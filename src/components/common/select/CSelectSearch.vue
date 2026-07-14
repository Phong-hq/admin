<template>
  <CSelect
    :data="data"
    :search-loading="loading"
    @search="handleSearch"
    :filter-option="false"
    has-search
  />
<!--    :not-found-content="loading ? undefined : null"-->
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import type { SelectConfig, SelectConfigItem, SelectSearchConfig } from '@/types/index'
import CSelect from './CSelect.vue'
import { useDebounce } from '@/utils/debounce'
import { useSelectDataStore } from '@/stores/select_data'

interface Props {
  search?: (id: string, params?: any) => Promise<SelectConfig>
  defaultData:
    | 'inventory'
    | 'category'
    | 'brand'
    | 'office'
    | 'supplier'
    | 'variant'
    | 'product_inventory'
    | 'client'
    | 'promotion'
    | 'province'
    | 'contact'
    | 'user'
    | 'group'
    | ''
  extraData?: SelectConfigItem[]
  params?: any
  suffix?: boolean
}

const props = withDefaults(defineProps<Props>(), { suffix: false })

const emits = defineEmits<{
  (e: 'update:modelValue', id: any): void
}>()

const selectDataStore = useSelectDataStore()

const currentDefaultData = computed<SelectConfigItem[]>(() => {
  if (props.params) return []
  if (props.defaultData == 'inventory') return selectDataStore.selectList.inventory
  else if (props.defaultData == 'category') return selectDataStore.selectList.category
  else if (props.defaultData == 'brand') return selectDataStore.selectList.brand
  else if (props.defaultData == 'office') return selectDataStore.selectList.office
  else if (props.defaultData == 'supplier') return selectDataStore.selectList.supplier
  else if (props.defaultData == 'variant') return selectDataStore.selectList.variant
  else if (props.defaultData == 'client') return selectDataStore.selectList.client
  else if (props.defaultData == 'promotion') return selectDataStore.selectList.promotion
  else if (props.defaultData == 'province') return selectDataStore.selectList.province
  else if (props.defaultData == 'contact') return selectDataStore.selectList.contact
  else if (props.defaultData == 'user') return selectDataStore.selectList.user
  else if (props.defaultData == 'group') return selectDataStore.selectList.group
  return []
})

const defaultSearchFunction = computed<
  ((id: string, params?: any) => Promise<SelectConfig>) | null
>(() => {
  if (props.defaultData == 'inventory') return selectDataStore.searchInventoryList
  else if (props.defaultData == 'category') return selectDataStore.searchCategoryList
  else if (props.defaultData == 'brand') return selectDataStore.searchBrandList
  else if (props.defaultData == 'office') return selectDataStore.searchOfficeList
  else if (props.defaultData == 'supplier') return selectDataStore.searchSupplierList
  else if (props.defaultData == 'variant') return selectDataStore.searchVariantList
  else if (props.defaultData == 'client') return selectDataStore.searchClientList
  else if (props.defaultData == 'promotion') return selectDataStore.searchPromotionList
  else if (props.defaultData == 'province') return selectDataStore.searchProvinceList
  else if (props.defaultData == 'contact') return selectDataStore.searchContactList
  else if (props.defaultData == 'user') return selectDataStore.searchUserList
  else if (props.defaultData == 'group') return selectDataStore.searchGroupList
  else if (props.defaultData == 'product_inventory')
    return selectDataStore.searchVariantInventoryList
  return null
})

const defaultGetFunction = computed<((reload?: boolean) => Promise<any>) | null>(() => {
  if (props.defaultData == 'inventory') return selectDataStore.getInventoryList
  else if (props.defaultData == 'category') return selectDataStore.getCategoryList
  else if (props.defaultData == 'brand') return selectDataStore.getBrandList
  else if (props.defaultData == 'office') return selectDataStore.getOfficeList
  else if (props.defaultData == 'supplier') return selectDataStore.getSupplierList
  else if (props.defaultData == 'variant') return selectDataStore.getVariantList
  else if (props.defaultData == 'client') return selectDataStore.getClientList
  else if (props.defaultData == 'promotion') return selectDataStore.getPromotionList
  else if (props.defaultData == 'province') return selectDataStore.getProvinceList
  else if (props.defaultData == 'contact') return selectDataStore.getContactList
  else if (props.defaultData == 'user') return selectDataStore.getUserList
  else if (props.defaultData == 'group') return selectDataStore.getGroupList
  return null
})

const data = computed(() => {
  let result: SelectConfig = searching.value
    ? searchData.value
    : props.params == undefined
      ? currentDefaultData.value
      : defautDataWithParams.value
  if (props.extraData?.length) {
    props.extraData.forEach(item => {
      if (
        (typeof item == 'string' && item) ||
        (typeof item != 'string' && item?.value)
      ) {
          const extraDataIndex = result.findIndex(
            (e) =>
              (typeof e == 'string' ? e : e?.value) ==
              (typeof item == 'string' ? item : item?.value)
          )
          if (extraDataIndex > -1) {
            result[extraDataIndex] = item
          } else {
            result.push(item)
          }
      }

    })
  }
  return result
})

onMounted(async () => {
  if (props.defaultData && props.params == undefined && defaultGetFunction.value) {
    try {
      await defaultGetFunction.value()
    } catch (error) {
      console.log(error)
    }
  }
})

const loading = ref(false)
const searchData = ref<SelectConfig>([])
const searching = ref(false)
const defautDataWithParams = ref<SelectConfigItem[]>([])

const handleSearch = useDebounce(async (value: string) => {
  try {
    if (!value && !props.params) {
      searching.value = false
    } else {
      loading.value = true
      searching.value = true
    }
    searchData.value = []
    if (defaultSearchFunction.value != null)
      searchData.value = (await defaultSearchFunction.value(value, props.params)) ?? []
    else if (props.search) searchData.value = await props.search(value, props.params)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}, 200)

watch(
  () => props.params,
  async (newValue, oldValue) => {
    if (newValue != undefined) {
      if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
        if (defaultSearchFunction.value != null)
          defautDataWithParams.value = (await defaultSearchFunction.value('', props.params)) ?? []
        else if (props.search) defautDataWithParams.value = await props.search('', props.params)
      }
    }
  },
  { immediate: true }
)
</script>

<style lang="scss"></style>
