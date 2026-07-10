import { uploadFile, removeFile } from '@/utils/file-helper'

export default class MyUploadAdapter {
  constructor(loader: any, handleContentUpdated: (sd: string) => void) {
    this.loader = loader
    // this.uploadFunction = uploadFunction
    this.handleContentUpdated = handleContentUpdated
    this._removeLink = ''
  }
  loader: any
  uploadFunction: any
  handleContentUpdated: any
  _removeLink: string

  // Starts the upload process.
  upload() {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader()

      // reader.addEventListener('load', async () => {})

      // reader.addEventListener('error', (err) => {
      //   reject(err)
      // })

      // reader.addEventListener('abort', (err) => {
      //   reject(err)
      // })

      this.loader?.file?.then(async (file: any) => {
        try {
          const res = await uploadFile(file)
          if (res?.error) {
            reject(res.errors)
            return
          }
          this.handleContentUpdated(res?.url)
          this._removeLink = res?.delete_url || ''
          resolve({ default: res?.url || res?.base_url })
        } catch (error) {
          reject(error)
        }
        // reader.readAsDataURL(file)
      })
    })
  }
  abort() {
    if (this._removeLink) {
      removeFile(this._removeLink)
    }
  }
}

export function MyCustomUploadAdapterPlugin(
  editor: any,
  // uploadFunction: any,
  handleContentUpdated: any
) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader, handleContentUpdated)
  }
}
