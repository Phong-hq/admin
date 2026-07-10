import type { BASE_OBJECT_RESPONSE } from '@/types/index'

export type PROMOTION_RESPONSE = Nullable<{
  id: number
  code: string
  updated_at: string
  created_at: string
  apply_for_all: number
  condition_items: any
  condition_type: string
  description: string
  discount_type: number
  discount_value: number
  end_date: string
  group_customers: any
  limit: number
  offices: BASE_OBJECT_RESPONSE
  order_total_required: any
  start_date: string
  title: string
  status: number
  used: number
}>
