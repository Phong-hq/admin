<template>
  <div class="relative">
    <!-- <div class="" :class="{ 'checkbox-column': checkboxColumn }" :id="'frappe-' + dataKey"></div>
    <div class="absolute inset-0 sc-full bg-[#5c5c5c9f]" v-if="loading"></div> -->
  </div>
</template>

<script lang="ts" setup>
// import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
// import 'frappe-datatable/dist/frappe-datatable.min.css'
// import '@/style/_frappe_table.scss'
// import DataTable from 'frappe-datatable'
// type COLUMN_TYPE = {
//   name: string
//   key: string
//   id: any
//   editable?: boolean
//   noResizable?: boolean
//   sortable?: boolean
//   focusable?: boolean
//   dropdown?: boolean
//   width?: number
//   format?: (value: string, item: any) => string
// }
// type Props = {
//   columns: COLUMN_TYPE[]
//   data: any
//   DbClick?: boolean
//   dataKey?: string
//   clickEvent?: boolean
//   rowSelected?: any
//   checkboxColumn?: boolean
//   cellHeight?: number
//   loading?: boolean
// }

// const props = withDefaults(defineProps<Props>(), {})

// const emits = defineEmits<{
//   (e: 'update:rowSelected', id: any): void
// }>()

// const rowSelected = computed({
//   get() {
//     return props.rowSelected || []
//   },
//   set(value) {
//     emits('update:rowSelected', value)
//   }
// })

// const columns_format = computed(() => {
//   return props.columns.map((column) => {
//     let item = {
//       name: column.name,
//       id: column.key,
//       editable: column.editable || false,
//       resizable: !column.noResizable,
//       sortable: column.sortable || false,
//       focusable: column.focusable || true,
//       dropdown: column.dropdown || false,
//       width: column.width || undefined
//     } as any
//     if (typeof column.format === 'function') {
//       item.format = (value: string) => {
//         const item = props.data.find((e: any) => e.id == value)
//         return typeof column.format === 'function' ? column.format(value, item) : ''
//       }
//     }

//     return item
//   })
// })

// const data_format = computed(() => {
//   return props.data.map((item: any) => {
//     return props.columns.map((column: COLUMN_TYPE) => {
//       const key_data = column.key.split(',')
//       let result = item
//       if (key_data.length > 0) {
//         for (let i = 0; i < key_data.length; i++) {
//           result = result[key_data[i]] || ''
//         }
//       }
//       return result
//     })
//   })
// })

// const container = ref<any>(null)
// const table = ref<any>(null)

// onMounted(() => {})

// onUnmounted(() => {})

// const handleClick = (e: any) => {}

// const initTable = () => {
//   container.value = document.querySelector('#frappe-' + props.dataKey)
//   try {
//     if (DataTable && DataTable.constructor && typeof DataTable === 'function') {
//       table.value = new DataTable(container.value, {
//         columns: columns_format.value,
//         data: data_format.value,
//         layout: 'fluid',
//         checkboxColumn: props.checkboxColumn,
//         serialNoColumn: false,
//         cellHeight: props.cellHeight || 40,
//         getEditor(
//           colIndex: any,
//           rowIndex: any,
//           value: any,
//           parent: any,
//           column: any,
//           row: any,
//           data: any
//         ) {
//           const $input = document.createElement('input')
//           $input.className = 'dt-input'
//           parent.appendChild($input)
//           return {
//             initValue(value: any) {
//               $input.focus()
//               $input.value = value
//             },
//             setValue(value: any) {
//               $input.value = value
//             },
//             getValue() {
//               console.log($input.value)

//               return $input.value
//             }
//           }
//         },
//         pasteFromClipboard: true,
//         headerDropdown: [],
//         events: {
//           onCheckRow(row: any) {
//             rowSelected.value = Object.keys(table.value.rowmanager?.checkMap)
//           }
//         }
//       })

//       if (props.clickEvent) container.value?.addEventListener('click', handleClick)
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }

// watch(
//   () => props.data,
//   // () => props.columns,
//   () => {
//     container.value?.removeEventListener('click', handleClick)
//     initTable()
//   }
// )
</script>
