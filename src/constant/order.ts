import type { SelectConfigItem } from '@/types'
export enum ORDER_STATUS {
  All = -2,
  Cancel = -1,
  Approved_Pending = 0,
  Approved = 1,
  Waiting_Shipper = 6,
  Done = 4
}

export const ORDER_STATUS_DATA = [
  { value: ORDER_STATUS.All, label: 'Tất cả' },
  { value: ORDER_STATUS.Approved_Pending, label: 'Chờ duyệt' },
  { value: ORDER_STATUS.Approved, label: 'Phê duyệt' },
  { value: ORDER_STATUS.Waiting_Shipper, label: 'Chờ giao' },
  { value: ORDER_STATUS.Done, label: 'Hoàn thành' },
  { value: ORDER_STATUS.Cancel, label: 'Huỷ đơn hàng' }
]

// Trạng thái kế tiếp hợp lệ từ mỗi trạng thái hiện tại (khớp với backend)
export const ORDER_STATUS_NEXT: Partial<Record<ORDER_STATUS, ORDER_STATUS[]>> = {
  [ORDER_STATUS.Approved_Pending]: [ORDER_STATUS.Approved, ORDER_STATUS.Cancel],
  [ORDER_STATUS.Approved]: [ORDER_STATUS.Waiting_Shipper, ORDER_STATUS.Cancel],
  [ORDER_STATUS.Waiting_Shipper]: [ORDER_STATUS.Done, ORDER_STATUS.Cancel],
  [ORDER_STATUS.Done]: [],
  [ORDER_STATUS.Cancel]: []
}

export const getStatusLabel = (id: any) => {
  const value = Number(id)
  return ORDER_STATUS_DATA.find((e) => e.value === value)?.label || ''
}
