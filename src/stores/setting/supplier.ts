import { defineStore } from 'pinia'
import axios from '@/plugins/axios'

import { useSelectDataStore } from '@/stores/select_data'
import type { SUPPLIER_RESPONSE } from '@/types/setting/supplier'
import { useRootStore } from '@/stores/root'

export const useSupplierStore = defineStore('supplierStore', {
  state: () => ({
    supplierList: [] as any
  }),
  getters: {},
  actions: {
    async getSupplierList(params?: any): Promise<DataWithMetaResponse<any>> {
      return new Promise<DataWithMetaResponse<any>>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<any> = await axios.get('/api/v1/admin/setting/supplier', {
            params
          })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async getSupplierDetail(id: any): Promise<SUPPLIER_RESPONSE> {
      return new Promise<SUPPLIER_RESPONSE>(async (resolve, reject) => {
        try {
          const res: {supplier: SUPPLIER_RESPONSE} = await axios.get('/api/v1/admin/setting/supplier/view?id=' + id)
          resolve(res?.supplier)
        } catch (error) {
          reject(error)
        }
      })
    },
    createSupplier(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/setting/supplier/create', data)
          this.reloadSelectList()
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateSupplier(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/setting/supplier/update?id=' + data.id, data)
          this.reloadSelectList()
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    deleteSupplier(data: SUPPLIER_RESPONSE): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const rootStore = useRootStore()
          await rootStore.confirm({headerTitle: 'Xóa bộ phận', bodyTitle:`Bạn chắc chắn muốn xóa nhà cung cấp '${data.name}' không?`})

          const res = await axios.post('/api/v1/admin/setting/supplier/delete?id=' + data.id, data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    reloadSelectList() {
      const selectDataStore = useSelectDataStore()
      selectDataStore.hasChange.supplier = true
    }
  }
})
