import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { useSelectDataStore } from '@/stores/select_data'
import type { OFFICE_RESPONSE } from '@/types/setting/office'
import { useRootStore } from '@/stores/root'

export const useOfficeStore = defineStore('officeStore', {
  state: () => ({
    officeDetail: null as OFFICE_RESPONSE | null
  }),
  getters: {},
  actions: {
    getOfficeList(params?: any): Promise<DataWithMetaResponse<OFFICE_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<OFFICE_RESPONSE[]> = await axios.get(
            '/api/v1/admin/setting/office',
            { params }
          )

          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    createOffice(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/setting/office/create', data)
          this.reloadSelectList()
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateOffice(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/setting/office/update?id=' + data.id, data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    deleteOffice(data: OFFICE_RESPONSE): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const rootStore = useRootStore()
          await rootStore.confirm({headerTitle: 'Xóa chi nhánh', bodyTitle:`Bạn chắc chắn muốn xóa chi nhánh '${data.name}' không?`})

          const res = await axios.post('/api/v1/admin/setting/office/delete?id=' + data.id, data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    reloadSelectList() {
      const selectDataStore = useSelectDataStore()
      selectDataStore.hasChange.office = true
    }
  }
})
