import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import {useRootStore} from '@/stores/root'

import type { CONTACT_RESPONSE } from '@/types/customer/contact'

export const useContactStore = defineStore('contactStore', {
  state: () => ({
    contactList: [] as CONTACT_RESPONSE[]
  }),
  getters: {},
  actions: {
    async getContactList(params?: any): Promise<DataWithMetaResponse<CONTACT_RESPONSE[]>> {
      return new Promise<DataWithMetaResponse<CONTACT_RESPONSE[]>>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<CONTACT_RESPONSE[]> = await axios.get(
            '/api/v1/admin/person/contact',
            {
              params
            }
          )
          this.contactList = res.items
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async createContact(data: any): Promise<CONTACT_RESPONSE> {
      return new Promise<CONTACT_RESPONSE>(async (resolve, reject) => {
        try {
          const res: CONTACT_RESPONSE = await axios.post('/api/v1/admin/person/contact/create', data)
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async updateContact(data: any): Promise<CONTACT_RESPONSE> {
      return new Promise<CONTACT_RESPONSE>(async (resolve, reject) => {
        try {
          const res: CONTACT_RESPONSE = await axios.post(
            '/api/v1/admin/person/contact/update?id=' + data.id,
            data
          )
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async deleteContact(data: CONTACT_RESPONSE): Promise<CONTACT_RESPONSE> {
      return new Promise<CONTACT_RESPONSE>(async (resolve, reject) => {
        try {
          const rootStore = useRootStore()
          await rootStore.confirm({
            headerTitle: 'Xóa liên hệ',
            bodyTitle: `Bạn chắc chắn muốn xóa liên hệ '${data.name}' không?`
          })

          const res: CONTACT_RESPONSE = await axios.post('/api/v1/admin/person/contact/delete?id=' + data.id)
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
  }
})
