import type { SelectConfigItem } from '@/types'
export enum RECEIPT_STATUS {
  All = -2,
  Cancel = -1,
  Approved_Pending = 0,
  Approved = 1,
  Pack = 2,
  Done = 3
}

export const RECEIPT_STATUS_DATA = [
  { value: RECEIPT_STATUS.All, label: 'Tất cả' },
  { value: RECEIPT_STATUS.Done, label: 'Hoàn thành' },
  { value: RECEIPT_STATUS.Cancel, label: 'Đã Hủy' },
  { value: RECEIPT_STATUS.Approved_Pending, label: 'Chờ duyệt' },
  { value: RECEIPT_STATUS.Approved, label: 'Đã duyệt' },
  { value: RECEIPT_STATUS.Pack, label: 'Kho' },
]

export const getStatusLabel = (id: any) => {
  const value = Number(id)
  return RECEIPT_STATUS_DATA.find((e) => e.value === value)?.label || ''
}

export enum RECEIPT_DISCOUNT_TYPE {
  CASH = 2,
  PERCENT = 1
}
