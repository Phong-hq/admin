import type { SelectConfigItem } from '@/types'
export enum ORDER_STATUS {
  All = -2,
  Done = 4,
  Cancel = -1,
  Approved_Pending = 0,
  Approved = 1,
  Pack = 2,
  Out_Of_Stock = 3
}

export const ORDER_STATUS_DATA = [
  { value: ORDER_STATUS.All, label: 'Tất cả' },
  { value: ORDER_STATUS.Done, label: 'Hoàn thành' },
  { value: ORDER_STATUS.Cancel, label: 'Huỷ đơn hàng' },
  { value: ORDER_STATUS.Approved_Pending, label: 'Chờ duyệt' },
  { value: ORDER_STATUS.Approved, label: 'Phê duyệt' },
  { value: ORDER_STATUS.Pack, label: 'Đóng gói' },
  { value: ORDER_STATUS.Out_Of_Stock, label: 'Rời Kho' }
]

export const getStatusLabel = (id: any) => {
  const value = Number(id)
  return ORDER_STATUS_DATA.find((e) => e.value === value)?.label || ''
}
