<template>
  <div class="w-full page-box-white">
    <div class="min-w-full w-max max-w-full overflow-x-auto">
      <div class="flex justify-between items-center">
        <p class="heading-1">Danh mục</p>
        <div class="flex gap-2">
          <!-- <a-button
            ><template #icon><file-excel-outlined /></template
          ></a-button> -->
          <a-button type="primary" @click="router.push({ name: 'product-create' })"
            ><template #icon><plus-outlined /></template>Thêm nhãn hiệu</a-button
          >
        </div>
      </div>
      <c-table-ant
        :columns="columns"
        :data="productData"
        :meta="meta"
        primary-key="id"
        expand-title="test"
        db-click
        :loading="tableLoading"
        @get-data="initData"
      >
        <template #bodyCell="{ text, record, column }">
          <template v-if="column.key == 'image'">
            <img class="w-[40px] h-[40px] mx-auto" :src="`${text}`" alt="" v-if="text" />
          </template>
          <template v-else-if="column.key == 'status'">
            <box-active class="mx-auto" :value="record.status" />
          </template>
          <template v-else-if="column.key == 'action'">
            <box-action />
          </template>
        </template>
      </c-table-ant>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import { PlusOutlined, FileExcelOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { handle_error } from '@/utils/message'
//PINIA
import { useBrandStore } from '@/stores/brand'
import { useSelectDataStore } from '@/stores/select_data'

//COMPONENTS
import CTableAnt from '@/components/common/table/CTable.vue'
import BoxActive from '@/components/common/table/BoxActive.vue'
import BoxAction from '@/components/common/table/BoxAction.vue'

const brandStore = useBrandStore()
const router = useRouter()

const { getBrandList } = brandStore

const productData = computed(() => brandStore.brandList)
const meta = computed(() => brandStore.brandMeta)

const columns = [
  {
    title: 'Mã danh mục',
    key: 'code',
    isFilter: true,
    inputProps: { inputType: 'text' }
  },
  {
    title: 'Tên danh mục',
    key: 'name',
    isFilter: true,
    inputProps: { inputType: 'text' }
  },
  {
    title: 'Mô tả danh mục',
    key: 'description',
    isFilter: true,
    inputProps: { inputType: 'text' }
  },
  {
    title: 'Trạng thái',
    key: 'status',
    isFilter: true,
    inputProps: {
      inputType: 'select',
      data: [
        { value: 1, label: 'Kích hoạt' },
        { value: 0, label: 'Chưa kích hoạt' }
      ]
    }
  },
  {
    title: 'Ngày tạo',
    key: 'created_at'
  },
  { title: '-', key: 'action', align: 'center', width: 50, noResizable: true }
] as COLUMN_TYPE[]

onMounted(() => {
  initData()
})

const tableLoading = ref(false)
const editableRow = ref<any>({})

const initData = async (param?: any) => {
  try {
    tableLoading.value = true
    console.log(param)

    await getBrandList(param)
  } catch (error) {
    handle_error(error)
  }
  tableLoading.value = false
}

const goToEditPage = (id: any) => {
  router.push({ name: 'product-detail', params: { id: id } })
}
</script>
