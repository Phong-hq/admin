import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

interface RouteMeta {
  breadcrumb?: { label: string; router?: string }[]
  layout?: string
  no_login?: boolean
  no_padding?: boolean
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: {
        layout: 'blank',
        no_login: true
      } as RouteMeta
    },
    {
      path: '/',
      name: 'home',
      redirect: '/product/list',
      children: [
        {
          path: '/',
          name: 'product',
          redirect: '/product/list',
          children: [
            {
              path: '/product/list',
              name: 'product-list',
              component: () => import('@/views/product/List.vue'),
              meta: {
                breadcrumb: [{ label: 'Danh sách sản phẩm' }]
              } as RouteMeta
            },
            {
              path: '/product/create',
              name: 'product-create',
              component: () => import('@/views/product/detail/Index.vue'),
              meta: {
                breadcrumb: [
                  { label: 'Danh sách sản phẩm', router: '/product/list' },
                  { label: 'Thêm sản phẩm' }
                ]
              } as RouteMeta
            },
            {
              path: '/product/detail/:id',
              name: 'product-detail',
              component: () => import('@/views/product/detail/Index.vue'),
              meta: {
                breadcrumb: [
                  { label: 'Danh sách sản phẩm', router: '/product/list' },
                  { label: 'Thông tin sản phẩm' }
                ]
              } as RouteMeta
            }
          ]
        }
      ]
    },
    {
      path: '/brand',
      name: 'brand',
      redirect: 'brand/list',
      children: [
        {
          path: '/brand/list',
          name: 'brand-list',
          component: () => import('@/views/brand/List.vue'),
          meta: {
            breadcrumb: [{ label: 'Nhãn hiệu' }]
          } as RouteMeta
        }
      ]
    },
    {
      path: '/category',
      name: 'category',
      redirect: 'category/list',
      children: [
        {
          path: '/category/list',
          name: 'category-list',
          component: () => import('@/views/category/List.vue'),
          meta: {
            breadcrumb: [{ label: 'Danh mục' }]
          } as RouteMeta
        }
      ]
    },
    {
      path: '/order',
      name: 'order',
      redirect: 'order/list',
      children: [
        {
          path: '/order/list',
          name: 'order-list',
          component: () => import('@/views/order/List.vue'),
          meta: {
            breadcrumb: [{ label: 'Đơn hàng' }]
          } as any
        },
        {
          path: '/order/create',
          name: 'order-create-detail',
          component: () => import('@/views/order/detail/Detail.vue'),
          meta: {
            breadcrumb: [{ label: 'Đơn hàng', router: '/order/list' }, { label: 'Tạo đơn hàng' }]
          } as RouteMeta
        },
        {
          path: '/order/edit-detail/:id',
          name: 'order-edit-detail',
          component: () => import('@/views/order/detail/Detail.vue'),
          meta: {
            breadcrumb: [
              { label: 'Đơn hàng', router: '/order/list' },
              { label: 'Thông tin đơn hàng' }
            ]
          } as RouteMeta
        }
      ]
    },
    {
      path: '/cms',
      name: 'cms',
      redirect: 'cms',
      meta: {
        no_padding: true
      } as RouteMeta,
      children: [
        {
          path: '/cms',
          name: 'cms',
          component: () => import('@/views/cms/Index.vue')
        }
      ]
    },
    {
      path: '/inventory',
      name: 'inventory',
      redirect: 'inventory-receipt',
      children: [
        {
          path: '/inventory/list',
          name: 'inventory-list',
          redirect: '/inventory/list',
          children: [
            {
              path: '/inventory/list',
              name: 'inventory-list',
              component: () => import('@/views/inventory/List.vue'),
              meta: {
                breadcrumb: [{ label: 'Kho' }, { label: 'Quản lí kho' }]
              } as RouteMeta,
            },
            {
              path: '/inventory/history/:id',
              name: 'inventory-history',
              component: () => import('@/views/inventory/History.vue'),
              meta: {
                breadcrumb: [
                  { label: 'Kho' },
                  { label: 'Quản lí kho', router: '/inventory/list' },
                  { label: 'Lịch sử' }
                ]
              } as RouteMeta
            },
          ]
        },
        // {
        //   path: '/inventory/history/:id',
        //   name: 'inventory-history',
        //   component: () => import('@/views/inventory/History.vue'),
        //   meta: {
        //     breadcrumb: [
        //       { label: 'Kho' },
        //       { label: 'Quản lí kho', router: '/inventory/list' },
        //       { label: 'Chi tiết' }
        //     ]
        //   } as RouteMeta
        // },
        {
          path: '/inventory/receipt',
          name: 'inventory-receipt',
          redirect: '/inventory/receipt/list',
          children: [
            {
              path: '/inventory/receipt/list',
              name: 'receipt-list',
              component: () => import('@/views/inventory/receipt/List.vue'),
              meta: {
                breadcrumb: [{ label: 'Nhập kho' }]
              } as RouteMeta
            },
            {
              path: '/inventory/receipt-detail/:id',
              name: 'receipt-detail',
              component: () => import('@/views/inventory/receipt/detail/Detail.vue'),
              meta: {
                breadcrumb: [
                  // { label: 'Kho' },
                  { label: 'Nhập kho', router: '/inventory/receipt/list' },
                  { label: 'Phiếu nhập kho', router: '' }
                ]
              } as RouteMeta
            },
            {
              path: '/inventory/create',
              name: 'receipt-create',
              component: () => import('@/views/inventory/receipt/detail/Detail.vue'),
              meta: {
                breadcrumb: [
                  // { label: 'Kho' },
                  {
                    label: 'Nhập kho',
                    router: '/inventory/receipt/list'
                  },
                  { label: 'Tạo nhập kho' }
                ]
              } as RouteMeta
            }
          ]
        },
        {
          path: '/inventory/issue',
          name: 'inventory-issue',
          redirect: '/inventory/issue/list',
          children: [
            {
              path: '/inventory/issue/list',
              name: 'issue-list',
              component: () => import('@/views/inventory/issue/List.vue'),
              meta: {
                breadcrumb: [{ label: 'Xuất kho' }]
              } as RouteMeta
            },
            {
              path: '/inventory/issue/detail/:id',
              name: 'issue-detail',
              component: () => import('@/views/inventory/issue/detail/Detail.vue'),
              meta: {
                breadcrumb: [
                  { label: 'Xuất kho', router: '/inventory/issue/list' },
                  { label: 'Phiếu xuất kho' }
                ]
              } as RouteMeta
            },
            {
              path: '/inventory/issue/create',
              name: 'issue-create',
              component: () => import('@/views/inventory/issue/detail/Detail.vue'),
              meta: {
                breadcrumb: [
                  { label: 'Xuất kho', router: '/inventory/issue/list' },
                  { label: 'Tạo phiếu xuất kho' }
                ]
              } as RouteMeta
            }
          ]
        },
        {
          path: '/inventory/stocktaking',
          name: 'inventory-stocktaking',
          redirect: '/inventory/stocktaking/list',
          children: [
            {
              path: '/inventory/stocktaking/list',
              name: 'stocktaking-list',
              component: () => import('@/views/inventory/stocktaking/List.vue'),
              meta: {
                breadcrumb: [{ label: 'Kiểm kê sản phẩm' }]
              } as RouteMeta
            },
            {
              path: '/inventory/stocktaking/detail/:id',
              name: 'stocktaking-detail',
              component: () => import('@/views/inventory/stocktaking/detail/Detail.vue'),
              meta: {
                breadcrumb: [
                  {
                    label: 'Kiểm kê sản phẩm',
                    router: '/inventory/stocktaking/list'
                  },
                  { label: 'Phiếu kiểm kê kho' }
                ]
              } as RouteMeta
            },
            {
              path: '/inventory/stocktaking/create',
              name: 'stocktaking-create',
              component: () => import('@/views/inventory/stocktaking/detail/Detail.vue'),
              meta: {
                breadcrumb: [
                  {
                    label: 'Kiểm kê sản phẩm',
                    router: '/inventory/stocktaking/list'
                  },
                  { label: 'Tạo phiếu kiểm kê' }
                ]
              } as RouteMeta
            }
          ]
        }
      ]
    },
    {
      path: '/promotion',
      name: 'promotion',
      redirect: 'promotion-list',
      children: [
        {
          path: '/promotion/list',
          name: 'promotion-list',
          component: () => import('@/views/promotion/List.vue'),
          meta: {
            breadcrumb: [{ label: 'Mã giảm giá' }]
          } as RouteMeta
        },
        {
          path: '/promotion/create',
          name: 'promotion-create',
          component: () => import('@/views/promotion/detail/Detail.vue'),
          meta: {
            breadcrumb: [
              { label: 'Mã giảm giá', router: '/promotion/list' },
              { label: 'Tạo mã giảm giá' }
            ]
          } as RouteMeta
        }
      ]
    },
    {
      path: '/customer',
      name: 'customer',
      redirect: '/person/list',
      children: [
        {
          path: '/person',
          name: 'person',
          redirect: '/person/list',
          children: [
            {
              path: '/person/list',
              name: 'person-list',
              component: () => import('@/views/customer/List.vue'),
              meta: {
                breadcrumb: [{ label: 'Khách hàng' }]
              } as RouteMeta
            },
            {
              path: '/person/detail/:id',
              name: 'person-detail',
              component: () => import('@/views/customer/detail/Detail.vue'),
              meta: {
                breadcrumb: [
                  { label: 'Khách hàng', router: '/person/list' },
                  { label: 'Thông tin khách hàng' }
                ]
              } as RouteMeta
            }
          ]
        },
        {
          path: '/contact/list',
          name: 'contact-list',
          component: () => import('@/views/contact/List.vue'),
          meta: {
            breadcrumb: [{ label: 'Liên hệ' }]
          } as RouteMeta
        },
        {
          path: '/feedback/list',
          name: 'feedback-list',
          component: () => import('@/views/feedback/List.vue'),
          meta: {
            breadcrumb: [{ label: 'Phản hồi' }]
          } as RouteMeta
        }

        // {
        //   path: '/inventory/stocktaking',
        //   name: 'inventory-stocktaking',
        //   component: () => import('@/views/inventory/stocktaking/List.vue'),
        //   meta: {
        //     breadcrumb: [{ label: 'Kho' }, { label: 'Kiểm kê sản phẩm' }]
        //   } as RouteMeta
        // }
      ]
    },
    {
      path: '/revenue',
      name: 'revenue',
      meta: {
        breadcrumb: [{ label: 'Doanh  thu' }]
      } as RouteMeta,
      component: () => import('@/views/revenue/List.vue'),
      children: [
        // {
        //   path: '/person/list',
        //   name: 'person-list',
        //   component: () => import('@/views/customer/List.vue'),
        //   meta: {
        //     breadcrumb: [{ label: 'Khách hàng' }]
        //   } as RouteMeta
        // }
      ]
    },
    {
      path: '/setting',
      name: 'setting-page',
      redirect: '/setting/list',
      meta: {
        breadcrumb: [{ label: 'Cấu hình' }]
      } as RouteMeta,
      children: [
        {
          path: '/setting',
          name: 'setting-list',
          redirect: '/setting/list',
          children: [
            {
              path: '/setting/list',
              name: 'setting-list-view',
              component: () => import('@/views/setting/Setting.vue'),
              meta: {
                breadcrumb: [{ label: 'Cấu hình' }]
              } as RouteMeta,
            },
            {
              path: '/setting/user/create',
              name: 'setting-user-create',
              component: () => import('@/views/setting/user/Detail.vue'),
              meta: {
                breadcrumb: [
                  { label: 'Cấu hình', router: '/setting/list' },
                  {
                    label: 'Tài khoản',
                    router: '/setting/user'
                  },
                  { label: 'Tạo mới tài khoản' }
                ]
              } as RouteMeta
            },
            {
              path: '/setting/user/detail/:id',
              name: 'setting-user-detail',
              component: () => import('@/views/setting/user/Detail.vue'),
              meta: {
                breadcrumb: [
                  { label: 'Cấu hình', router: '/setting/list' },
                  {
                    label: 'Tài khoản',
                    router: '/setting/user'
                  },
                  { label: 'Chỉnh sửa tài khoản' }
                ]
              } as RouteMeta
            },
            {
              path: '/setting/user',
              name: 'setting-user',
              component: () => import('@/views/setting/user/User.vue'),
              meta: {
                breadcrumb: [{ label: 'Cấu hình', router: '/setting/list' }, { label: 'Tài khoản' }]
              } as RouteMeta
            },
            {
              path: '/setting/office',
              name: 'setting-office',
              component: () => import('@/views/setting/office/Office.vue'),
              meta: {
                breadcrumb: [{ label: 'Cấu hình', router: '/setting/list' }, { label: 'Chi nhánh' }]
              } as RouteMeta
            },
            {
              path: '/setting/department',
              name: 'setting-department',
              component: () => import('@/views/setting/department/Department.vue'),
              meta: {
                breadcrumb: [{ label: 'Cấu hình', router: '/setting/list' }, { label: 'Bộ phận' }]
              } as RouteMeta
            },
            {
              path: '/setting/inventory',
              name: 'setting-inventory',
              component: () => import('@/views/setting/inventory/Inventory.vue'),
              meta: {
                breadcrumb: [{ label: 'Cấu hình', router: '/setting/list' }, { label: 'Kho' }]
              } as RouteMeta
            },
            {
              path: '/setting/supplier',
              name: 'setting-supplier',
              component: () => import('@/views/setting/supplier/Supplier.vue'),
              meta: {
                breadcrumb: [{ label: 'Cấu hình', router: '/setting/list' }, { label: 'Nhà cung cấp' }]
              } as RouteMeta
            },
            {
              path: '/setting/delivery-fee',
              name: 'setting-delivery-fee',
              component: () => import('@/views/setting/delivery-fee/DeliveryFee.vue'),
              meta: {
                breadcrumb: [{ label: 'Cấu hình', router: '/setting/list' }, { label: 'Phí vận chuyển' }]
              } as RouteMeta
            },
            {
              path: '/setting/group',
              name: 'setting-group',
              component: () => import('@/views/setting/group/Group.vue'),
              meta: {
                breadcrumb: [{ label: 'Cấu hình', router: '/setting/list' }, { label: 'Khu vực' }]
              } as RouteMeta
            },
            {
              path: '/setting/room',
              name: 'setting-room',
              component: () => import('@/views/setting/room/Room.vue'),
              meta: {
                breadcrumb: [{ label: 'Cấu hình', router: '/setting/list' }, { label: 'Bàn' }]
              } as RouteMeta
            }
          ]
        },

      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        layout: 'blank',
        no_login: true
      } as RouteMeta
    }
  ] as Array<RouteRecordRaw>
})

router.beforeEach((to: any) => {
  const accessToken = localStorage.getItem('access_token')
  if (!accessToken && !to.meta?.no_login && to.name !== 'login') return { name: 'login' }
  if (accessToken && to.name === 'login') return { name: 'home' }
})

export default router
