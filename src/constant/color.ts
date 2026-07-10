import { Link } from 'ckeditor5'

const enum Color {
  Primary = '#171717',
  Primary_Bg = '#f3f3f3',
  Primary_Light = '#f3f3f3',
  Error = '#e03636',
  // Error = '#eb5757',
  Error_Bg = '#FFF0F0',
  Success = '#15ab64',
  // Success = '#52c41a',
  Success_Bg = '#E9FFE4',
  Warning = '#faad14',
  Teal = '#08979c',
  Purple= '#531dab',
  Dark = '#020617',
  Text = '#000',
  C82 = '#828282',
  Blue = '#1677ff',
  Blue_Light = '#edf6fd',
  Placeholder = '#6B7280',
  Split = '#e0e0e0',
  ItemHover = 'rgba(0, 0, 0, 0.04)',
  BorderGray = '#dedede',
  colorFillQuaternary = '#fafafa',
  Link = '#1890ff'
}

export default Color

export function defineRootColor() {
  const root = document.querySelector(':root') as any
  if (root) {
    root.style?.setProperty('--color-primary', Color.Primary)
    root.style?.setProperty('--color-primary-bg', Color.Primary_Bg)
    root.style?.setProperty('--color-blue', Color.Blue)
    root.style?.setProperty('--color-blue-light', Color.Blue_Light)
    root.style?.setProperty('--color-light-primary', Color.Primary_Light)
    root.style?.setProperty('--color-error', Color.Error)
    root.style?.setProperty('--color-error-bg', Color.Error_Bg)
    root.style?.setProperty('--color-success', Color.Success)
    root.style?.setProperty('--color-success-bg', Color.Success_Bg)
    root.style?.setProperty('--color-second-success', Color.Success)
    root.style?.setProperty('--color-warning', Color.Warning)
    root.style?.setProperty('--color-text', Color.Text)
    root.style?.setProperty('--color-placeholder', Color.Placeholder)
    root.style?.setProperty('--color-split', Color.Split)
    root.style?.setProperty('--color-item-hover', Color.ItemHover)
    root.style?.setProperty('--color-CDE', Color.BorderGray)
    root.style?.setProperty('--color-C82', Color.C82)
    root.style?.setProperty('--color-link', Color.Link)
  }
}
