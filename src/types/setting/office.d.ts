import type { BASE_OBJECT_RESPONSE } from '@/types'

export type OFFICE_RESPONSE = Nullable<{
  id: number
  contact_person: BASE_OBJECT_RESPONSE
  address_1: string
  address_2: string
  created_at: string
  deleted_at: string
  description: string
  district_code: string
  email: string
  latitude: string
  longitude: string
  name: string
  province_code: string
  status: number
  updated_at: string
  type: string
  ward_code: string
  phone: string
}>
