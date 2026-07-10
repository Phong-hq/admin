import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { useRootStore } from '@/stores/root'

import type { CONTACT_RESPONSE } from '@/types/customer/contact'
import type {
  REVENUE_ORDER_RESPONSE,
  REVENUE_SUM_RESPONSE,
  REVENUE_VARIANT_RESPONSE
} from '@/types/revenue/revenue'

export const useRevenueStore = defineStore('revenueStore', {
  state: () => ({}),
  getters: {},
  actions: {
    async getRevenueList(params?: any): Promise<
      DataWithMetaResponse<REVENUE_ORDER_RESPONSE[]> & {
        sum_order: REVENUE_SUM_RESPONSE
      }
    > {
      return new Promise<
        DataWithMetaResponse<REVENUE_ORDER_RESPONSE[]> & {
          sum_order: REVENUE_SUM_RESPONSE
        }
      >(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<REVENUE_ORDER_RESPONSE[]> & {
            sum_order: REVENUE_SUM_RESPONSE
          } = await axios.get('/api/v1/admin/report/sale-order', {
            params
          })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async getRevenueVariantList(params?: any): Promise<
      DataWithMetaResponse<REVENUE_VARIANT_RESPONSE[]>
    > {
      return new Promise<
        DataWithMetaResponse<REVENUE_VARIANT_RESPONSE[]>
      >(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<REVENUE_VARIANT_RESPONSE[]> = await axios.get('/api/v1/admin/report/sale-order/product-variant', {
            params
          })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async createContact(data: any): Promise<CONTACT_RESPONSE> {
      return new Promise<CONTACT_RESPONSE>(async (resolve, reject) => {
        try {
          const res: CONTACT_RESPONSE = await axios.post(
            '/api/v1/admin/person/contact/create',
            data
          )
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

          const res: CONTACT_RESPONSE = await axios.post(
            '/api/v1/admin/person/contact/delete?id=' + data.id
          )
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
})
