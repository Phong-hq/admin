import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { useSelectDataStore } from '@/stores/select_data'
import type { INVENTORY_LIST_RESPONSE } from '@/types/setting/inventory'
import { useRootStore } from '@/stores/root'

export const useInventoryStore = defineStore('inventoryStore', {
  state: () => ({
    inventoryDetail: null as INVENTORY_LIST_RESPONSE | null
  }),
  getters: {},
  actions: {
    getInventoryList(params?: any): Promise<DataWithMetaResponse<INVENTORY_LIST_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<INVENTORY_LIST_RESPONSE[]> = await axios.get(
            '/api/v1/admin/setting/inventory',
            { params }
          )

          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    createInventory(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/setting/inventory/create', data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateInventory(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/setting/inventory/update?id=' + data.id, data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    deleteInventory(data: INVENTORY_LIST_RESPONSE): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const rootStore = useRootStore()
          await rootStore.confirm({headerTitle: 'Xóa kho', bodyTitle:`Bạn chắc chắn muốn xóa kho '${data.name}' không?`})

          const res = await axios.post('/api/v1/admin/setting/inventory/delete?id=' + data.id, data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    reloadSelectList() {
      const selectDataStore = useSelectDataStore()
    }
  }
})
