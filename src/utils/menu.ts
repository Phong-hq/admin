import { VueElement } from 'vue'
import type { ItemType } from 'ant-design-vue'
import Icon1 from '@/assets/icons/layout/icon1.svg'
import Icon2 from '@/assets/icons/layout/icon2.svg'
import Icon3 from '@/assets/icons/layout/icon3.svg'
import Icon4 from '@/assets/icons/layout/icon4.svg'
import Icon5 from '@/assets/icons/layout/icon5.svg'

const getItem = (
  label: VueElement | string,
  key: string,
  children?: ItemType[],
  type?: 'group'
): ItemType => {
  return {
    key,
    children,
    label,
    type
  } as ItemType
}

export const listMenu = [
  {
    icon: Icon1,
    key: 'product',
    keyList: ['product', 'brand', 'category'],
    menu: [
      getItem('Sản phẩm', 'home', [getItem('Danh sách sản phẩm', 'product')], 'group'),
      getItem(
        'Kho',
        'inventory',
        [
          getItem('Quản lí kho', 'inventory-list'),
          getItem('Nhập kho', 'inventory-receipt'),
          getItem('Xuất kho', 'inventory-issue'),
          getItem('Kiểm kê sản phẩm', 'inventory-stocktaking')
        ],
        'group'
      ),
      getItem('Danh mục', 'category', [getItem('Quản lí danh mục', 'category-list')], 'group'),
      getItem(
        'Khuyến mãi',
        'promotion',
        [getItem('Quản lí khuyến mãi', 'promotion-list')],
        'group'
      ),
      getItem('Nhãn hiệu', 'brand', [getItem('Quản lí nhãn hiệu', 'brand-list')], 'group')
    ],
    links: [
      { title: 'Sản phẩm', children: [{ title: 'Danh sách sản phẩm', router: 'order-list' }] },
      {
        title: 'Kho',
        children: [
          { title: 'Quản lí kho', router: '1' },
          { title: 'Nhập kho', router: 'inventory-receipt' },
          { title: 'Xuất kho', router: '3' },
          { title: 'Kiểm kê sản phẩm', router: '4' }
        ]
      },
      { title: 'Danh mục', children: [{ title: 'Quản lí danh mục', router: '5' }] },
      { title: 'khuyến mãi', children: [{ title: 'Quản lí danh mục', router: '6' }] },
      { title: 'Nhãn hiệu', children: [{ title: 'Quản lí nhãn hiệu', router: 'brand-list' }] }
    ]
  },
  {
    icon: Icon2,
    key: 'system',
    menu: [
      getItem(
        'Đơn hàng',
        'order',
        [getItem('Đơn hàng', 'order-list'), getItem('Đổi trả', '9')],
        'group'
      )
    ],
    links: [
      {
        title: 'Đơn hàng',
        children: [
          { title: 'Đơn hàng', router: '8' },
          { title: 'Đổi trả', router: '9' }
        ]
      }
    ]
  },
  {
    icon: Icon3,
    key: 'article',
    menu: [
      getItem(
        'Khách hàng',
        'customer',
        [
          getItem('Khách hàng', 'person'),
          getItem('Liên hệ', 'contact-list'),
          getItem('Phản hồi', 'feedback-list')
        ],
        'group'
      )
    ],
    links: [
      {
        title: 'Khách hàng',
        children: [
          { title: 'Khách hàng', router: '8' },
          { title: 'Liên hệ', router: '9' }
        ]
      }
    ]
  },
  {
    icon: Icon4,
    key: 'revenue',
    menu: [getItem('Doanh thu', '12', [getItem('Doanh thu', 'revenue')], 'group')]
  },
  {
    icon: Icon5,
    key: 'setting',
    menu: [
      getItem('Cấu hình', '13', [getItem('Cấu hình', 'setting-list')], 'group'),
      getItem('CMS', 'cms', [getItem('CMS', 'cms')], 'group')
    ]
  }
]