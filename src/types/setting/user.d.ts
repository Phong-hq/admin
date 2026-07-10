import type { BASE_OBJECT_RESPONSE } from '@/types'

export type USER_RESPONSE = Nullable<{
  id: number
  created_at: string
  email: string
  logged_at: string
  offices: BASE_OBJECT_RESPONSE[]
  role: string
  username: string
  status: number
  suppliers: BASE_OBJECT_RESPONSE[]
}>
