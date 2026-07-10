import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth'
const temp = import.meta.env.VITE_API;
const instance = axios.create({
  // baseURL: 'https://erp-core-demo.srv01.dtsmart.dev'
  // baseURL: 'https://ecommerce-api.srv01.dtsmart.dev'
  // baseURL: 'http://192.168.1.174:8080'
  baseURL: 'http://localhost:9001'
  // baseURL: temp
})

type AxiosInstanceConfig = {
  // baseURL?: string
  token: string
}
export const setAxiosInstance = (token: string) => {
  // instance.defaults.baseURL = config.baseURL
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
export const setAxiosBaseUrl = (url: string) => {
  instance.defaults.baseURL = url
}
instance.interceptors.response.use(
  function (response) {
    // console.log(response, 'AXIOS')

    // CHECK AXIOS
    if (response?.status == 200) {
      if (response?.data && response?.data?.status == undefined) {
        return response?.data
      }
      //CHECK SERVER
      if (response?.data?.status) {
        return response?.data?.data
      } else {
        let messError = response?.data?.messages || response?.data?.message || ''

        //CHECK RESULT MESSAGE
        if (response?.data?.result?.message) messError = response?.data?.result?.message
        //CHECK ERROR MESSAGE
        if (response?.data?.error && typeof response?.data?.error == 'object') {
          const keyArr = Object.keys(response?.data?.error)
          if (response?.data?.error[keyArr[0]] && response?.data?.error[keyArr[0]][0])
            messError = response?.data?.error[keyArr[0]][0]
        } else if (response?.data?.error && typeof response?.data?.error == 'string') {
          messError = response?.data?.error
        }
        console.log(response?.data?.data, 'messError')
        if (response?.data?.data?.errors && typeof response?.data?.data?.errors == 'object') {
          const keyArr = Object.keys(response?.data?.data?.errors)
          const keyArrErrors = Object.keys(response?.data?.data?.errors[keyArr[0]] ?? {})
          if (typeof response?.data?.data?.errors[keyArr[0]] == 'string') {
            messError = response?.data?.data?.errors[keyArr[0]]
          } else if (
            keyArrErrors.length &&
            response?.data?.data?.errors[keyArr[0]] &&
            response?.data?.data?.errors[keyArr[0]][keyArrErrors[0]]
          )
            messError = response?.data?.data?.errors[keyArr[0]][keyArrErrors[0]]
        }
        return Promise.reject(messError)
      }
    } else {
      let messError = response.data?.messages
      if (response?.data?.message) messError = response?.data?.message
      if (response?.data?.data?.errors && typeof response?.data?.data?.errors == 'object') {
        const err = response?.data?.data?.errors
        const key = Object.keys(err)[0]
        if (key) messError = err[key][0]
      }
      return Promise.reject(messError)
    }
    // return response?.data?.data;
  },
  function (error) {
    if (error?.response?.status == 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

export default instance

export class AxiosService {
  instance = null as AxiosInstance | null

  constructor(baseURL: string, customHeaders = {}) {
    this.instance = axios.create({
      baseURL: baseURL,
      headers: customHeaders
    })

    this.instance.interceptors.response.use(
      function (response) {
        // CHECK AXIOS
        if (response?.statusText == 'OK') {
          //CHECK SERVER
          if (response?.data?.status) {
            return response?.data?.data
          } else {
            let messError = response?.data?.message ?? ''
            if (response?.data?.result?.message) messError = response?.data?.result?.message
            return Promise.reject(messError)
          }
        } else {
          let messError = response.data?.messages
          if (response?.data?.data?.errors && typeof response?.data?.data?.errors == 'object') {
            const err = response?.data?.data?.errors
            const key = Object.keys(err)[0]
            if (key) messError = err[key][0]
          }
          return Promise.reject(messError)
        }
      },
      function (error) {
        return Promise.reject(error)
      }
    )
  }

  getInstance(): AxiosInstance {
    if (!this.instance) {
      throw new Error('Axios instance is not initialized')
    }
    return this.instance
  }

  async get(endpoint: string, params = {}, config = {}) {
    return (await this.getInstance().get(endpoint, { ...{ params }, ...config })) as any
  }

  post(endpoint: string, data: any, config = {}) {
    return this.getInstance().post(endpoint, data, config)
  }
}
