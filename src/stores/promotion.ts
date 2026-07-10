import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/plugins/axios'

import type { BRAND_RESPONSE } from '@/types/product/brand'
import type { CATEGORY_RESPONSE } from '@/types/product/category'
import type { PROMOTION_RESPONSE } from '@/types/promotion.d.ts'
// import type { SelectConfigItem } from '@/types'

export const usePromotionStore = defineStore('promotionStore', {
  state: () => ({
    // promotionList: [] as PROMOTION_RESPONSE[]
  }),
  getters: {},
  actions: {
    async getPromotionList(params?: any): Promise<DataWithMetaResponse<PROMOTION_RESPONSE[]>> {
      return new Promise<DataWithMetaResponse<PROMOTION_RESPONSE[]>>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<PROMOTION_RESPONSE[]> = await axios.get('/api/v1/admin/setting/promotion', {
            params
          })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async getPromotionDetail(id: any): Promise<PROMOTION_RESPONSE> {
      return new Promise<PROMOTION_RESPONSE>(async (resolve, reject) => {
        try {
          const res: { promotion: PROMOTION_RESPONSE } = await axios.get('/api/v1/admin/setting/promotion/view?id=' + id, )
          resolve(res.promotion)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
})
