import type { SelectConfigItem } from '@/types'

export enum ISSUE_STATUS {
  Approved_Pending = 0,
  Done = 2,
  Cancel = -1
}

export const ISSUE_STATUS_DATA = [
  { value: ISSUE_STATUS.Done, label: 'Hoàn thành' },
  { value: ISSUE_STATUS.Cancel, label: 'Hủy xuất kho' },
  { value: ISSUE_STATUS.Approved_Pending, label: 'Đang xử lí' }
]

export const getStatusLabel = (id: any) => {
  const value = Number(id)
  return ISSUE_STATUS_DATA.find((e) => e.value === value)?.label || ''
}

export enum ISSUE_DISCOUNT_TYPE {
  CASH = 2,
  PERCENT = 1
}
