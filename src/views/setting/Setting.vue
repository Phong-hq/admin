<template>
  <c-breadcrumb></c-breadcrumb>
  <div class="page-box-white">
    <!--    <p class="heading-1">Cấu hình</p>-->
    <template v-for="item in data" :key="item.id">
      <p class="heading-1">{{ item.title }}</p>
      <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:gap-7 md:gap-5 gap-3 xl:mb-7 md:mb-5 mb-3">
        <a
          @click.prevent="goToPage(item2)"
          :href="item2.router ?? ''"
          class="border border-CDE flex !h-auto rounded-md p-2 gap-2 hover:shadow-lg duration-200 cursor-pointer"
          v-for="(item2, i) in item.children"
          :key="i"
        >
          <div class="shrink-0 flex-center w-10 h-10 text-[32px]">
            <component :is="item2.icon" />
          </div>
          <div class="grow">
            <p class="heading-2 mb-2">{{ item2.title }}</p>
            <p>{{ item2.description }}</p>
          </div>
        </a>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  HomeOutlined,
  UserOutlined,
  ApartmentOutlined,
  AuditOutlined,
  BranchesOutlined,
  BlockOutlined,
  NodeIndexOutlined,
  DeploymentUnitOutlined,
  AimOutlined,
  ContactsOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'

// PINIA

//UTILS

const router = useRouter()

onMounted(() => {})

const data = [
  {
    id: 1,
    title: 'Cấu hình chung',
    children: [
      {
        icon: UserOutlined,
        title: 'Tài khoản',
        description: 'quản lý thông tin cá nhân, bảo mật, và liên kết tài khoản.',
        router: '/setting/user'
      }
    ]
  },
  {
    id: 2,
    title: 'Tổ chức',
    children: [
      {
        icon: BranchesOutlined,
        title: 'Chi nhánh',
        description: 'Quản lý thông tin chi nhánh, bao gồm địa chỉ, liên hệ, và cài đặt hoạt động.',
        router: '/setting/office'
      },
      {
        icon: AuditOutlined,
        title: 'Bộ phận',
        description:
          'Quản lý thông tin các bộ phận trong tổ chức, bao gồm tên, chức năng và liên kết nhân sự.',
        router: '/setting/department'
      }
    ]
  },
  {
    id: 3,
    title: 'Cửa hàng',
    children: [
      {
        icon: ApartmentOutlined,
        title: 'Kho',
        description: 'Quản lý thông tin kho hàng, bao gồm tên kho, địa điểm, và cài đặt vận hành.',
        router: '/setting/inventory'
      },
      {
        icon: BlockOutlined,
        title: 'Nhà cung cấp',
        description:
          ' Quản lý thông tin nhà cung cấp, bao gồm tên, địa chỉ, liên hệ, và các điều khoản hợp tác.',
        router: '/setting/supplier'
      }
    ]
  },
  {
    id: 4,
    title: 'Đơn hàng',
    children: [
      {
        icon: NodeIndexOutlined,
        title: 'Phí vận chuyển',
        description:
          'Quản lý biểu phí vận chuyển theo khu vực, trọng lượng, và phương thức giao hàng.',
        router: '/setting/delivery-fee'
      }
    ]
  },
  {
    id: 4,
    title: 'Điều chỉnh bàn và khu vực',
    children: [
      {
        icon: AimOutlined,
        title: 'Khu vực',
        description: 'Quản lý số lượng khu vực để sắp xếp bàn hợp lý.',
        router: '/setting/group'
      },
      {
        icon: ContactsOutlined,
        title: 'Quản lý bàn',
        description: 'Thiết lập và điều chỉnh số lượng bàn trong khu vực phục vụ.',
        router: '/setting/room'
      }
    ]
  }
]

const goToPage = (data: any) => {
  router.push({ path: data.router })
}
</script>

<style lang="scss"></style>
