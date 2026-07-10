<template>
  <div class="">
    <div class="w-full max-h-[400px] overflow-y-auto" v-if="resultObject?.length">
      <template v-for="(item, i) in resultObject" :key="i">
        <div class="grid grid-cols-[auto_20px] hover:bg-item_hover cursor-pointer gap-7 px-4 py-4">
          {{ item[mainSchema] }}
          <div class="cursor-pointer flex-center" @click.stop="removeRelationItem(item)">
            <delete-outlined />
          </div>
        </div>
        <a-divider class="!my-1"></a-divider>
      </template>
    </div>
    <template v-else-if="result">
      <div class="empty">{{ resultObject[mainSchema] }}</div>
    </template>
    <a-button type="primary" class="mt-4" @click="handleOpenRelationModal"
      >Thêm thành phần</a-button
    >
    <a-modal
      v-model:open="relationModal"
      :title="options?.ref_table"
      :width="800"
      @ok="handleModalConfirm"
    >
      <!-- <c-search class="mb-4" v-model:value="search"></c-search> -->
      <div class="w-full h-[500px] overflow-hidden border border-CDE rounded-md relative">
        <div
          class="absolute inset-0 sc-full flex justify-center pt-10 z-[10] bg-[#29292911]"
          v-if="loading"
        >
          <a-spin size="large"> </a-spin>
        </div>
        <div class="sc-full overflow-y-auto p-4">
          <template v-if="!relationRecord?.length"
            ><a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE"
          /></template>
          <template v-else>
            <template v-for="(item, i) in relationRecord" :key="i">
              <div
                class="grid grid-cols-[40px_auto_20px] hover:bg-item_hover cursor-pointer gap-7 px-4 py-4"
                @click="handleRecordChange(!isChecked(item), item)"
              >
                <div class="flex items-center">
                  <a-checkbox :checked="isChecked(item)"></a-checkbox>
                </div>
                <div class="line-clamp-2">
                  {{ item[mainSchema] }}
                </div>
                <div
                  class="cursor-pointer flex-center"
                  @click.stop="showRelationItemDetail(item)"
                  v-if="options.is_cms == 1"
                >
                  <eye-outlined />
                </div>
              </div>
              <a-divider class="!my-1"></a-divider>
            </template>
            <div class="flex-center mt-7">
              <a-button
                class=""
                type="primary"
                v-if="(meta?.currentPage || 0) < (meta?.pageCount || 0)"
                >Tải thêm</a-button
              >
            </div>
          </template>
        </div>
      </div>
      <p class="font-bold mt-4 mb-4">Đã chọn:</p>
      <div class="w-full flex flex-wrap gap-2">
        <a-tag
          class=""
          closable
          @close="removeRelationModalItem(item)"
          v-for="item in resultObjectModal"
          :key="item.id"
          >{{ item[mainSchema] }}</a-tag
        >
      </div>
      <!-- <div class="flex justify-end">
        <a-button type="primary" @click="relationModal = false">Xác nhận</a-button>
      </div> -->
      <add-record-drawer ref="addRecordDrawerRef" :collection="collection" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import { type SCHEMAS_TYPE, SCHEMAS } from '@/constant/cms'
import type { SCHEMA_RESPONSE, COLLECTION_RESPONSE } from '@/types/cms/collection'
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { Empty } from 'ant-design-vue'

//UTILS
import { clone } from '@/utils/clone'

//COMPONENTS
import CSearch from '@/components/common/input/CSearch.vue'
import AddRecordDrawer from '../AddRecordDrawer.vue'

import { useCmsStore } from '@/stores/cms'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import { useBrandStore } from '@/stores/brand'
import { useSupplierStore } from '@/stores/supplier'

type Props = {
  modelValue: any
  options: any
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'getData'): void
  (e: 'update:modelValue', id: string): void
  (e: 'update:data', id: string): void
  (e: 'removeField'): void
}>()

const cmsStore = useCmsStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const brandStore = useBrandStore()
const supplierStore = useSupplierStore()

const { getCmsRecord } = cmsStore

const result = computed({
  set(value: string) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})
const collection = computed<COLLECTION_RESPONSE | null>(() => {
  if (props.options?.is_cms == 1) {
    return cmsStore.collectionList?.find((e) => e.name == props.options?.ref_table) ?? null
  }
  return null
})
const schemas = computed<SCHEMA_RESPONSE[] | null>(() => {
  return collection.value?.schemas ?? null
})
const relationRecordRender = computed<any>(() => {
  if (search.value == '') return relationRecord.value
  return relationRecord.value.filter((e: any) => e[mainSchema.value].include(search.value))
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

onMounted(() => {
  if (result.value && typeof result.value != 'string') {
    if (result.value?.length > 0) {
      resultObject.value = clone(result.value)
      result.value = resultObject.value.map((e: any) => e.id).join(',')
    } else {
      resultObject.value = clone([result.value])
      result.value = resultObject.value[0]?.id.toString()
    }
  }
})

const relationModal = ref(false)
const relationRecord = ref<any>([])
const resultObject = ref<any>([])
const resultObjectModal = ref<any>([])
const search = ref('')
const loading = ref(true)
const page = ref(0)
const meta = ref<MetaResponse | null>(null)
const addRecordDrawerRef = ref<InstanceType<typeof AddRecordDrawer> | null>(null)

const getDataFunc = async () => {
  page.value++
  let data = {
    status: 1,
    page: page.value
  }
  let res = null as any

  if (props.options?.is_cms == 1) {
    res = await getCmsRecord(props.options?.ref_table)
  } else {
    if (props.options?.ref_table == 'product') {
      res = await productStore.getProductList(data)
    } else if (props.options?.ref_table == 'category') {
      res = await categoryStore.getCategoryList(data)
    } else if (props.options?.ref_table == 'brand') {
      res = await brandStore.getBrandList(data)
    } else if (props.options?.ref_table == 'supplier') {
      res = await supplierStore.getSupplierList(data)
    }
  }

  res.items.forEach((item: any) => {
    relationRecord.value.push(item)
  })
  meta.value = res.meta
  console.log(relationRecord.value)
}

const handleOpenRelationModal = async () => {
  try {
    relationModal.value = true
    loading.value = true
    resultObjectModal.value = clone(resultObject.value)
    if (page.value == 0) await getDataFunc()
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}

const addRelationModalItem = (item: any) => {
  if (props.options?.type == 'single') {
    resultObjectModal.value[0] = item
  } else {
    resultObjectModal.value.push(item)
  }
}

const removeRelationModalItem = (item: any) => {
  const index = resultObjectModal.value.findIndex((e: any) => e.id == item.id)
  if (index > -1) {
    resultObjectModal.value.splice(index, 1)
  }
}

const removeRelationItem = (item: any) => {
  const index = resultObject.value.findIndex((e: any) => e.id == item.id)

  if (index > -1) {
    resultObject.value.splice(index, 1)
    result.value = resultObject.value.map((e: any) => e.id).join(',')
  }
}

const handleRecordChange = (value: any, item: any) => {
  if (value) {
    addRelationModalItem(item)
  } else {
    removeRelationModalItem(item)
  }
}

const isChecked = (item: any) => {
  return resultObjectModal.value?.findIndex((e: any) => e.id == item.id) > -1
}

const showRelationItemDetail = (item: any) => {
  addRecordDrawerRef.value?.show(item)
}

const handleModalConfirm = () => {
  resultObject.value = clone(resultObjectModal.value)
  result.value = resultObject.value.map((e: any) => e.id).join(',')
  relationModal.value = false
}
</script>

<style lang="scss"></style>
