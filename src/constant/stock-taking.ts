import type { SelectConfigItem } from '@/types'
export enum STOCK_TALKING_STATUS {
  // All = -2,
  Cancel = -1,
  Approved_Pending = 0,
  Done = 1
}

export const STOCK_TALKING_DATA = [
  // { value: STOCK_TALKING_STATUS.All, label: 'Tất cả' },
  { value: STOCK_TALKING_STATUS.Done, label: 'Hoàn thành' },
  { value: STOCK_TALKING_STATUS.Cancel, label: 'Đã Hủy' },
  { value: STOCK_TALKING_STATUS.Approved_Pending, label: 'Đang xử lý' },
]

export const getStatusLabel = (id: any) => {
  const value = Number(id)
  return STOCK_TALKING_DATA.find((e) => e.value === value)?.label || ''
}

