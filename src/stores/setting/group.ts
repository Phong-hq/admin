import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { useSelectDataStore } from '@/stores/select_data'
import { useRootStore } from '@/stores/root'
import type { GROUP_RESPONSE } from '@/types/setting/group'

export const useGroupStore = defineStore('groupStore', {
  state: () => ({
    groupList: [] as GROUP_RESPONSE[],
  }),
  getters: {},
  actions: {
    getGroupList(params?: any): Promise<DataWithMetaResponse<GROUP_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<GROUP_RESPONSE[]> = await axios.get(
            '/api/v1/admin/setting/room/index-group',
            { params }
          )
          this.groupList = res.items || []
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    createGroup(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res:DataWithMetaResponse<GROUP_RESPONSE> = await axios.post('/api/v1/admin/setting/room/create-group', data)
          this.reloadSelectList()
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateGroup(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res:DataWithMetaResponse<GROUP_RESPONSE> = await axios.post('/api/v1/admin/setting/room/update-group', data)
          this.reloadSelectList()
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    deleteGroup(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const rootStore = useRootStore()
          await rootStore.confirm({
            headerTitle: 'Xóa khu vực',
            bodyTitle: `Bạn chắc chắn muốn xóa khu vực '${data.name}' không?`
          })
          const res:DataWithMetaResponse<GROUP_RESPONSE> = await axios.post('/api/v1/admin/setting/room/delete-group', {id: data.id})
          this.reloadSelectList()
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    reloadSelectList() {
      try {
        const selectDataStore = useSelectDataStore()
        selectDataStore.getGroupList(true)
      } catch (e) {
        console.log(e)
      }
    }
  }
})
