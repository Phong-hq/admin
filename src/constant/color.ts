import { Link } from 'ckeditor5'

const enum Color {
  Primary = '#4F46E5',
  Primary_Bg = '#EEF2FF',
  Primary_Light = '#EEF2FF',
  Error = '#EF4444',
  Error_Bg = '#FEF2F2',
  Success = '#10B981',
  Success_Bg = '#ECFDF5',
  Warning = '#F59E0B',
  Teal = '#0EA5E9',
  Purple = '#8B5CF6',
  Dark = '#1E1B4B',
  Text = '#1E293B',
  C82 = '#64748B',
  Blue = '#3B82F6',
  Blue_Light = '#EFF6FF',
  Placeholder = '#94A3B8',
  Split = '#E2E8F0',
  ItemHover = 'rgba(79, 70, 229, 0.08)',
  BorderGray = '#E2E8F0',
  colorFillQuaternary = '#F8FAFC',
  Link = '#4F46E5',
  Canvas = '#EEF1F8',
  Sidebar = '#15132A',
  SidebarSoft = '#211D3D',
  SidebarBorder = 'rgba(255, 255, 255, 0.08)',
  SidebarText = '#9B97BE',
  Tag = '#F59E0B'
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
    root.style?.setProperty('--color-canvas', Color.Canvas)
    root.style?.setProperty('--color-sidebar', Color.Sidebar)
    root.style?.setProperty('--color-sidebar-soft', Color.SidebarSoft)
    root.style?.setProperty('--color-sidebar-border', Color.SidebarBorder)
    root.style?.setProperty('--color-sidebar-text', Color.SidebarText)
    root.style?.setProperty('--color-tag', Color.Tag)
  }
}
