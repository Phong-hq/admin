import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type { ORDER_RESPONSE } from '@/types/order/website'
import { getStatusLabel } from '@/constant/order'
import { useRootStore } from '@/stores/root'

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    // orderList: [] as ORDER_RESPONSE[],
    // orderMeta: null as MetaResponse | null
    orderDetail: null as ORDER_RESPONSE | null
  }),
  getters: {},
  actions: {
    getOrderList(params?: any): Promise<DataWithMetaResponse<ORDER_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<ORDER_RESPONSE[]> = await axios.get(
            '/api/v1/admin/order/website',
            { params }
          )

          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    getOrderDetail(id: any): Promise<ORDER_RESPONSE> {
      return new Promise<ORDER_RESPONSE>(async (resolve, reject) => {
        try {
          if (this.orderDetail && this.orderDetail.id == id) {
            resolve(this.orderDetail)
            this.orderDetail = null
            return
          }

          this.orderDetail = null
          const res: { order: ORDER_RESPONSE } = await axios.get(
            '/api/v1/admin/order/website/view',
            {
              params: {
                id: id,
                expand: 'order_items'
              }
            }
          )
          resolve(res.order)
        } catch (error) {
          reject(error)
        }
      })
    },

    updateOrderStatus(order: any, status: number): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        const rootStore = useRootStore()
        try {
          await rootStore.confirm({
            headerTitle: 'đổi trạng thái',
            bodyTitle: `Bạn có chắc chắn muốn thay đổi trạng thái của đơn hàng ${order?.code} thành '${getStatusLabel(status)}' không?`
          })
          const res: any = await axios.post(
            `/api/v1/admin/order/website/change-status?id=${order?.id}&expand=order_items`,
            { status }
          )
          resolve(res?.order ?? res)
        } catch (error) {
          reject(error)
        }
      })
    },

    updateOrder(data: any): Promise<ORDER_RESPONSE> {
      return new Promise<ORDER_RESPONSE>(async (resolve, reject) => {
        try {
          const res: {
            order: ORDER_RESPONSE
          } = await axios.post(
            `/api/v1/admin/order/website/update?id=${data?.id}&expand=order_items`,
            data
          )
          resolve(res.order)
        } catch (error) {
          reject(error)
        }
      })
    },
    createOrder(data?: any): Promise<ORDER_RESPONSE> {
      return new Promise<ORDER_RESPONSE>(async (resolve, reject) => {
        try {
          const res: {
            order: ORDER_RESPONSE
          } = await axios.post('/api/v1/admin/order/website/create', data)
          resolve(res.order)
        } catch (error) {
          reject(error)
        }
      })
    },

    updateOrderProduct(
      id: any,
      data: {
        product_id: number
        product_variant_id: number
        quantity: number
      }
    ): Promise<ORDER_RESPONSE> {
      return new Promise<ORDER_RESPONSE>(async (resolve, reject) => {
        try {
          const res: {
            order: ORDER_RESPONSE
          } = await axios.post(
            `/api/v1/admin/order/website/add-order-item?id=${id}&expand=order_items`,
            data
          )
          resolve(res.order)
        } catch (error) {
          reject(error)
        }
      })
    },

    removeOrderProduct(id: any, order_item_id: number): Promise<ORDER_RESPONSE> {
      return new Promise<ORDER_RESPONSE>(async (resolve, reject) => {
        try {
          const res: {
            order: ORDER_RESPONSE
          } = await axios.post(
            `/api/v1/admin/order/website/remove-order-item?id=${id}&order_item_id=${order_item_id}`
          )
          resolve(res.order)
        } catch (error) {
          reject(error)
        }
      })
    },

    addOrderPromotion(
      id: any,
      data: {
        discount_type: number
        discount_value: number
        promotion_code: number
      }
    ): Promise<ORDER_RESPONSE> {
      return new Promise<ORDER_RESPONSE>(async (resolve, reject) => {
        try {
          const res: {
            order: ORDER_RESPONSE
          } = await axios.post(
            `/api/v1/admin/order/website/add-promotion?id=${id}&expand=order_items`
          )
          resolve(res.order)
        } catch (error) {
          reject(error)
        }
      })
    },

    updateBrand(id: any, data?: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/product/brand/update?id=' + id, data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    deleteBrand(id: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/product/brand/delete?id=' + id)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    setWaitingOrder(data: any) {
      this.orderDetail = data
    }
  }
})
