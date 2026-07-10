import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { useRootStore } from '@/stores/root'

import type { CUSTOMER_RESPONSE, CONTACT_CUSTOMER_RESPONSE, NOTE_CUSTOMER_RESPONSE } from '@/types/customer/customer'

export const useCustomerStore = defineStore('customerStore', {
  state: () => ({
    customerList: [] as CUSTOMER_RESPONSE[]
  }),
  getters: {},
  actions: {
    async getCustomerList(params?: any): Promise<DataWithMetaResponse<CUSTOMER_RESPONSE[]>> {
      return new Promise<DataWithMetaResponse<CUSTOMER_RESPONSE[]>>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<CUSTOMER_RESPONSE[]> = await axios.get(
            '/api/v1/admin/person/customer',
            {
              params
            }
          )
          // this.customerList = res.items
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },

    async removeCustomer(params: CUSTOMER_RESPONSE): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const rootStore = useRootStore()
          await rootStore.confirm({
            headerTitle: 'Xóa khách hàng',
            bodyTitle: `Bạn có chắc chắn muốn xóa khách hàng '${params?.name}' không?`
          })

          const res = await axios.post('/api/v1/admin/person/customer/delete?id=' + params.id, )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    async createCustomer(data?: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/person/customer/create', data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    getCustomerDetail(id: any): Promise<CUSTOMER_RESPONSE> {
      return new Promise<CUSTOMER_RESPONSE>(async (resolve, reject) => {
        try {
          const res: {customer: CUSTOMER_RESPONSE} = await axios.get('/api/v1/admin/person/customer/view', {
            params: {
              id,
              expand: 'count_contact,count_note,count_order'
            }
          })
          resolve(res.customer)
        } catch (error) {
          reject(error)
        }
      })
    },
    getContactCustomerDetail(customer_id: any): Promise<DataWithMetaResponse<CONTACT_CUSTOMER_RESPONSE[]>> {
      return new Promise<DataWithMetaResponse<CONTACT_CUSTOMER_RESPONSE[]>>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<CONTACT_CUSTOMER_RESPONSE[]> = await axios.get('/api/v1/admin/person/contact-customer', {
            params: {
              customer_id,
            }
          })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    getNoteCustomerDetail(customer_id: any): Promise<DataWithMetaResponse<NOTE_CUSTOMER_RESPONSE[]>> {
      return new Promise<DataWithMetaResponse<NOTE_CUSTOMER_RESPONSE[]>>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<NOTE_CUSTOMER_RESPONSE[]> = await axios.get('/api/v1/admin/person/customer-note', {
            params: {
              customer_id,
            }
          })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    addNoteCustomer(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/person/customer-note/create', data)
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    removeNoteCustomer(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const rootStore = useRootStore()
          await rootStore.confirm({headerTitle: 'Xóa ghi chú', bodyTitle: `Bạn có chắc chắn muốn xóa ghi chú này không?`})
          const res = await axios.post('/api/v1/admin/person/customer-note/delete?id=' + data?.id)
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    addContactCustomer(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/person/contact-customer/create', data)
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    removeContactCustomer(data: CONTACT_CUSTOMER_RESPONSE): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const rootStore = useRootStore()
          await rootStore.confirm({headerTitle: 'Xóa liên hệ', bodyMessage: `Bạn có chắc chắn muốn xóa liên hệ '${data.contact?.name}' không?`})
          const res = await axios.post('/api/v1/admin/person/contact-customer/delete?id=' + data.id)
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateCustomerDetail(data: any): Promise<CUSTOMER_RESPONSE> {
      return new Promise<CUSTOMER_RESPONSE>(async (resolve, reject) => {
        try {
          const res: {customer: CUSTOMER_RESPONSE} = await axios.post('/api/v1/admin/person/customer/update?id=' + data?.id,
           data
          )
          resolve(res.customer)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
})
