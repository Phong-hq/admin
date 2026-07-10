import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type {
  RECEIPT_RESPONSE,
  STOCKTAKING_RESPONSE,
  INVENTORY_RESPONSE,
  INVENTORY_HISTORY_RESPONSE,
  ISSUE_RESPONSE,
  INVENTORY_HISTORY_MODULE_RESPONSE
} from '@/types/inventory/inventory'
import { getStatusLabel, RECEIPT_STATUS } from '@/constant/receipt'
import { useRootStore } from '@/stores/root'

export const useInventoryStore = defineStore('inventoryStore', {
  state: () => ({
    receiptDetail: null as RECEIPT_RESPONSE | null,
    issueDetail: null as ISSUE_RESPONSE | null,
    stocktakingDetail: null as STOCKTAKING_RESPONSE | null
  }),
  getters: {},
  actions: {
    //INVENTORY
    getInventoryList(params?: any): Promise<DataWithMetaResponse<INVENTORY_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<INVENTORY_RESPONSE[]> = await axios.get(
            '/api/v1/admin/product/inventory',
            { params }
          )
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    getInventoryDetail(id: any): Promise<INVENTORY_RESPONSE> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: { product_inventory: INVENTORY_RESPONSE } = await axios.get(
            '/api/v1/admin/product/inventory/view?id=' + id
          )
          resolve(res.product_inventory)
        } catch (error) {
          reject(error)
        }
      })
    },
    getInventoryHistory(params?: any): Promise<DataWithMetaResponse<INVENTORY_HISTORY_RESPONSE[]>> {
      return new Promise<DataWithMetaResponse<INVENTORY_HISTORY_RESPONSE[]>>(
        async (resolve, reject) => {
          try {
            const res: DataWithMetaResponse<INVENTORY_HISTORY_RESPONSE[]> = await axios.get(
              '/api/v1/admin/inventory/history',
              { params }
            )
            resolve(res)
          } catch (error) {
            reject(error)
          }
        }
      )
    },
    exportInventory(params?: any): Promise<string> {
      return new Promise<string>(async (resolve, reject) => {
        try {
          const res: string = await axios.get('/api/v1/admin/product/inventory/export', {
            params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            responseType: 'blob'
          })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    viewInventoryModule(
      id: any
    ): Promise<{ result: INVENTORY_HISTORY_MODULE_RESPONSE; type: number }> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: { result: INVENTORY_HISTORY_MODULE_RESPONSE; type: number } = await axios.get(
            '/api/v1/admin/inventory/history/view-module?id=' + id
          )
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },

    //RECEIPT

    getReceiptList(params?: any): Promise<DataWithMetaResponse<RECEIPT_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<RECEIPT_RESPONSE[]> = await axios.get(
            '/api/v1/admin/inventory/receipt',
            {
              params
            }
          )

          // this.receiptList = res.items
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    exportReceipt(params?: any): Promise<string> {
      return new Promise<string>(async (resolve, reject) => {
        try {
          const res: string = await axios.get('/api/v1/admin/inventory/receipt/export-overview', {
            params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            responseType: 'blob'
          })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    getReceiptDetail(id: any): Promise<RECEIPT_RESPONSE> {
      return new Promise<RECEIPT_RESPONSE>(async (resolve, reject) => {
        try {
          if (this.receiptDetail && this.receiptDetail.id == id) {
            resolve(this.receiptDetail)
            this.receiptDetail = null
            return
          }

          const res: { receipt: RECEIPT_RESPONSE } = await axios.get(
            '/api/v1/admin/inventory/receipt/view?id=' + id
          )
          resolve(res?.receipt)
        } catch (error) {
          reject(error)
        }
      })
    },
    createReceipt(data: any): Promise<RECEIPT_RESPONSE> {
      return new Promise<RECEIPT_RESPONSE>(async (resolve, reject) => {
        try {
          const res: { receipt: RECEIPT_RESPONSE } = await axios.post(
            '/api/v1/admin/inventory/receipt/create',
            data
          )
          resolve(res.receipt)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateReceipt(data: any): Promise<RECEIPT_RESPONSE> {
      return new Promise<RECEIPT_RESPONSE>(async (resolve, reject) => {
        try {
          const res: { receipt: RECEIPT_RESPONSE } = await axios.post(
            '/api/v1/admin/inventory/receipt/update?id=' + data?.id,
            data
          )
          resolve(res.receipt)
        } catch (error) {
          reject(error)
        }
      })
    },
    changeReceiptStatus(type: any, data: any): Promise<RECEIPT_RESPONSE> {
      return new Promise<RECEIPT_RESPONSE>(async (resolve, reject) => {
        try {
          let typeRequest = ''
          if(type == RECEIPT_STATUS.Done) typeRequest = 'done'
          else if(type == RECEIPT_STATUS.Approved) typeRequest = 'approved'
          else if(type == RECEIPT_STATUS.Cancel) typeRequest = 'cancel'
          const rootStore = useRootStore()
          await rootStore.confirm({
            headerTitle: 'đổi trạng thái',
            bodyMessage: `Bạn có chắc chắn muốn thay đổi trạng thái của phiếu nhập hàng ${data?.code} thành '${getStatusLabel(type)}' không?`
          })
          const res: {
            receipt: RECEIPT_RESPONSE
          } = await axios.post(`/api/v1/admin/inventory/receipt/${typeRequest}?id=` + data?.id)
          resolve(res.receipt)
        } catch (error) {
          reject(error)
        }
      })
    },
    setWaitingReceiptDetail(item: any) {
      this.receiptDetail = item
    },

    setWaitingIssueDetail(item: any) {
      this.issueDetail = item
    },

    setWaitingStocktakingDetail(item: any) {
      this.stocktakingDetail = item
    },

    getStocktakingList(params?: any): Promise<DataWithMetaResponse<STOCKTAKING_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<STOCKTAKING_RESPONSE[]> = await axios.get(
            '/api/v1/admin/inventory/stocktaking',
            { params }
          )

          // this.receiptList = res.items
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },

    getStocktakingDetail(id: any): Promise<STOCKTAKING_RESPONSE> {
      return new Promise<STOCKTAKING_RESPONSE>(async (resolve, reject) => {
        try {
          if (this.stocktakingDetail && this.stocktakingDetail.id == id) {
            resolve(this.stocktakingDetail)
            this.stocktakingDetail = null
            return
          }

          this.stocktakingDetail = null
          const res: { stocktaking: STOCKTAKING_RESPONSE } = await axios.get(
            '/api/v1/admin/inventory/stocktaking/view?id=' + id
          )
          resolve(res?.stocktaking)
        } catch (error) {
          reject(error)
        }
      })
    },

    createStocktaking(data: any) {
      return new Promise<STOCKTAKING_RESPONSE>(async (resolve, reject) => {
        try {
          const res: { receipt: STOCKTAKING_RESPONSE } = await axios.post(
            '/api/v1/admin/inventory/stocktaking/create',
            data
          )
          resolve(res.receipt)
        } catch (error) {
          reject(error)
        }
      })
    },

    //ISSUE

    getIssueList(params?: any): Promise<DataWithMetaResponse<ISSUE_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<RECEIPT_RESPONSE[]> = await axios.get(
            '/api/v1/admin/inventory/issue',
            {
              params
            }
          )

          // this.receiptList = res.items
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    exportIssue(params?: any): Promise<string> {
      return new Promise<string>(async (resolve, reject) => {
        try {
          const res: string = await axios.get('/api/v1/admin/inventory/issue/export-overview', {
            params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            responseType: 'blob'
          })
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    getIssueDetail(id: any): Promise<ISSUE_RESPONSE> {
      return new Promise<ISSUE_RESPONSE>(async (resolve, reject) => {
        try {
          if (this.issueDetail && this.issueDetail.id == id) {
            resolve(this.issueDetail)
            this.issueDetail = null
            return
          }

          this.issueDetail = null
          const res: { inventory_issue: ISSUE_RESPONSE } = await axios.get(
            '/api/v1/admin/inventory/issue/view?id=' + id
          )
          resolve(res?.inventory_issue)
        } catch (error) {
          reject(error)
        }
      })
    },

    changeIssueStatus(id: any, type: 'done' | 'cancel'): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/inventory/issue/cancel?id=' + id)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },

    createIssue(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/inventory/issue/create', data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },

    // getOrderDetail(id: any): Promise<ORDER_RESPONSE> {
    //   return new Promise<ORDER_RESPONSE>(async (resolve, reject) => {
    //     try {
    //       const available_Order = this.orderList.find(order => order.id === id)
    //       if(available_Order) {
    //         resolve(available_Order)
    //         return;
    //       }
    //
    //       const res: {order: ORDER_RESPONSE} = await axios.get('/api/v1/admin/order/website/view', {
    //         params: {
    //           id: id,
    //           expand: 'order_items'
    //         }
    //       })
    //       resolve(res.order)
    //     } catch (error) {
    //       reject(error)
    //     }
    //   })
    // },
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
    }
  }
})
