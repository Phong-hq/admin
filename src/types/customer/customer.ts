import type { BASE_OBJECT_RESPONSE } from '@/types'

export type CUSTOMER_RESPONSE = Nullable<{
  id: number
  address_1: string
  address_2: string
  code: string
  created_at: string
  district_code: string
  email: string
  groups: BASE_OBJECT_RESPONSE[]
  name: string
  phone: string
  postal_code: string
  province_code: string
  status: number
  type: string
  updated_at: string
  ward_code: string
  website: string
  count_contact: number
  count_note: number
  count_order: number
}>

export type CONTACT_CUSTOMER_RESPONSE = Nullable<{
  contact: Nullable<{
    id: number
    name: string
    address_1: string
    phone: string
    email: string
  }>
  customer: BASE_OBJECT_RESPONSE
  created_at: string
  id: number
  status: number
  updated_at: string
}>


export type NOTE_CUSTOMER_RESPONSE = Nullable<{
  created_at: string
  created_by: string
  customer_name: string
  note: string
  id: number
  updated_at: string
}>