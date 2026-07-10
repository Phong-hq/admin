<template>
  <c-breadcrumb />
  <div class="w-full page-box-white">
    <div class="min-w-full w-max max-w-full overflow-x-auto">
      <div class="flex justify-between items-center mb-2">
        <p class="heading-1">Nhãn hiệu</p>
        <div class="flex gap-2">
          <!-- <a-button
            ><template #icon><file-excel-outlined /></template
          ></a-button> -->
          <a-button type="primary" @click="addBrandDrawerRef?.show()">
            <template #icon>
              <plus-outlined />
            </template>
            Thêm nhãn hiệu
          </a-button>
        </div>
      </div>
      <c-table-ant
        :columns="columns"
        :data="brandList"
        :meta="meta"
        primary-key="id"
        expand-title="test"
        db-click
        :loading="tableLoading"
        @get-data="initData"
        @edit-row="handleRowUpdate"
        @start-edit-row="handleStartEditRow"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'image'">
            <img class="w-[40px] h-[40px] mx-auto" :src="`${text}`" alt="" v-if="text" />
          </template>
          <template v-else-if="column.key == 'status'">
            <box-active class="mx-auto" :value="record.status" />
          </template>
          <template v-else-if="column.key == 'category'">
            <div class="flex gap-y-2 flex-wrap">
              <a-tag v-for="item in record.categories" :key="item.id">{{ item.name }}</a-tag>
            </div>
          </template>
          <template v-else-if="column.key == 'action'">
            <box-action
              @edit="addBrandDrawerRef?.show(record)"
              @remove="handleDeleteCategory(record)"
            />
          </template>
          <template v-else-if="column.key == 'created_at'">
            <box-created-time :time="text" />
          </template>
          <template v-else-if="column.key == 'icon'">
            <a-space class="w-full justify-center">
              <img :src="item" alt="" v-for="item in record.icon" :key="item" />
            </a-space>
          </template>
        </template>

        <template #editableBox="{ key, id }">
          <template v-if="key == 'category' && editableRow[id]">
            <c-select-search
              class="!w-full"
              mode="multiple"
              v-model:value="editableRow[id].categories"
              default-data="category"
              :search="selectDataStore.searchCategoryList"
            ></c-select-search>
          </template>
        </template>
      </c-table-ant>
    </div>
    <add-brand-drawer ref="addBrandDrawerRef" @get-data="initData" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { COLUMN_TYPE } from '@/types/table'
import { PlusOutlined, FileExcelOutlined } from '@ant-design/icons-vue'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

//PINIA
import { useBrandStore } from '@/stores/brand'
import { useRootStore } from '@/stores/root'
import { useSelectDataStore } from '@/stores/select_data'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import BoxCreatedTime from '@/components/common/table/BoxCreatedTime.vue'
import AddBrandDrawer from './AddBrandDrawer.vue'
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'

const brandStore = useBrandStore()
const rootStore = useRootStore()
const selectDataStore = useSelectDataStore()
const router = useRouter()

const { getBrandList, updateBrand, deleteBrand } = brandStore

const brandList = computed(() => brandStore.brandList)
const meta = computed(() => brandStore.brandMeta)

const selectList = computed(() => selectDataStore.selectList)

const columns = [
  {
    title: 'Mã',
    key: 'code',
    isFilter: true,
    width: 'md',
    inputProps: { inputType: 'text' }
  },
  {
    title: 'Logo',
    width: 'sm',
    key: 'icon'
  },
  {
    title: 'Tên',
    key: 'name',
    isFilter: true,
    align: 'left',
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
    title: 'danh mục',
    width: 'xl',
    key: 'category'
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
    align: 'right',
    inputProps: {
      inputType: 'date'
    },
    width: 'md'
  },
  { title: '-', key: 'action', align: 'center', width: 50, noResizable: true }
] as COLUMN_TYPE[]

onMounted(() => {
  selectDataStore.getCategoryList()
  initData()
})

const tableLoading = ref(false)
const addBrandDrawerRef = ref<InstanceType<typeof AddBrandDrawer> | null>()
const editableRow = ref<any>({})

const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    await getBrandList(param)
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const handleDeleteCategory = async (data: any) => {
  try {
    await rootStore.confirm({
      bodyTitle: 'Xóa nhãn hiệu',
      bodyMessage: `Bạn có chắc chắn muốn xóa nhãn hiệu <span class="font-bold">${data?.name}</span> không?`,
      confirmButtonText: 'Có',
      cancelButtonText: 'không'
    })
    tableLoading.value = true
    await deleteBrand(data?.id)
    handle_success('Xóa danh mục thành công!')
    await initData()
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const handleRowUpdate = async (id: any, data: any) => {
  try {
    let item: any = brandList.value?.find((brand) => brand.id == id)
    if (item) {
      item = { ...item, ...data }
      item.categories = editableRow.value[id].categories
      tableLoading.value = true
      await updateBrand(id, item)
      await initData()
      handle_success('Cập nhập thành công')
    }
  } catch (error) {
    handle_error(error)
    tableLoading.value = false
  }
}

const handleStartEditRow = (id: any) => {
  const brand = brandList.value.find((e) => e.id == id)
  if (brand) {
    editableRow.value[id] = {
      categories: brand?.categories?.map((category) => category.id)
    }
  }
}
</script>
