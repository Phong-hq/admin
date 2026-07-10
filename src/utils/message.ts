import { notification } from 'ant-design-vue'
import { message } from 'ant-design-vue'

export const handle_error = (error: any, messageError: string = 'Error') => {
  console.error(error, 'error')
  if (!error) return

  let description = '' as any
  let resError = null as any

  //FORM SUBMIT
  if (error?.errorFields?.length) {
    if (error?.errorFields[0]?.errors?.length) {
      description = error?.errorFields[0]?.errors[0]
      scrollToErrorInput(error?.errorFields[0]?.name[0])
    }
  }
  if (
    error?.response?.data?.data?.errors &&
    Object.values(error?.response?.data?.data?.errors) &&
    description == ''
  ) {
    resError = error?.response?.data?.data?.errors
    while (Object.values(resError).length && typeof resError != 'string') {
      if (Object.values(resError)[0]) {
        //HAS MESSAGE FIELD
        if (resError.message) {
          description = resError.message
          resError = null
        }
        //FORM
        else if (typeof Object.values(resError)[0] === 'string') {
          description = Object.values(resError)[0]
          resError = null
        } else {
          resError = Object.values(resError)[0] || null
        }
      }
    }
  } else if (typeof error == 'string') {
    description = error
  } else if (typeof error[0] == 'string') {
    description = error
  }

  if (description == '') {
    description = error?.data?.messages || error?.messages || error?.message
  }

  notification.error({
    message: messageError,
    description: description || 'An unknown error'
  })
}

export const handle_success = (message: string, description?: string) => {
  notification.success({
    message: message,
    description: description || ''
  })
}

const scrollToErrorInput = (id: string) => {
  if (id) {
    const input = document.getElementById(`basic_${id}`)
    const label = document.querySelector("label[for='basic_" + id + "']")

    if (label) label?.scrollIntoView({ behavior: 'smooth' })
    else input?.scrollIntoView({ behavior: 'smooth' })
  }
}
