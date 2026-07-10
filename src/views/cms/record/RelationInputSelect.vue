<template>
  <c-select-search
    v-model:value="selectedValue"
    :mode="isMultiple ? 'multiple' : undefined"
    :search="search"
    :extra-data="extraData"
    :placeholder="`Chọn ${options?.ref_table ?? ''}`"
  />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { SCHEMAS } from '@/constant/cms'
import type { SCHEMA_RESPONSE, COLLECTION_RESPONSE } from '@/types/cms/collection'
import type { SelectConfig, SelectConfigItem } from '@/types/index'

//COMPONENTS
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

import { useCmsStore } from '@/stores/cms'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import { useBrandStore } from '@/stores/brand'
import { useSupplierStore } from '@/stores/supplier'
import { useSelectDataStore } from '@/stores/select_data'

type Props = {
  modelValue: any
  options: any
  collection?: any
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'update:modelValue', id: string): void
}>()

const cmsStore = useCmsStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const brandStore = useBrandStore()
const supplierStore = useSupplierStore()
const selectDataStore = useSelectDataStore()

const { getCmsRecord } = cmsStore

const isMultiple = computed<boolean>(() => props.options?.type == 'multiple')

const collection = computed<COLLECTION_RESPONSE | null>(() => {
  if (props.options?.is_cms == 1) {
    return cmsStore.collectionList?.find((e) => e.name == props.options?.ref_table) ?? null
  }
  return null
})
const schemas = computed<SCHEMA_RESPONSE[] | null>(() => {
  return collection.value?.schemas ?? null
})
const mainSchema = computed<string>(() => {
  if (props.options?.is_cms == 0) return 'name'
  if (schemas.value == null) return 'id'
  let result = 'id'
  for (let i = 0; i < schemas.value.length; i++) {
    if (
      schemas.value[i].type != SCHEMAS.BOOLEAN &&
      schemas.value[i].type != SCHEMAS.DATE_TIME &&
      schemas.value[i].type != SCHEMAS.FILE &&
      schemas.value[i].type != SCHEMAS.RELATION &&
      schemas.value[i].type != SCHEMAS.JSON &&
      schemas.value[i].type != null
    ) {
      result = schemas.value[i].name ?? 'id'
      break
    }
  }
  return result
})

// cache label of every record we've ever seen (search results + initial value), keyed by
// stringified id, so previously selected items keep their label once they scroll out of view
const optionsCache = new Map<string, SelectConfigItem>()

const toItem = (record: any): SelectConfigItem => ({
  value: String(record.id),
  label: record[mainSchema.value]
})

const normalize = (list: SelectConfigItem[]): SelectConfig => {
  return list.map((item) => {
    if (typeof item == 'string') return item
    const normalized = { ...item, value: String(item.value) }
    optionsCache.set(normalized.value, normalized)
    return normalized
  })
}

const rawValue = ref<any>(isMultiple.value ? [] : undefined)

const emitValue = () => {
  const ids: string[] = isMultiple.value
    ? (rawValue.value ?? [])
    : rawValue.value != null && rawValue.value !== ''
      ? [rawValue.value]
      : []
  emits('update:modelValue', ids.join(','))
}

onMounted(() => {
  const initial = props.modelValue
  if (initial && typeof initial != 'string') {
    const items = Array.isArray(initial) ? initial : [initial]
    items.forEach((item: any) => {
      if (item?.id != null) optionsCache.set(String(item.id), toItem(item))
    })
    rawValue.value = isMultiple.value
      ? items.filter((e: any) => e?.id != null).map((e: any) => String(e.id))
      : items[0]?.id != null
        ? String(items[0].id)
        : undefined
    emitValue()
  } else if (typeof initial == 'string' && initial) {
    rawValue.value = isMultiple.value ? initial.split(',').filter(Boolean) : initial
  }
})

const selectedValue = computed({
  get() {
    return rawValue.value
  },
  set(value: any) {
    rawValue.value = value
    emitValue()
  }
})

const extraData = computed<SelectConfigItem[]>(() => {
  const ids: string[] = isMultiple.value
    ? (rawValue.value ?? [])
    : rawValue.value
      ? [rawValue.value]
      : []
  return ids.map((id) => optionsCache.get(id) ?? { value: id, label: id })
})

const search = async (key: string): Promise<SelectConfig> => {
  if (props.options?.is_cms == 1) {
    const res = await getCmsRecord(props.options?.ref_table)
    const items = (res.items ?? []).filter(
      (item: any) =>
        !key || String(item[mainSchema.value] ?? '').toLowerCase().includes(key.toLowerCase())
    )
    return normalize(items.map(toItem))
  }
  if (props.options?.ref_table == 'product') {
    const res = await productStore.getProductList({ status: 1, name: key })
    return normalize((res.items ?? []).map(toItem))
  }
  if (props.options?.ref_table == 'category') {
    return normalize(await selectDataStore.searchCategoryList(key))
  }
  if (props.options?.ref_table == 'brand') {
    return normalize(await selectDataStore.searchBrandList(key))
  }
  if (props.options?.ref_table == 'supplier') {
    return normalize(await selectDataStore.searchSupplierList(key))
  }
  return []
}
</script>

<style lang="scss"></style>
