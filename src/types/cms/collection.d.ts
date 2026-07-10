import type { SCHEMAS } from '@/constant/cms'

export type COLLECTION_RESPONSE = Nullable<{
  created_at: string
  id: number
  name: string
  updated_at: updated_at
  user_id: number
  schemas: SCHEMA_RESPONSE[]
}>

export type SCHEMA_RESPONSE = Nullable<{
  name: string
  type: SCHEMAS
  validator: any
  options: any
  id: string
}>

export type SCHEMA_TABLE_RESPONSE = Nullable<{
  table_name: string
  is_cms: number
}>
