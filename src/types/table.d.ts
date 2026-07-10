export type COLUMN_TYPE = {
  title: string
  key: string | { name: string; value: string; label: string }
  childrenKeys?: string[]
  align?: 'center' | 'right' | 'left'
  noResizable?: boolean
  sorter?: any
  width?: 'sm' | 'md' | 'lg' | 'xl' | number
  noEdit?: boolean
  fixed?: boolean
  isFilter?: boolean
  inputProps?: { inputType: 'text' | 'select' | 'number' | 'date' | 'select-search'; data?: any }
  hidden?: boolean

  //CMS
  schemaType?: string
  schemaOption?: any

  customCell?: any

}
