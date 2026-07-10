import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { useSelectDataStore } from '@/stores/select_data'
import type { DELIVERY_FEE_RESPONSE } from '@/types/setting/delivery-fee'
import { useRootStore } from '@/stores/root'

export const useDeliveryFeeStore = defineStore('deliveryFeeStore', {
  state: () => ({
    deliveryFeeDetail: null as DELIVERY_FEE_RESPONSE | null
  }),
  getters: {},
  actions: {
    getDeliveryFeeList(params?: any): Promise<DataWithMetaResponse<DELIVERY_FEE_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<DELIVERY_FEE_RESPONSE[]> = await axios.get(
            '/api/v1/admin/setting/delivery-fee',
            { params }
          )

          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    createDeliveryFee(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/setting/delivery-fee/create', data)
          this.reloadSelectList()
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateDeliveryFee(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/setting/delivery-fee/update?id=' + data.id, data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    deleteDeliveryFee(data: DELIVERY_FEE_RESPONSE): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const rootStore = useRootStore()
          await rootStore.confirm({headerTitle: 'Xóa chi nhánh', bodyTitle:`Bạn chắc chắn muốn xóa chi nhánh '${data.name}' không?`})

          const res = await axios.post('/api/v1/admin/setting/delivery-fee/delete?id=' + data.id, data)
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
