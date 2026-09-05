import type { BRAND_RESPONSE } from './brand'

export type CATEGORY_RESPONSE = Nullable<{
  id: number
  categories: any
  brands: BRAND_RESPONSE[]
  code: string
  created_at: string
  description: string
  icon: string[]
  name: string
  slug: string
  updated_at: string
  status: number
  parent_id: number
  children: CATEGORY_RESPONSE[]
}>
