import type { CATEGORY_RESPONSE } from '@/types/product/category'
import type { BASE_OBJECT_RESPONSE } from '@/types'

export type REVENUE_ORDER_RESPONSE = Nullable<{
  id: number
  code: string
  created_at: string
  description: string
  channel: string
  data_delivery_fee: string
  delivery_fee: number
  discount: number
  payments_after_return: number
  quantity: number
  sum_discount_product: number
  sum_sub_total_product: number
  tax_price: number
  total_price: number
  total_price_return: number
  type: number
  paymentMethods: any
  name: string
  updated_at: string
  status: number
}>

export type REVENUE_SUM_RESPONSE = Nullable<{
  sum_all_sub_total_product: number
  sum_card_payment: number
  sum_cash_payment: number
  sum_delivery_fee: number
  sum_discount: number
  sum_payments: number
  sum_quantity: number
  sum_return: number
  sum_total_price: number
  sum_transfer_payment: number
}>

export type REVENUE_VARIANT_RESPONSE = Nullable<{
  bought: number
  created_at: string
  payment_after_return: number
  payment_before_return: number
  sum_sub_total: number
  product_variant: Nullable<{
    id: number
    code: string
    name: string
    sku: string
  }>
  suppliers: BASE_OBJECT_RESPONSE[]
  total_discount_price: number
  total_price_return: number
  total_quantity_return: number
  updated_at: string
}>
