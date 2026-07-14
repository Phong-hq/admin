<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="min-w-full w-max max-w-full overflow-x-auto">
      <div class="flex justify-between items-center">
        <p class="heading-1">Danh mục</p>
        <div class="flex gap-2">
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
        expand-title="test"
        db-click
        :loading="tableLoading"
        @get-data="initData"
        @edit-row="handleRowUpdate"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'created_at'">
            <box-created-time :time="text" />
          </template>
          <template v-else-if="column.key == 'icon'">
            <div class="flex-center" v-if="typeof text === 'string'">
              <img class="max-w-[60px]" :src="text" alt="" />
            </div>
            <a-space class="w-full justify-center" v-else>
              <img
                class="max-w-[60px]"
                :src="item"
                alt=""
                v-for="item in record.icon"
                :key="item"
              />
            </a-space>
          </template>
          <template v-else-if="column.key == 'status'">
            <box-active class="mx-auto" :value="record.status" />
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
import { PlusOutlined, FileExcelOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { handle_error, handle_success } from '@/utils/message'

//PINIA
import { useCategoryStore } from '@/stores/category'
import { useRootStore } from '@/stores/root'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import AddCategoryDrawer from './AddCategoryDrawer.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import ImportButton from '@/components/common/button/ImportButton.vue'

const categoryStore = useCategoryStore()
const rootStore = useRootStore()
const router = useRouter()

const { getCategoryList, deleteCategory, updateCategory, importCategory } = categoryStore
const { confirm } = rootStore

const categoriesList = computed(() => categoryStore.categoriesList)
const meta = computed(() => categoryStore.categoryMeta)

const columns = [
  {
    title: 'Mã',
    key: 'code',
    isFilter: true,
    width: 'md',
    inputProps: { inputType: 'text' }
  },
  {
    title: 'Hình',
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
})

const tableLoading = ref(false)
const addCategoryDrawerRef = ref<InstanceType<typeof AddCategoryDrawer> | null>(null)
const initData = async (param?: any) => {
  try {
    tableLoading.value = true

    await getCategoryList(param)
  } catch (error) {
    handle_error(error)
  } finally {
    tableLoading.value = false
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
    let item = categoriesList.value.find((category) => category.id == id)
    if (item) {
      item = { ...item, ...data }
      tableLoading.value = true
      await updateCategory(id, item)
      await initData()
      handle_success('Cập nhập thành công')
    }
  } catch (error) {
    handle_error(error)
    tableLoading.value = false
  }
}
</script>
