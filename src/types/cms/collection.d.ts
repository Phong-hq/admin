import type { SCHEMAS } from '@/constant/cms'

export type COLLECTION_RESPONSE = Nullable<{
  created_at: string
  id: number
  name: string
  updated_at: updated_at
  user_id: number
  schemas: SCHEMA_RESPONSE[]
}>

// built-in tables (is_cms = 0); CMS collections (is_cms = 1) are user-defined and fetched
// at runtime via cmsStore.tableRelation, so ref_table also accepts any other string
export type BUILTIN_REF_TABLE =
  | 'post'
  | 'users'
  | 'product'
  | 'product_variant'
  | 'category'
  | 'brand'
  | 'category_brand'
  | 'banner'

export type RELATION_SCHEMA_OPTIONS = {
  ref_table: BUILTIN_REF_TABLE | (string & {})
  type: 'single' | 'multiple'
  is_cms: 0 | 1
}

export type SELECT_SCHEMA_OPTIONS = {
  value: string[]
  type: 'single' | 'multiple'
}

export type FILE_SCHEMA_OPTIONS = {
  type: 'single' | 'multiple'
}

export type SCHEMA_RESPONSE = Nullable<{
  name: string
  type: SCHEMAS
  validator: any
  options: RELATION_SCHEMA_OPTIONS | SELECT_SCHEMA_OPTIONS | FILE_SCHEMA_OPTIONS | any
  id: string
}>

export type SCHEMA_TABLE_RESPONSE = Nullable<{
  table_name: string
  is_cms: number
}>
