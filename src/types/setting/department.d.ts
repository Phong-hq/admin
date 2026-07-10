import type { BASE_OBJECT_RESPONSE } from '@/types'

export type DEPARTMENT_RESPONSE = Nullable<{
  id: number
  created_at: string
  updated_at: string
  office: BASE_OBJECT_RESPONSE
  user: BASE_OBJECT_RESPONSE<{username: string}>
  name: string
  status: number
}>
