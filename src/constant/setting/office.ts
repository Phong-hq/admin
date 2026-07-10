export enum OFFICE_TYPE {
  Corporation = 'corporation',
  Exempt_Organization = 'exempt_organization',
  Partnership = 'partnership',
  Private_Foundation = 'private_foundation',
  Limited_Liability = 'limited_liability',
}

export const OFFICE_TYPE_DATA = [
  { value: OFFICE_TYPE.Corporation, label: 'Công ty cổ phần' },
  { value: OFFICE_TYPE.Exempt_Organization, label: 'Tổ chức được miễn thuế' },
  { value: OFFICE_TYPE.Partnership, label: 'Công ty hợp danh' },
  { value: OFFICE_TYPE.Private_Foundation, label: 'Công ty tư nhân' },
  { value: OFFICE_TYPE.Limited_Liability, label: 'Công ty trách nhiệm hữu hạng' },
]

export const getTypeLabel = (id: any) => {
  return OFFICE_TYPE_DATA.find((e) => e.value === id)?.label || ''
}
