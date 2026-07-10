import type { OFFICE_RESPONSE } from '../setting/office'

export type BILL_RESPONSE = Nullable<{
  id: number
  categories: any
  channel: string
  client: string
  code: string
  created_at: string
  created_by: string
  data_delivery_fee: string
  data_discount: any
  data_payments: any
  data_tax: any
  delivery_fee: number
  discount: number
  done_at: string
  inventory: any
  office: OFFICE_RESPONSE
  payment_methods: any
  payments: number
  price_policy: string
  progress_status: any
  quantity: number
  return_note: string
  shipping_address: string
  status: number
  sum_discount_product: number
  sum_sub_total_product: number
  tags: string
  tax_price: number
  total_price: number
  type: number
  updated_at: string
}>
