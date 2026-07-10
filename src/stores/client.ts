import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type { CLIENT_RESPONSE } from '@/types/person/client'

export const useClientStore = defineStore('clientStore', {
  state: () => ({
    clientDetail: null as CLIENT_RESPONSE | null
  }),
  getters: {},
  actions: {
    getClientList(params?: any): Promise<DataWithMetaResponse<CLIENT_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<CLIENT_RESPONSE[]> = await axios.get(
            '/api/v1/admin/person/client',
            { params }
          )
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    getClientDetail(id: any): Promise<CLIENT_RESPONSE> {
      return new Promise<CLIENT_RESPONSE>(async (resolve, reject) => {
        try {
          if (this.clientDetail && this.clientDetail.id == id) {
            resolve(this.clientDetail)
            this.clientDetail = null
            return
          }

          this.clientDetail = null
          const res: { client: CLIENT_RESPONSE } = await axios.get('/api/v1/admin/person/client/view', {
            params: {
              id: id,
            }
          })
          resolve(res.client)
        } catch (error) {
          reject(error)
        }
      })
    },

    setClientWaiting(data: any) {
      this.clientDetail = data
    }
  }
})
