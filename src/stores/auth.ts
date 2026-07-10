import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { setAxiosInstance } from '@/plugins/axios'
import type { AUTH_RESPONSE } from '@/types/user'
// import { USER_ROLE, USER_ROLE_ORDER, getRoleOrder } from '@/constant/user'
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    reloadCount: 0,
    userInfo: null as AUTH_RESPONSE | null
  }),
  getters: {},
  actions: {
    login(data: any): Promise<AUTH_RESPONSE> {
      return new Promise<AUTH_RESPONSE>(async (resolve, reject) => {
        try {
          const res: AUTH_RESPONSE = await axios.post(
            '/api/v1/admin/services/auth/login?expand=role',
            data
          )
          console.log(res)

          this.userInfo = res
          this.setAccessToken(res?.token || '')
          resolve(res)
        } catch (error) {
          reject(error)
        }
      })
    },
    getUserInfo(): Promise<AUTH_RESPONSE> {
      return new Promise<AUTH_RESPONSE>(async (resolve, reject) => {
        try {
          const res: { user: AUTH_RESPONSE } = await axios.get('/api/v1/frontend/pos/user/info')
          this.userInfo = res.user
          resolve(res.user)
        } catch (error) {
          reject(error)
        }
      })
    },
    setAccessToken(token: string) {
      if (token) {
        localStorage.setItem('access_token', token)
        setAxiosInstance(token)
        this.reloadCount += 1
      }
    },
    logout() {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
  }
})
