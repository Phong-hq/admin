/// <reference types="vite/client" />

// declare module 'frappe-datatable' {
//   export * from 'frappe-datatable'
// }

declare module 'frappe-datatable' {
  export default class DataTable {
    constructor(element: HTMLElement, options?: any)
    // Thêm các phương thức hoặc thuộc tính mà bạn cần
  }
}

declare module 'lodash.clonedeep' {
  import cloneDeep from 'lodash.clonedeep'
  export default cloneDeep
}
