import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { useSelectDataStore } from '@/stores/select_data'
import type { DEPARTMENT_RESPONSE } from '@/types/setting/department'
import { useRootStore } from '@/stores/root'

export const useDepartmentStore = defineStore('departmentStore', {
  state: () => ({
    departmentDetail: null as DEPARTMENT_RESPONSE | null
  }),
  getters: {},
  actions: {
    getDepartmentList(params?: any): Promise<DataWithMetaResponse<DEPARTMENT_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<DEPARTMENT_RESPONSE[]> = await axios.get(
            '/api/v1/admin/setting/department',
            { params }
          )

          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    getUserDetail(id: any): Promise<DEPARTMENT_RESPONSE> {
      return new Promise<DEPARTMENT_RESPONSE>(async (resolve, reject) => {
        try {
          if(this.departmentDetail != null && this.departmentDetail?.id == id) {
            resolve(this.departmentDetail)
            this.departmentDetail = null
            return
          }

          this.departmentDetail = null
          const res : {user: DEPARTMENT_RESPONSE} = await axios.get('/api/v1/admin/setting/user/view?id=' + id,)
          resolve(res.user)
        } catch (error) {
          reject(error)
        }
      })
    },
    createDepartment(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/setting/department/create', data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateDepartment(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/setting/department/update?id=' + data.id, data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    deleteDepartment(data: DEPARTMENT_RESPONSE): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const rootStore = useRootStore()
          await rootStore.confirm({headerTitle: 'Xóa bộ phận', bodyTitle:`Bạn chắc chắn muốn xóa bộ phận '${data.name}' không?`})

          const res = await axios.post('/api/v1/admin/setting/department/delete?id=' + data.id, data)
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
