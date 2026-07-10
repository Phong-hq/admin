export const isValidEmail = (rule: string, value: string, call: any) => {
  try {
    const result = value.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    if (value == '' || result != null) return Promise.resolve()
    return Promise.reject('Email không hợp lệ!')
  } catch (error) {
    return Promise.reject('Email không hợp lệ!')
  }
}

export function isValidURL(rule: string, str: string, call: any) {
  try {
    new URL(str)
    return Promise.resolve()
  } catch (_) {
    return Promise.reject('Url không hợp lệ!')
  }
}

export function isValidJson(rule: string, str: string, call: any) {
  try {
    JSON.parse(str)
    return Promise.resolve()
  } catch (_) {
    return Promise.reject('Url không hợp lệ!')
  }
}

export const phoneNumberFormat = (phone: string) => {
  return phone.replace(/[^\d]/g, '')
}

export const isValidPhone = (rule: string, value: string, call: any) => {
  try {
    const result = value.match(
      /^(?:\+84|0)(?:3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/
    )
    if (value == '' || result != null) return Promise.resolve()
    return Promise.reject('Số diện thoại không hợp lệ!')
  } catch (error) {
    return Promise.reject('Số diện thoại không hợp lệ!')
  }
}
