import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type { BRAND_RESPONSE } from '@/types/product/brand'
import { useSelectDataStore } from '@/stores/select_data'

export const useBrandStore = defineStore('brandStore', {
  state: () => ({
    brandList: [] as BRAND_RESPONSE[],
    brandMeta: null as MetaResponse | null
  }),
  getters: {},
  actions: {
    getBrandList(params?: any): Promise<DataWithMetaResponse<BRAND_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<BRAND_RESPONSE[]> = await axios.get(
            '/api/v1/admin/product/brand',
            { params }
          )

          this.brandList = res.items
          this.brandMeta = res._meta
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    createBrand(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/product/brand/create', data)
          this.reloadSelectList()
          resolve(true)
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
    importBrand(file: File): Promise<ImportResponse> {
      return new Promise<ImportResponse>(async (resolve, reject) => {
        try {
          const formData = new FormData()
          formData.append('file', file)
          const res: ImportResponse = await axios.post(
            '/api/v1/admin/product/brand-import/import',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )
          this.reloadSelectList()
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    deleteBrand(id: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/product/brand/delete?id=' + id)
          this.reloadSelectList()
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    reloadSelectList() {
      const selectDataStore = useSelectDataStore()
      selectDataStore.hasChange.brand = true
    }
  }
})
