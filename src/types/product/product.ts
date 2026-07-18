import type { BRAND_RESPONSE } from './brand'
import type { CATEGORY_RESPONSE } from './category'
import type { BASE_OBJECT_RESPONSE } from '@/types'

export type PRODUCT_RESPONSE = PRODUCT_VARIANTS_RESPONSE & {
  product_variants: null | PRODUCT_VARIANTS_RESPONSE[]
  product_options: OPTION[]
  brand: BRAND_RESPONSE
  category: CATEGORY_RESPONSE
  allow_sell: number
  description: string
  dimension: string
  has_tax: number
  short_description: string
  status: number
  tags: any
  additional_data: { name: string; value: string }[]
  bar_code: string
  compare_price: null | number
}

export type PRODUCT_VARIANTS_RESPONSE = Nullable<{
  id: number
  product_id: number
  barcode: string
  created_at: string
  images: string[]
  import_price: number
  name: string
  sku: string
  sll_price: number
  quantity: number
  slug: string
  suppliers: { id: number; name: string }[]
  unit_price: number
  updated_at: string
  weight: string
  weight_type: string
  meta_field: META_FIELD[]
}>

export type OPTION = {
  name: string
  key: string
  values: OPTION_ITEM[]
}

export type OPTION_ITEM = { value: string; additional_data: string; slug: string }

type META_FIELD = {
  additional_data: string,
  key: string,
  name: string,
  slug: string,
  value: string,
}

export type PRODUCT_REQUEST = PRODUCT_VARIANTS_REQUEST & {
  product_variants: null | PRODUCT_VARIANTS_REQUEST[]
}

export type PRODUCT_VARIANTS_REQUEST = Nullable<{
  id: number
  allow_sell: number
  brand: BRAND_RESPONSE
  category: CATEGORY_RESPONSE
  created_at: string
  description: string
  bar_code: string
  category_id: number
  dimension: string
  has_tax: number
  images: string[]
  import_price: number
  name: string
  short_description: string
  sku: string
  sll_price: number
  slug: string
  status: number
  suppliers: any
  tags: any
  unit_price: number
  updated_at: string
  weight: string
  weight_type: string
}>
