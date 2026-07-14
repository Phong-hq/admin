import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type { CATEGORY_RESPONSE } from '@/types/product/category'
import { useSelectDataStore } from '@/stores/select_data'

export const useCategoryStore = defineStore('categoryStore', {
  state: () => ({
    categoriesList: [] as CATEGORY_RESPONSE[],
    categoryMeta: null as MetaResponse | null
  }),
  getters: {},
  actions: {
    getCategoryList(params?: any): Promise<DataWithMetaResponse<CATEGORY_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<CATEGORY_RESPONSE[]> = await axios.get(
            '/api/v1/admin/product/category',
            { params }
          )
          this.categoriesList = res.items
          this.categoryMeta = res._meta
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    createCategory(data?: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/product/category/create', data)
          this.reloadSelectList()
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateCategory(id: any, data?: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/product/category/update?id=' + id, data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    importCategory(file: File): Promise<ImportResponse> {
      return new Promise<ImportResponse>(async (resolve, reject) => {
        try {
          const formData = new FormData()
          formData.append('file', file)
          const res: ImportResponse = await axios.post(
            '/api/v1/admin/product/category-import/import',
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
    deleteCategory(id: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/product/category/delete?id=' + id)
          this.reloadSelectList()
          resolve(true)
        } catch (error) {
          console.log(error)

          reject(error)
        }
      })
    },
    reloadSelectList() {
      const selectDataStore = useSelectDataStore()
      selectDataStore.hasChange.category = true
    }
  }
})
