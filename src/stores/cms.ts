import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type { COLLECTION_RESPONSE, SCHEMA_TABLE_RESPONSE } from '@/types/cms/collection'

export const useCmsStore = defineStore('cmsStore', {
  state: () => ({
    collectionList: [] as COLLECTION_RESPONSE[],
    tableRelation: [] as SCHEMA_TABLE_RESPONSE[]
  }),
  getters: {},
  actions: {
    getCmsCollection(params?: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<COLLECTION_RESPONSE[]> = await axios.get(
            '/api/v1/admin/cms/collection',
            { params }
          )
          this.collectionList = res.items
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    getCmsRecord(name: string, params?: any): Promise<DataWithMetaResponse<any>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<any> = await axios.get(
            '/api/v1/admin/cms/record/' + name,
            {
              params: {
                ...params
              }
            }
          )
          // this.collectionList = res.items
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    deleteCmsRecord(name: string, id: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<any> = await axios.post(
            `api/v1/admin/cms/record/${name}/delete?id=${id}`
          )
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    getTableRelation(): Promise<SCHEMA_TABLE_RESPONSE[]> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: { data: SCHEMA_TABLE_RESPONSE[] } = await axios.get(
            '/api/v1/admin/cms/schema-collection/table-relation'
          )
          this.tableRelation = res.data
          resolve(res.data)
        } catch (error) {
          reject(error)
        }
      })
    },
    createCmsCollection(data?: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/admin/cms/collection/create', data)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    deleteCmsCollection(id: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: any = await axios.post('api/v1/admin/cms/collection/delete?id=' + id)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateCmsCollection(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: any = await axios.post(
            'api/v1/admin/cms/collection/update?id=' + data?.id,
            data
          )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    createCmsRecord(collection_name: string, data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: any = await axios.post(
            `api/v1/admin/cms/record/${collection_name}/create`,
            data
          )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateCmsRecord(collection_name: string, id: any, data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: any = await axios.post(
            `api/v1/admin/cms/record/${collection_name}/update?id=` + id,
            data
          )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
})
