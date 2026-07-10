import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type { PRODUCT_RESPONSE, PRODUCT_VARIANTS_RESPONSE } from '@/types/product/product'
import { useSelectDataStore } from '@/stores/select_data'

export const useProductStore = defineStore('productStore', {
  state: () => ({
    productList: [] as PRODUCT_RESPONSE[],
    productMeta: null as MetaResponse | null
  }),
  getters: {},
  actions: {
    getProductList(params?: any): Promise<DataWithMetaResponse<PRODUCT_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<PRODUCT_RESPONSE[]> = await axios.get(
            '/api/v1/admin/product/item',
            { params }
          )
          this.productList = res.items
          this.productMeta = res._meta
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    createProductItem(data?: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/product/item/create', data)
          this.reloadSelectList()
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    getProductItem(id?: any): Promise<PRODUCT_RESPONSE> {
      return new Promise<PRODUCT_RESPONSE>(async (resolve, reject) => {
        const produce = this.productList.find((item) => item.id === id)
        if (produce) {
          resolve(produce)
          return
        }
        try {
          const res: { product: PRODUCT_RESPONSE } = await axios.get(
            '/api/v1/admin/product/item/view?id=' + id
          )
          resolve(res.product)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateProductItem(id: any, data?: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: { product: PRODUCT_RESPONSE } = await axios.post(
            '/api/v1/admin/product/item/update?id=' + id,
            data
          )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    exportProduct(params?: any): Promise<string> {
      return new Promise<string>(async (resolve, reject) => {
        try {
          const res: string = await axios.get('/api/v1/admin/product/variant/export', {
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
    deleteProductItem(id: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: any = await axios.post('/api/v1/admin/product/item/delete?id=' + id)
          this.reloadSelectList()
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    getVariantList(params?: any): Promise<DataWithMetaResponse<PRODUCT_VARIANTS_RESPONSE[]>> {
      return new Promise<DataWithMetaResponse<PRODUCT_VARIANTS_RESPONSE[]>>(
        async (resolve, reject) => {
          try {
            const res: DataWithMetaResponse<PRODUCT_VARIANTS_RESPONSE[]> = await axios.get(
              '/api/v1/admin/product/variant',
              { params }
            )
            resolve(res)
          } catch (error) {
            reject(error)
          }
        }
      )
    },
    updateVariant(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: any = await axios.post(
            '/api/v1/admin/product/variant/update?id=' + data?.id,
            data
          )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    getVariant(id: any): Promise<PRODUCT_VARIANTS_RESPONSE> {
      return new Promise<PRODUCT_VARIANTS_RESPONSE>(async (resolve, reject) => {
        try {
          const res: { variant: PRODUCT_VARIANTS_RESPONSE } = await axios.get(
            '/api/v1/admin/product/variant/view?id=' + id
          )
          resolve(res?.variant)
        } catch (error) {
          reject(error)
        }
      })
    },
    reloadSelectList() {
      try {
        const selectDataStore = useSelectDataStore()
        selectDataStore.getVariantList(true)
      } catch (e) {
        console.log(e)
      }
    }
  }
})
