import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { useRootStore } from '@/stores/root'
import type { ROOM_RESPONSE } from '@/types/setting/room'

export const useRoomStore = defineStore('roomStore', {
  state: () => ({}),
  getters: {},
  actions: {
    getRoomList(params?: any): Promise<DataWithMetaResponse<ROOM_RESPONSE[]>> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res: DataWithMetaResponse<ROOM_RESPONSE[]> = await axios.get(
            '/api/v1/admin/setting/room',
            { params }
          )
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    createRoom(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res:DataWithMetaResponse<ROOM_RESPONSE> = await axios.post('/api/v1/admin/setting/room/create', data)
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    updateRoom(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const res:DataWithMetaResponse<ROOM_RESPONSE> = await axios.post('/api/v1/admin/setting/room/update', data)
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    deleteRoom(data: any): Promise<any> {
      return new Promise<any>(async (resolve, reject) => {
        try {
          const rootStore = useRootStore()
          await rootStore.confirm({
            headerTitle: 'Xóa bàn',
            bodyTitle: `Bạn chắc chắn muốn xóa bàn '${data?.name}' không?`
          })
          const res:DataWithMetaResponse<ROOM_RESPONSE> = await axios.post('/api/v1/admin/setting/room/delete', {id: data?.id})
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
  }
})
