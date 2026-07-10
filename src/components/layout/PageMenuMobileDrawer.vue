<template>
  <a-drawer
    placement="left"
    :visible="visible"
    title="Newzen POS"
    @close="visible = false"
    class="drawer-menu-mobile"
    :width="350"
  >
    <template #extra>
      <a-dropdown>
        <div class="flex justify-end items-center gap-x-3 cursor-pointer">
          <a-avatar :size="30">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <div>
            <p class="font-bold">{{ user?.username || '' }}</p>
          </div>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item class="h-10">
              <a-space>
                <LogoutOutlined />
                <p @click="logout">Đăng xuất</p>
              </a-space>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <div class="flex justify-center gap-4 items-center menu-list border-b border-CDE pb-4 mb-4">
      <div
        v-for="item in data"
        :key="item.key"
        class="flex-center w-[40px] h-[40px] p-1 menu-item"
        :class="{ active: isActiveCategory(item) }"
        @click="handleActiveMenuItem(item.key)"
      >
        <img :src="item.icon" alt="" />
      </div>
    </div>
    <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      :items="menu"
      @click="handleClick"
    ></a-menu>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'

// COMPONENT

//PINIA
import { useAuthStore } from '@/stores/auth'

// UTILS
import { listMenu } from '@/utils/menu'

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()

const { logout } = authStore
const visible = ref<boolean>(false)
const user = computed(() => authStore.userInfo)
const data = computed(() => listMenu)

const menu = computed(() => {
  return data.value.find((item) => item.key === activeKeyHover.value)?.menu || []
})

const isActiveCategory = (data: any) => {
  if (!data?.menu || !data?.menu?.length) return false

  let children = data?.menu?.map((item: any) => item.children || []).flat()
  return children.find((item: any) => item.key === selectedKeys.value[0])
}

const handleClick = (data: any) => {
  if(visible.value) {
    visible.value = false
  }
  if (data?.key) {
    router.push({ name: data?.key })
  }
}

const getActiveKey = () => {
  selectedKeys.value = []
  if (route?.matched.length > 1) {
    for (let i = 1; i < route?.matched.length; i++) {
      selectedKeys.value.push(String(route?.matched[i].name))
    }
  } else {
    selectedKeys.value[0] = String(route.name)
  }
}

router.afterEach(() => {
  getActiveKey()
})

const selectedKeys = ref<string[]>(['product'])
const activeKeyHover = ref(data.value[0].key)
const handleActiveMenuItem = (key: string) => {
  visible.value = true
  activeKeyHover.value = key
}
const show = () => {
  visible.value = true
}
const hide = () => {
  visible.value = false
}
onMounted(() => {
  getActiveKey()
})
defineExpose({ show, hide })
</script>

<style lang="scss" scoped>
@media (min-width: 640px) {
  .menu-list {
    .menu-item {
      cursor: pointer;
      border-radius: 8px;
      &:hover,
      &.active {
        transition: 0.2s;
        background-color: var(--color-primary);
        img {
          filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(31deg) brightness(105%)
            contrast(101%);
        }
      }
    }
    .menu-list-item {
      transition: 0.1s;
      opacity: 0;
      pointer-events: none;
      transform: translateX(90%);
      .ant-menu {
        border-inline-end: none !important;
      }
    }
    &:hover {
      .menu-list-item {
        transition: transform 0.2s;
        opacity: 1;
        pointer-events: all;
        transform: translateX(100%);
      }
    }
  }
}
.menu-list {
  .menu-item {
    cursor: pointer;
    border-radius: 8px;
    &.active {
      transition: 0.2s;
      background-color: var(--color-primary);
      img {
        filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(31deg) brightness(105%)
          contrast(101%);
      }
    }
  }
}
:deep(.ant-drawer-body){
  padding: 16px !important;
}
</style>
