import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type { USER_RESPONSE } from '@/types/setting/user'
import { useSelectDataStore } from '@/stores/select_data'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userDetail: null as USER_RESPONSE | null
  }),
  getters: {},
  actions: {
    getUserList(params?: any): Promise<DataWithMetaResponse<USER_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<USER_RESPONSE[]> = await axios.get(
            '/api/v1/admin/setting/user',
            { params }
          )

          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    getUserDetail(id: any): Promise<USER_RESPONSE> {
      return new Promise<USER_RESPONSE>(async (resolve, reject) => {
        try {
          if(this.userDetail != null && this.userDetail?.id == id) {
            resolve(this.userDetail)
            this.userDetail = null
            return
          }

          this.userDetail = null
          const res : {user: USER_RESPONSE} = await axios.get('/api/v1/admin/setting/user/view?id=' + id,)
          resolve(res.user)
        } catch (error) {
          reject(error)
        }
      })
    },
    createUser(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/setting/user/create', data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateUser(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/setting/user/update?id=' + data.id, data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    setWaitingUser(data: USER_RESPONSE) {
      this.userDetail = data
    },
    reloadSelectList() {
      const selectDataStore = useSelectDataStore()
      selectDataStore.hasChange.brand = true
    }
  }
})
