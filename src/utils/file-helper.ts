import axios from '../plugins/axios'
import { handle_error } from './message'
const UPLOAD_IMAGE_URL = '/api/v1/admin/services/storage/upload'

type FILE_RESPONSE = {
  base_url: string
  delete_url?: string
  error: boolean
  errors: string
  name: string
  size: number
  type: string
  url?: string
}

export function uploadFile(data: any): Promise<FILE_RESPONSE> {
  return new Promise<FILE_RESPONSE>(async (resolve, reject) => {
    try {
      const apiUrl = import.meta.env.VITE_API
      const file = new File([data], data.name, { type: 'image/png' })
      const formData = new FormData()
      formData.append('file', file)
      const res: { files: FILE_RESPONSE[] } = await axios.post(UPLOAD_IMAGE_URL, formData, {
        baseURL: apiUrl
      })
      if (res.files[0]?.error) {
        reject(res.files[0]?.errors || 'error')
        handle_error(res.files[0]?.errors)
        return
      }
      resolve(res?.files[0])
    } catch (error) {
      handle_error(error)

      reject(error)
    }
  })
}

export function removeFile(url: string) {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const apiUrl = import.meta.env.VITE_API
      const res = await axios.post(
        url,
        {},
        {
          baseURL: apiUrl
        }
      )
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}
