<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="min-w-full w-max max-w-full overflow-x-auto">
      <div class="flex justify-between items-center mb-2">
        <p class="heading-1">Danh mục</p>
        <div class="flex gap-2">
          <a-button
            type="primary"
            ghost
            :loading="sortLoading"
            v-if="hasOrderChanged"
            @click="handleSaveSort"
          >
            Lưu thứ tự
          </a-button>
          <import-button :action="importCategory" @success="initData" />
          <a-button type="primary" @click="addCategoryDrawerRef?.show()">
            <template #icon>
              <plus-outlined />
            </template>
            Thêm danh mục
          </a-button>
        </div>
      </div>
      <c-table-ant
        :columns="columns"
        :data="categoriesList"
        :meta="meta"
        primary-key="id"
        db-click
        draggable
        :loading="tableLoading"
        @get-data="initData"
        @edit-row="handleRowUpdate"
        @reorder="handleReorder"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'drag'">
            <holder-outlined class="js-drag-handle cursor-move text-gray align-middle" />
          </template>
          <template v-else-if="column.key == 'created_at'">
            <box-created-time :time="text" />
          </template>
          <template v-else-if="column.key == 'icon'">
            <div class="flex-center" v-if="getCategoryIcon(record.icon?.[0])">
              <a-tooltip :title="CATEGORY_ICON_LABELS[record.icon?.[0]] || record.icon?.[0]">
                <span class="w-6 h-6" v-html="getCategoryIcon(record.icon?.[0])"></span>
              </a-tooltip>
            </div>
            <p class="text-center text-gray" v-else>-</p>
          </template>
          <template v-else-if="column.key == 'status'">
            <box-active class="mx-auto" :value="record.status" />
          </template>
          <template v-else-if="column.key == 'parent_id'">
            <p>{{ getParentName(record.parent_id) }}</p>
          </template>
          <template v-else-if="column.key == 'action'">
            <box-action
              @edit="addCategoryDrawerRef?.show(record)"
              @remove="handleDeleteCategory(record)"
            />
          </template>
        </template>
      </c-table-ant>
    </div>
    <add-category-drawer ref="addCategoryDrawerRef" @get-data="initData" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import { PlusOutlined, FileExcelOutlined, HolderOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { handle_error, handle_success } from '@/utils/message'

//PINIA
import { useCategoryStore } from '@/stores/category'
import { useSelectDataStore } from '@/stores/select_data'
import { useRootStore } from '@/stores/root'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import AddCategoryDrawer from './AddCategoryDrawer.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import ImportButton from '@/components/common/button/ImportButton.vue'

//CONSTANT
import { getCategoryIcon, CATEGORY_ICON_LABELS } from '@/constant/category-icon'

const categoryStore = useCategoryStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()
const router = useRouter()

const { getCategoryList, deleteCategory, updateCategory, importCategory, sortCategory } =
  categoryStore
const { confirm } = rootStore

const categoriesList = computed(() => categoryStore.categoriesList)
const meta = computed(() => categoryStore.categoryMeta)

const columns = [
  { title: '', key: 'drag', align: 'center', width: 64, noResizable: true },
  {
    title: 'Mã',
    key: 'code',
    isFilter: true,
    width: 'md',
    inputProps: { inputType: 'text' }
  },
  {
    title: 'Icon',
    width: 'sm',
    key: 'icon'
  },
  {
    title: 'Tên',
    key: 'name',
    align: 'left',
    isFilter: true,
    inputProps: { inputType: 'text' }
  },
  {
    title: 'Danh mục cha',
    key: 'parent_id',
    width: 'lg',
    inputProps: { inputType: 'select-search', data: { defaultData: 'category' } }
  },
  {
    title: 'Mô tả nhãn hiệu',
    key: 'description',
    width: 'xl',
    isFilter: true,
    inputProps: { inputType: 'text' }
  },
  {
    title: 'Trạng thái',
    key: 'status',
    sorter: true,
    inputProps: {
      inputType: 'check-number',
      data: {
        label: 'Kích hoạt'
      }
    },
    width: 'md'
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    isFilter: true,
    inputProps: {
      inputType: 'date'
    },
    width: 'md',
    align: 'right'
  },
  { title: '-', key: 'action', align: 'center', width: 50, noResizable: true }
] as COLUMN_TYPE[]

onMounted(() => {
  initData()
  selectDataStore.getCategoryList()
})

const getParentName = (parentId: any) => {
  if (!parentId) return '-'
  const item = selectDataStore.selectList.category.find((e) =>
    typeof e == 'string' ? e == parentId : e?.value == parentId
  )
  return (typeof item == 'string' ? item : item?.label) || '-'
}

const tableLoading = ref(false)
const sortLoading = ref(false)
const hasOrderChanged = ref(false)
const addCategoryDrawerRef = ref<InstanceType<typeof AddCategoryDrawer> | null>(null)
const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    hasOrderChanged.value = false
    await getCategoryList({ ...param, 'per-page': 50 })
  } catch (error) {
    handle_error(error)
  } finally {
    tableLoading.value = false
  }
}

const handleReorder = (newList: any[]) => {
  categoryStore.categoriesList = newList
  hasOrderChanged.value = true
}

const flattenCategories = (list: any[]): { id: any }[] =>
  list.flatMap((category) => [
    { id: category.id },
    ...(category.children?.length ? flattenCategories(category.children) : [])
  ])

const handleSaveSort = async () => {
  try {
    sortLoading.value = true
    await sortCategory(flattenCategories(categoriesList.value))
    handle_success('Lưu thứ tự thành công')
    hasOrderChanged.value = false
    await initData()
  } catch (error) {
    handle_error(error)
  } finally {
    sortLoading.value = false
  }
}

const handleDeleteCategory = async (data: any) => {
  try {
    await rootStore.confirm({
      bodyTitle: 'Xóa danh mục',
      bodyMessage: `Bạn có chắc chắn muốn xóa dạnh mục <span class="font-bold">${data?.name}</span> không?`,
      confirmButtonText: 'Có',
      cancelButtonText: 'không'
    })
    tableLoading.value = true
    await deleteCategory(data?.id)
    handle_success('Xóa danh mục thành công!')
    await initData()
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const handleRowUpdate = async (id: any, data: any) => {
  try {
    const item = categoriesList.value.find((category) => category.id == id)
    console.log('item', item)
    if (item) {
      const merged = { ...item, ...data }
      const payload = {
        ...merged,
        brands: (merged.brands || []).map((brand: any) => brand?.id ?? brand)
      }
      tableLoading.value = true
      await updateCategory(id, payload)
      await initData()
      handle_success('Cập nhập thành công')
    }
  } catch (error) {
    handle_error(error)
    tableLoading.value = false
  }
}
</script>
