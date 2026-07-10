import type { BASE_OBJECT_RESPONSE } from '@/types'

export type RECEIPT_RESPONSE = Nullable<{
  id: number
  code: string
  client: any
  updated_at: string
  created_at: string
  delivery_date: string
  inventory: BASE_OBJECT_RESPONSE
  inventory_id: number
  note: string
  office: BASE_OBJECT_RESPONSE
  office_id: number
  other_cost: any
  progress_status: {
    status: number
    date: string
  }[]
  quantity: number
  receipt_items: any
  shipping_address: {
    address: string
    name: string
    phone: string
  }
  status: number
  sub_total_price: number
  supplier: BASE_OBJECT_RESPONSE
  tags: string[]
  total_discount_type: string
  total_discount_value: number
  total_price: number
  tag: string[]
  user: {
    id: number
    username: string
  }
  billing_address: {
    address: string
    name: string
    phone: string
  }
}>

export type STOCKTAKING_RESPONSE = Nullable<{
  id: number
  code: string
  updated_at: string
  created_at: string
  inventory: BASE_OBJECT_RESPONSE
  inventory_id: number
  note: string
  office: BASE_OBJECT_RESPONSE
  office_id: number
  progress_status: any
  status: number
  stocktaking_date: string
  stocktaking_items: any
  tags: string[]
  total_adjustment: number
  total_difference: number
  created_by: string
}>

export type INVENTORY_RESPONSE = Nullable<{
  id: number
  product_id: number
  created_at: string
  available: number
  committed: number
  inventory: BASE_OBJECT_RESPONSE<{code: string}>
  on_way: number
  product: {
    id: number
  }
  product_variant: Nullable<{
    id: number
    barcode: string
    images: string
    name: string
    sku: string
    slug: string
    unit_price: number
  }>
  quantity: number
  sll_price: number
  status: number
  suppliers: BASE_OBJECT_RESPONSE[]
  unit_price: number
  updated_at: string
}>

export type INVENTORY_HISTORY_RESPONSE = Nullable<{
  id: number
  code: string
  updated_at: string
  created_at: string
  action: string
  change_quantity: string
  created_by: string
  inventory: BASE_OBJECT_RESPONSE<{ office_id: number }>
  office: BASE_OBJECT_RESPONSE
  product_id: number
  product_variant: BASE_OBJECT_RESPONSE<{ sku: string }>
  type: any
  voucher_code: string
}>

export type INVENTORY_HISTORY_MODULE_RESPONSE = Nullable<{
  id: number
  code: string
  updated_at: string
  created_at: string
  created_by: string
  delivery_date: string
  inventory_id: number
  inventory_receive: any
  inventory_receive_id: number
  issue_items: any
  office: any
  office_id: number
  office_receive: any
  office_receive_id: number
  order_id: number
  progress_status: number
  status: number
  total_number: number
  received_date: number
  type: number
}>

export type ISSUE_RESPONSE = Nullable<{
  id: number
  code: string
  updated_at: string
  created_at: string
  created_by: string
  deleted_at: string
  delivery_date: string
  inventory: BASE_OBJECT_RESPONSE
  inventory_id: number
  inventory_receive: BASE_OBJECT_RESPONSE
  inventory_receive_id: number
  issue_items: any
  note: string
  office: BASE_OBJECT_RESPONSE
  office_id: number
  office_receive: BASE_OBJECT_RESPONSE
  office_receive_id: number
  order_id: number
  progress_status: number
  status: number
}>
