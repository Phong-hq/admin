import type { BASE_OBJECT_RESPONSE } from '@/types'

export type INVENTORY_LIST_RESPONSE = Nullable<{
  id: number
  created_at: string
  updated_at: string
  name: string
  code: string
  description: string
  office: BASE_OBJECT_RESPONSE
  owner: BASE_OBJECT_RESPONSE<{username: string}>
  status: number
}>
