import type { MetaResponse } from '@/types/global'

export type Option = {
  label: string
  value: any
  children?: Array<{
    label: string
    value: any
  }>
}

export type Options = Array<Option>

export type ConfirmPayload = {
  headerTitle?: string
  bodyTitle?: string
  bodyImage?: string
  bodyMessage?: string
  confirmButtonText?: string
  cancelButtonText?: string
  timeOut?: number //seconds
}

export type SelectConfigItem = {
  label?: string
  disabled?: boolean
  image?: string
  description?: string
  value: any
} | string

export type SelectSearchConfig = {
  search?: (id: string, params?: any) => Promise<SelectConfig>
  defaultData: 'inventory' | 'category' | 'brand' | 'office' | 'supplier' | 'variant' | 'product_inventory'
  extraData?: SelectConfigItem | string
  params?: any
  suffix?: boolean
}

export type SelectConfig = SelectConfigItem[]

export type BASE_OBJECT_RESPONSE<Extra = {}> = {
  id: number
  name: string
} & Extra

