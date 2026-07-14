import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { useRootStore } from '@/stores/root'

import type { FEEDBACK_RESPONSE } from '@/types/feedback/feedback'

export const useFeedbackStore = defineStore('feedbackStore', {
  state: () => ({
    feedbackList: [] as FEEDBACK_RESPONSE[]
  }),
  getters: {},
  actions: {
    async getFeedbackList(params?: any): Promise<DataWithMetaResponse<FEEDBACK_RESPONSE[]>> {
      return new Promise<DataWithMetaResponse<FEEDBACK_RESPONSE[]>>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<FEEDBACK_RESPONSE[]> = await axios.get(
            '/api/v1/admin/feedback/feedback',
            {
              params
            }
          )
          this.feedbackList = res.items
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    async deleteFeedback(data: FEEDBACK_RESPONSE): Promise<FEEDBACK_RESPONSE> {
      return new Promise<FEEDBACK_RESPONSE>(async (resolve, reject) => {
        try {
          const rootStore = useRootStore()
          await rootStore.confirm({
            headerTitle: 'Xóa phản hồi',
            bodyTitle: `Bạn chắc chắn muốn xóa phản hồi '${data.subject}' không?`
          })

          const res: FEEDBACK_RESPONSE = await axios.post(
            '/api/v1/admin/feedback/feedback/delete?id=' + data.id
          )
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
})
