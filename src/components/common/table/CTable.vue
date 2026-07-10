<template>
<!--    :bordered="bordered"-->
  <a-table
    :columns="columnsRender"
    :data-source="dataRender"
    v-model:expandedRowKeys="expandedRowKeys"
    :row-selection="rowSelectionConfig"
    :expand-column-width="20"
    :customRow="(record: any) => handleCustomRow(record)"
    @resizeColumn="handleResizeColumn"
    @change="handleTableChange"
    :scroll="{ x: widthScrollX }"
    :pagination="
      meta && meta?.totalCount
        ? {
            current: meta?.currentPage,
            total: meta?.totalCount,
            pageSize: meta?.perPage
          }
        : false
    "
  >
    <!-- HEADER CELL -->
    <template #headerCell="{ title, column }">
      <template v-if="column.isFilter">
        <template v-if="column?.inputProps?.inputType == 'text'">
          <a-input v-model:value="reactiveData[column.key]" allow-clear />
        </template>
        <template v-else-if="column?.inputProps?.inputType == 'number'">
          <a-input-number class="!w-full" v-model:value="reactiveData[column.key]" allow-clear />
        </template>
        <template v-else-if="column?.inputProps?.inputType == 'select'">
          <CSelect
            class="!w-full"
            v-model:value="reactiveData[column.key]"
            v-bind="column?.inputProps"
          ></CSelect>
        </template>
        <template v-else-if="column?.inputProps?.inputType == 'select-search'">
          <CSelectSearch
            class="!w-full"
            v-model:value="reactiveData[column.key]"
            v-bind="column?.inputProps?.data"
          ></CSelectSearch>
        </template>
        <template v-else-if="column?.inputProps?.inputType == 'date'">
          <c-date-picker
            class="w-full"
            v-model:value="reactiveData[column.key]"
            placeholder="chọn ngày"
            allow-clear
          />
        </template>
      </template>
      <template
        v-else-if="
          (column.key == 'action' && hasColumnAction) ||
          (column.key == 'hidden-column' && !hasColumnAction)
        "
      >
        <a-dropdown
          placement="bottomRight"
          :trigger="['click']"
          overlay-class-name="!min-w-0"
          v-if="showSettingHiddenColumn"
        >
          <a-button class="!bg-primary-lighter" type="primary">
            <template #icon>
              <plus-outlined />
            </template>
          </a-button>
          <template #overlay>
            <a-menu style="min-width: 138px; padding: 16px">
              <a-checkbox-group
                class="flex flex-col gap-2"
                v-model:value="columnsSetting"
                name="checkboxgroup"
                :options="columnsSettingData"
                @change="updateColumn"
              />
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <!--      <template v-else-if="column.key == 'hidden-column' && !hasColumnAction">-->
      <!--        <a-dropdown-->
      <!--          placement="bottomRight"-->
      <!--          :trigger="['click']"-->
      <!--          overlay-class-name="!min-w-0"-->
      <!--          v-if="showSettingHiddenColumn"-->
      <!--        >-->
      <!--          <a-button class="!bg-primary-lighter" type="primary">-->
      <!--            <template #icon>-->
      <!--              <plus-outlined />-->
      <!--            </template>-->
      <!--          </a-button>-->
      <!--          <template #overlay>-->
      <!--            <a-menu style="min-width: 138px; padding: 16px">-->
      <!--              <a-checkbox-group-->
      <!--                class="flex flex-col gap-2"-->
      <!--                v-model:value="columnsSetting"-->
      <!--                name="checkboxgroup"-->
      <!--                :options="columnsSettingData"-->
      <!--                @change="updateColumn"-->
      <!--              />-->
      <!--            </a-menu>-->
      <!--          </template>-->
      <!--        </a-dropdown>-->
      <!--      </template>-->
    </template>

    <!-- BODY CELL -->
    <template #bodyCell="{ text, record, column }">
      <template
        v-if="
          typeof editableData[record[primaryKey]] == 'object' && editableData[record[primaryKey]]
        "
      >
        <template v-if="column.key == 'action'">
          <!-- <div class="flex-center gap-4"> -->
          <a-space>
            <a-popconfirm
              title="Chắc chắn hủy bỏ?"
              okText="có"
              cancelText="không"
              @confirm="cancleEdit(record[primaryKey])"
            >
              <!-- <a-button>Hủy</a-button> -->
              <!-- <a-button
                  ><template #icon> <close-circle-outlined /></template
                ></a-button> -->
              <a-tooltip>
                <template #title>Hủy</template>
                <close-circle-outlined class="text-lg text-error cursor-pointer" />
              </a-tooltip>
            </a-popconfirm>
            <!-- <a-button type="primary" @click="handleSubmitRowEdit(record[primaryKey])">Lưu</a-button> -->
            <!-- <a-button type="primary" @click="handleSubmitRowEdit(record[primaryKey])"
                ><template #icon> <save-outlined /></template
              ></a-button> -->
            <a-tooltip>
              <template #title>Lưu</template>
              <check-outlined
                class="text-lg text-success cursor-pointer"
                @click="handleSubmitRowEdit(record[primaryKey])"
              />
            </a-tooltip>
          </a-space>
          <!-- </div> -->
        </template>
        <slot v-else name="editableBox" :key="column.key" :id="record[primaryKey]">
          <template v-if="column?.noEdit">
            <span>-</span>
          </template>
          <template v-else-if="column?.inputProps?.inputType == 'text'">
            <a-input v-model:value="editableData[record[primaryKey]][column.key]" />
          </template>
          <template v-else-if="column?.inputProps?.inputType == 'number'">
            <a-input-number
              class="!w-full"
              v-model:value="editableData[record[primaryKey]][column.key]"
            />
          </template>
          <template v-else-if="column?.inputProps?.inputType == 'select'">
            <CSelect
              class="!w-full"
              v-model:value="editableData[record[primaryKey]][column.key]"
              v-bind="column?.inputProps"
            ></CSelect>
          </template>
          <template v-else-if="column?.inputProps?.inputType == 'select-search'">
            <CSelectSearch
              class="!w-full"
              v-model:value="editableData[record[primaryKey]][column.key]"
              v-bind="column?.inputProps?.data"
            ></CSelectSearch>
          </template>
          <template v-else-if="column?.inputProps?.inputType == 'check-number'">
            <CCheckboxNumber
              v-model="editableData[record[primaryKey]][column.key]"
              v-bind="column?.inputProps"
              >{{ column?.inputProps?.data?.label }}
            </CCheckboxNumber>
          </template>
          <!-- <template v-else-if="column?.inputProps?.inputType == 'image'">
            <CImage
              v-model="editableData[record[primaryKey]][column.key]"
              type="multiple"
              v-bind="column?.inputProps"
            ></CImage>
          </template> -->
          <template v-else><p class="text-center">-</p></template>
        </slot>
      </template>
      <template v-else-if="column.keyLabel">
        <slot name="bodyCell" :text="getRowLabel(column, record)" :record="record" :column="column">
          {{ getRowLabel(column, record) }}
        </slot>
      </template>
      <slot
        name="bodyCell"
        :text="text"
        :record="record"
        :column="column"
        :index="getIndex(record[primaryKey])"
        v-else
      ></slot>
    </template>

    <!-- EXPAND CELL -->

    <template #expandedRowRender="{ record, index, indent, expanded }" v-if="expandColumn">
      <slot
        name="expandedRowRender"
        :index="index"
        :record="record"
        :indent="indent"
        :expanded="expanded"
        >{{ expanded }}{{ expandedRowKeys }}
      </slot>
    </template>

    <template #expandColumnTitle></template>

    <!-- FOOTER -->

    <template #footer v-if="dbClick || $slots.footer">
      <span class="italic" v-if="dbClick">*nhấn đúp để chỉnh sửa nhanh</span>
      <slot name="footer" v-else></slot>
    </template>


    <template #summary v-if="$slots.summary">
      <slot name="summary"></slot>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed, reactive, watch } from 'vue'
import type { COLUMN_TYPE } from '@/types/table'
import { useDebounce } from '@/utils/debounce'
import CSelect from '../select/CSelect.vue'
import CSelectSearch from '../select/CSelectSearch.vue'
import CImage from '../upload/CImage.vue'
import CCheckboxNumber from '../checkbox/CCheckboxNumber.vue'
import dayjs from 'dayjs'
import { DATE_REQUEST_FORMAT } from '@/utils/dayjs-helper'
import { PlusOutlined, CloseCircleOutlined, CheckOutlined } from '@ant-design/icons-vue'
import CDatePicker from '@/components/common/date-picker/CDatePicker.vue'

type Props = {
  columns: COLUMN_TYPE[]
  data: any
  primaryKey?: string
  dbClick?: boolean
  meta?: MetaResponse | null
  rowClick?: (item: any) => void
  bordered?: boolean
  widthScrollX?: number | string | boolean
  
  //EXPAND
  expandColumn?: boolean
  expandTitle?: string

  //SELECTION
  selectionColumn?: boolean
  selectedRowKeys?: any
}

const props = withDefaults(defineProps<Props>(), {
  primaryKey: 'id',
  bordered: true,
  widthScrollX: 1500
})

const emits = defineEmits<{
  (e: 'getData', id: any): void
  (e: 'startEditRow', id: any): void
  (e: 'update:selectedRowKeys', id: any): void
  (e: 'editRow', id: any, data: any): void
}>()

const selectedRowKeysResult = computed({
  set(value: any) {
    emits('update:selectedRowKeys', value)
  },
  get() {
    return props.selectedRowKeys
  }
})

const dataRender = computed(() => {
  return props.data.map((e: any) => ({ ...e, key: e[props.primaryKey] }))
})
const rowSelectionConfig = computed<any>(() => {
  if (!props.selectionColumn) return undefined
  return { selectedRowKeys: selectedRowKeysResult.value, onChange: onSelectChange, fixed: true }
})
const columnsSettingData = computed<{ label: string; value: string }[]>(() => {
  return props.columns
    .map((e: COLUMN_TYPE) => {
      return {
        label: e.title,
        value: typeof e.key === 'string' ? e.key : e.key?.name || ''
      }
    })
    .filter((e) => e.value != 'action')
})
const showSettingHiddenColumn = computed(() => props.columns.find((e) => e.hidden))
const hasColumnAction = computed(() => columnsData.value.find((e: any) => e.key == 'action'))
const hasFilter = computed(() => props.columns.some((e) => e.isFilter))
const columnsRender = computed(() => {
  if (!showSettingHiddenColumn.value) return columnsData.value
  else {
    let result: any = columnsData.value.filter((e: any) => {
      return columnsSetting.value.includes(e.key) || e.key == 'action'
    })
    if (result.length == 0) {
      result.push({
        title: '',
        key: '',
        dataIndex: ''
      })
    }
    if (!hasColumnAction.value) {
      result.push({
        title: '',
        key: 'hidden-column',
        dataIndex: 'hidden-column',
        resizable: false,
        align: 'center',
        width: 20
      })
    }
    if (hasFilter.value) {
      result = getColumnsDataWithFilter(result)
    }
    return result
  }
})
// const columnsRender = computed(() => formatColumn())
const moveToChild = (array: any, child_key: string, parent_key: string) => {
  const sourceIndex = array.findIndex((item: any) => item.key === child_key)
  if (sourceIndex === -1) {
    return
  }
  const sourceItem = array[sourceIndex]
  array.splice(sourceIndex, 1)
  const targetIndex = array.findIndex((item: any) => item.key === parent_key)
  if (targetIndex === -1) {
    return
  }
  if(array[targetIndex].children == undefined){
    array[targetIndex].children = []
  }
  array[targetIndex].children.push(sourceItem)
  array[targetIndex].align = 'center'
  return array
}
const formatColumn = () => {
  const hasFilter = props.columns.some((e) => e.isFilter)
  const hasChildrenKey = props.columns.some((e) => e.childrenKeys?.length)
  let result = props.columns.map((e: COLUMN_TYPE) => {
    const key = typeof e.key === 'string' ? e.key : e.key?.name || ''
    let width = e.width
    if(width == 'sm') width = 100
    else if(width == 'md') width = 150
    else if(width == 'lg') width = 200
    else if(width == 'xl') width = 300
    // const currentWidth = columnsRender.value.find((e))
    return {
      title: e.title,
      key: key,
      childrenKeys: e.childrenKeys ?? [],
      keyValue: typeof e.key == 'object' ? e.key?.value : '',
      keyLabel: typeof e.key == 'object' ? e.key?.label : '',
      dataIndex: key,
      align: key == 'action' ? 'center' : e.align || 'center',
      resizable: e.noResizable ? false : false,
      sorter: e.sorter,
      width: key == 'action' ? 80 : width,
      fixed: e.fixed,
      noEdit: e.noEdit,
      inputProps: e.inputProps,
      schemaType: e.schemaType,
      schemaOption: e.schemaOption,
      customCell: e.customCell
    }
  })

  if (hasFilter) {
    result = getColumnsDataWithFilter(result)
  }
  if (hasChildrenKey) {
    result.forEach((e) => {
      if (e.childrenKeys?.length) {
        e.childrenKeys?.forEach((key) => {
          result = moveToChild(result, key, e.key)
        })
      }
    })
  }
  return result
}

const getColumnsDataWithFilter = (data: any) => {
  return data.map((e: any) => {
    let children = []
    if (!e.childrenKeys?.length) {
      children.push({
        title: '',
        dataIndex: e.dataIndex,
        key: e.key,
        keyValue: e.keyValue,
        keyLabel: e.keyLabel,
        isFilter: true,
        noEdit: e.noEdit,
        width: e.width,
        resizable: e.resizable,
        align: e.align,
        inputProps: e.inputProps,
        schemaType: e.schemaType,
        schemaOption: e.schemaOption,
        customCell: e.customCell
      })
    }
    return {
      ...e,
      children
    }
  })
}

const dataKey = {} as any
props.columns.forEach((e) => {
  const key = typeof e.key == 'string' ? e.key : e.key?.name || ''
  dataKey[key] = null as any
})
const reactiveData = reactive({ ...dataKey, sort: '' as string | undefined, page: 1 })
const editableData = ref<any>({})
const columnsData = ref(formatColumn())
const expandedRowKeys = ref<string[]>([])
const columnsSetting = ref<string[]>(
  props.columns
    .filter((e) => !e.hidden)
    .map((e: COLUMN_TYPE) => (typeof e.key == 'string' ? e.key : e?.key?.name || ''))
)
// const selectedRowKeys = ref<any>([])

onMounted(() => {})

onUnmounted(() => {})

const handleResizeColumn = (w: number, col: any) => {
  console.log(col)
  if (col?.children?.length) {
    col.children[0].width = w
  } else col.width = w
}

const handleCustomRow = (record: any) => ({
  onClick: (event: any) => {
    if (props.rowClick) props.rowClick(record)
  }, // click row
  onDblclick: (event: any) => {
    if (props.dbClick) {
      handleEditRow(record)
    }
  }, // double click row
  onContextmenu: (event: any) => {}, // right button click row
  onMouseenter: (event: any) => {}, // mouse enter row
  onMouseleave: (event: any) => {} // mouse leave row
})

const handleEditRow = (item: any) => {
  editableData.value[item[props.primaryKey]] = {
    ...props.data.find((e: any) => e[props.primaryKey] == item[props.primaryKey])
  }
  emits('startEditRow', item[props.primaryKey])
}

const cancleEdit = (id: string) => {
  delete editableData.value[id]
}

const handleSubmitRowEdit = (id: string) => {
  let data = editableData.value[id]
  for (let i in editableData.value[id]) {
    const column = props.columns.find(
      (col) => i == (typeof col.key == 'string' ? col.key : col.key?.value)
    )
    if (column?.noEdit || !column?.inputProps) {
      delete data[i]
    }
    // else if (column.inputProps?.inputType == 'date') {
    //   data[i] = dayjs(data[i]).format(DATE_REQUEST_FORMAT)
    // }
  }
  emits('editRow', id, data)
  delete editableData.value[id]
}

const getRowLabel = (column: any, record: any) => {
  if (column?.keyLabel) {
    const key_data = column.keyLabel.split(',')
    let result = record
    if (key_data.length > 0) {
      for (let i = 0; i < key_data.length; i++) {
        result = result[key_data[i]] || ''
      }
    }
    return result
  }
  return ''
}

const getIndex = (key: any): number => {
  return props.data.findIndex((e: any) => e[props.primaryKey] == key)
}

const handlePageChange = (pagination: any) => {
  console.log(pagination)
}

const onSelectChange = (data: any) => {
  selectedRowKeysResult.value = [...data]
}

const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  reactiveData.page = pagination?.current || 1
  //SORT
  let sort_data = [] as any
  let sort_result = [] as any
  if (sorter.length >= 0) sort_data = sorter
  else sort_data = [sorter]

  sort_data.forEach((sort: any) => {
    if (sort && sort.columnKey) {
      if (sort.order == 'descend') {
        sort_result.push(sort.columnKey)
      } else if (sort.order == 'ascend') {
        sort_result.push('-' + sort.columnKey)
      }
    }
  })

  reactiveData.sort = sort_result.toString() ? sort_result.toString() : undefined
  handleFilter()
}

const handleFilter = useDebounce(() => {
  let data = { ...reactiveData }
  for (let i in reactiveData) {
    const column = props.columns.find(
      (col) => i == (typeof col.key == 'string' ? col.key : col.key?.value)
    )
    if (column?.inputProps?.inputType == 'date') {
      data[i] = data[i] ? dayjs(data[i]).format(DATE_REQUEST_FORMAT) || '' : undefined
    }
    if (data[i] === '') delete data[i]
  }

  emits('getData', data)
}, 400)

const updateColumn = () => {
  columnsData.value = formatColumn()
}

watch(
  reactiveData,
  () => {
    handleFilter()
  },
  { deep: true }
)

defineExpose({ updateColumn, reactiveData })
</script>
