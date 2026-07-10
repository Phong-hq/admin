import type { BASE_OBJECT_RESPONSE } from '@/types'
import type { PRODUCT_VARIANTS_RESPONSE } from '@/types/product/product'

export type ORDER_RESPONSE = Nullable<{
  id: number
  channel: string
  client: BASE_OBJECT_RESPONSE<{phone: string}>
  code: string
  created_at: string
  created_by: string
  data_delivery_fee: Nullable<{
    delivery_fee_value: number
  }>
  data_discount: any
  data_payments: any
  data_tax: any
  delivery_fee: any
  discount: number
  done_at: string
  inventory: BASE_OBJECT_RESPONSE
  inventory_id: number
  note: string
  office: BASE_OBJECT_RESPONSE
  office_id: number
  order_address: SHIPPING_ADDRESS_RESPONSE
  order_items: ORDER_ITEMS_RESPONSE[]
  payment_methods: any
  payments: number
  price_policy: string
  progress_status: {status: string, date: string }[]
  quantity: number
  return_note: string
  shipping_address: SHIPPING_ADDRESS_RESPONSE
  status: number
  sum_discount_product: number
  sum_sub_total_product: number
  tags: any
  tax_price: any
  total_price: number
  type: number
  updated_at: string
}>

type SHIPPING_ADDRESS_RESPONSE = Nullable<{
  address: string
  email: string
  name: string
  phone: string
}>

export type ORDER_ITEMS_RESPONSE = Nullable<{
  created_at: string
  deleted_at: string
  discount_price: number
  number_inventory: number
  number_inventory_current: number
  order_id: number
  product_id: number
  product_variant: Nullable<{
    name: string
    sku: string
    id: number
  }>
  product_variant_id: number
  quantity: number
  quantity_return: number
  sub_total: number
  total_price: number
  unit_price: number
  id: number
  updated_at: string
}>
