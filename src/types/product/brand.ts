import type { CATEGORY_RESPONSE } from './category'
export type BRAND_RESPONSE = Nullable<{
  id: number
  categories: CATEGORY_RESPONSE[]
  code: string
  created_at: string
  category: any
  description: string
  icon: string
  name: string
  slug: string
  updated_at: string
  status: number
}>
