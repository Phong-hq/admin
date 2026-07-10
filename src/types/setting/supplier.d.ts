import type { BASE_OBJECT_RESPONSE } from '@/types'

export type SUPPLIER_RESPONSE = Nullable<{
  id: number
  contact: BASE_OBJECT_RESPONSE
  code: string
  address_1: string
  address_2: string
  created_at: string
  deleted_at: any
  description: string
  email: string
  fax: string
  groups: any
  name: string
  note: string
  phone: string
  tax_code: string
  status: number
  updated_at: string
  website: string
  type: string
}>
