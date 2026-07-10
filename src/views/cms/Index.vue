<template>
  <div class="sc-full flex overflow-hidden relative">
    <collection
      class="w-[256px] shrink-0"
      ref="collectionRef"
      v-model:active-collection="activeCollection"
      @create-collection="addCollectionDrawerRef?.show()"
      @getData="initData"
    />
    <div class="grow overflow-hidden relative p-7">
      <div class="flex justify-between mb-2">
        <div class="flex items-center gap-4">
          <p class="heading-1">{{ currentCollection?.name }}</p>
          <a-dropdown class="mb-4">
            <div class="cursor-pointer">
              <setting-outlined />
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item class="h-10">
                  <a-space @click="handleUpdateCms">
                    <edit-outlined />
                    <p>Chỉnh sửa</p>
                  </a-space>
                </a-menu-item>
                <a-menu-item class="h-10">
                  <a-space @click="handleRemoveCms">
                    <delete-outlined />
                    <p>Xóa</p>
                  </a-space>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div class="flex-center gap-4">
          <a-button
            class=""
            type="primary"
            v-if="currentCollection"
            @click="addRecordDrawerRef?.show()"
            >Tạo record
          </a-button>
        </div>
      </div>
      <div class="w-full overflow-auto relative">
        <div class="w-max min-w-[calc(100%_-_10px)]">
          <c-table
            class="w-max min-w-full"
            ref="tableRef"
            :row-class-name="() => 'cursor-pointer !hover:item_hover'"
            :columns="column"
            :data="records"
            :primary-key="'id'"
            :loading="tableLoading"
            :selection-column="(currentCollection?.schemas?.length || 0) > 0"
            v-model:selected-row-keys="selectedRowKeys"
            :meta="null"
            :row-click="showEditRecord"
            @get-data="initData"
          >
            <template #bodyCell="{ text, record, column }">
              <template v-if="column.key == 'created_at'">
                <box-created-time :time="text" />
              </template>
              <template v-else-if="column.schemaType == SCHEMAS.FILE">
                <a-image class="max-w-[50px] max-h-[50px]" :src="text" v-if="text"></a-image>
              </template>
              <template v-else-if="column.schemaType == SCHEMAS.RELATION">
                <template v-if="record[column.key]?.length > 0">
                  <a-tag v-for="(item, i) in record[column.key]" :key="i">
                    <span v-if="column.schemaOption?.is_cms == 1">
                      {{ item[getMainSchema(column.schemaOption?.ref_table)] }}</span
                    >
                    <span v-else> {{ item.name ?? item.title ?? item.id }}</span>
                  </a-tag>
                </template>
                <template v-else-if="record[column.key]">
                  <a-tag v-if="column.schemaOption?.is_cms == 1"
                    >{{ record[column.key][getMainSchema(column.schemaOption?.ref_table)] }}
                  </a-tag>
                  <a-tag v-else>{{ record[column.key].name }}</a-tag>
                </template>
              </template>
              <template v-else-if="column.schemaType == SCHEMAS.URL">
                <a class="" :href="text" target="_blank" v-if="text">{{ text }}</a>
              </template>
              <template v-else-if="column.schemaType == SCHEMAS.BOOLEAN">
                {{ text == 1 ? 'true' : 'false' }}
              </template>
              <template v-else-if="column.schemaType == SCHEMAS.EDITOR">
                <div class="max-h-[150px] overflow-auto" v-html="text"></div>
              </template>
              <template v-else-if="column.schemaType == SCHEMAS.DATE_TIME">
                <box-created-time :time="text" />
              </template>
              <template
                v-else-if="
                  column.schemaType == SCHEMAS.SELECT && column.schemaOption.type == 'multiple'
                "
              >
                <template v-if="JSON.parse(text).length">
                  <a-tag v-for="item in JSON.parse(text)" :key="item">{{ item }}</a-tag>
                </template>
                <span v-else></span>
              </template>
            </template>
          </c-table>
        </div>
      </div>
      <div class="py-7 flex justify-end">
        <a-pagination
          :current="recordsMeta?.currentPage"
          :total="recordsMeta?.totalCount"
          show-less-items
          v-if="(recordsMeta?.totalCount ?? 0) > 0"
        />
      </div>
      <div
        class="absolute bottom-7 w-full flex-center opacity-0 duration-300 z-[10] mt-7"
        :class="{ 'opacity-[1]': selectedRowKeys?.length }"
      >
        <div class="w-[350px] h-10 bg-white rounded-[50px] shadow-1 flex items-center gap-2 px-4">
          <p class="grow">
            đã chọn <span class="font-semibold">{{ selectedRowKeys?.length }}</span> record
          </p>
          <a-button type="primary" ghost @click="selectedRowKeys = []">Trở lại</a-button>
          <a-button type="primary" @click="handleDeleteRecord">Xóa</a-button>
        </div>
      </div>
    </div>
    <add-collection-drawer ref="addCollectionDrawerRef" @get-data="initData" />
    <add-record-drawer
      ref="addRecordDrawerRef"
      :collection="currentCollection"
      @get-data="getRecord"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import { SettingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

//PINIA
import { useCmsStore } from '@/stores/cms'
import { useRootStore } from '@/stores/root'
import { handle_error, handle_success } from '@/utils/message'

//COMPONENT
import Collection from './Collection.vue'
import AddCollectionDrawer from './AddCollectionDrawer.vue'
import AddRecordDrawer from './AddRecordDrawer.vue'
import CTable from '@/components/common/table/CTable.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import { SCHEMAS } from '@/constant/cms'
import type { COLLECTION_RESPONSE } from '@/types/cms/collection'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'

const cmsStore = useCmsStore()
const rootStore = useRootStore()

const { getCmsRecord, getTableRelation, deleteCmsCollection, deleteCmsRecord } = cmsStore
const { confirm } = rootStore

const collections = computed(() => cmsStore.collectionList)
const currentCollection = computed<COLLECTION_RESPONSE | null>(() => {
  if (activeCollection.value == null) return null
  return collections.value.find((collection) => collection.id == activeCollection.value) ?? null
})

const column = computed<COLUMN_TYPE[]>(() => {
  if (!currentCollection.value || !collections.value?.length) return []
  const schemas = currentCollection.value.schemas
  if (schemas?.length) {
    let result = schemas.map((schema) => {
      let isFilter = false
      let inputProps = undefined as any
      let sorter = undefined as any

      if (schema.type != null) {
        if (schema.type != SCHEMAS.FILE && schema.type != SCHEMAS.JSON) {
          isFilter = true
          if ([SCHEMAS.TEXT, SCHEMAS.EMAIL, SCHEMAS.URL, SCHEMAS.EDITOR].includes(schema.type)) {
            inputProps = {
              inputType: 'text'
            }
          } else if (schema.type == SCHEMAS.SELECT) {
            inputProps = {
              inputType: 'select',
              data: schema.options?.value
            }
          }
        }
        if (schema.type == SCHEMAS.NUMBER || schema.type == SCHEMAS.BOOLEAN) {
          sorter = true
        }
      }

      return {
        title: schema.name,
        key: schema.name,
        schemaType: schema.type || '',
        schemaOption: schema.options,
        isFilter,
        inputProps,
        sorter
      } as COLUMN_TYPE
    })
    result.push({
      title: 'created_at',
      key: 'created_at',
      isFilter: true,
      sorter: true,
      inputProps: {
        inputType: 'date'
      }
    } as COLUMN_TYPE)
    return result
  }
  return []
})

onMounted(() => {
  getTableRelation()
})

const search = ref('')
const activeCollection = ref(null)
const addCollectionDrawerRef = ref<InstanceType<typeof AddCollectionDrawer> | null>(null)
const addRecordDrawerRef = ref<InstanceType<typeof AddRecordDrawer> | null>(null)
const records = ref<any>([])
const recordsMeta = ref<MetaResponse | null>(null)
const tableRef = ref<InstanceType<typeof CTable> | null>(null)
const tableLoading = ref(true)
const selectedRowKeys = ref<any>([])
const collectionRef = ref<InstanceType<typeof Collection> | null>(null)

const initData = async (data?: any) => {
  try {
    selectedRowKeys.value = []
    tableRef.value?.updateColumn()
    tableLoading.value = true
    records.value = []
    await getRecord(data)
  } catch (error) {
    handle_error(error)
  } finally {
    tableLoading.value = false
  }
}

const getRecord = async (data?: any) => {
  const res = await getCmsRecord(currentCollection.value?.name || '', data)
  records.value = res?.items?.map((e: any) => {
    return {
      ...e,
      key: e.id
    }
  })
  recordsMeta.value = res?._meta
}

const showEditRecord = (item: any) => {
  addRecordDrawerRef.value?.show(item)
}

const handleRemoveCms = async () => {
  try {
    await confirm({
      bodyTitle: 'Xóa CMS',
      bodyMessage: `Bạn có chắc chắn muốn xóa <span class="font-bold">${currentCollection.value?.name}</span> không?`,
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    })
    await deleteCmsCollection(currentCollection.value?.id)
    collectionRef.value?.initData()
  } catch (error) {
    handle_error(error)
  }
}

const handleUpdateCms = async () => {
  addCollectionDrawerRef.value?.show(currentCollection.value)
}

const getMainSchema = (cms: string) => {
  const schemas = collections.value?.find((collection) => collection.name == cms)?.schemas
  if (!schemas) return 'id'
  let result = 'id'
  for (let i = 0; i < schemas.length; i++) {
    if (
      schemas[i].type != SCHEMAS.BOOLEAN &&
      schemas[i].type != SCHEMAS.DATE_TIME &&
      schemas[i].type != SCHEMAS.FILE &&
      schemas[i].type != SCHEMAS.RELATION &&
      schemas[i].type != SCHEMAS.JSON &&
      schemas[i].type != null
    ) {
      result = schemas[i].name ?? 'id'
      break
    }
  }
  return result
}

const handleDeleteRecord = async () => {
  try {
    await confirm({
      bodyTitle: 'Xóa record',
      bodyMessage: `Bạn có chắc chắn muốn xóa những record đó ko?`,
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    })

    await deleteCmsRecord(currentCollection.value?.name ?? '', selectedRowKeys.value?.toString())
    initData()
  } catch (error) {
    handle_error(error)
  }
}
</script>
