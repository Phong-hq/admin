import type { SelectConfigItem } from '@/types'
export enum USER_ROLE {
  ADMIM = 'administrator',
  MANAGER = 'manager',
  SELLER = 'seller',
  SUPPLIER = 'supplier',
  USER = 'user',
}

export const USER_ROLE_DATA = [
  { value: USER_ROLE.ADMIM, label: 'Quản trị viên' },
  { value: USER_ROLE.MANAGER, label: 'Quản lý' },
  { value: USER_ROLE.SELLER, label: 'Bán hàng' },
  { value: USER_ROLE.SUPPLIER, label: 'Nhà cung cấp' },
  { value: USER_ROLE.USER, label: 'User' },
]

export const getStatusLabel = (id: any) => {
  return USER_ROLE_DATA.find((e) => e.value === id)?.label || ''
}
