<template>
  <header class="app-header flex justify-between items-center sm:mx-4 mx-3 sm:mt-4 mt-3 sm:px-6 px-4 py-3">
    <div class="flex items-center gap-3">
      <div class="mobile-menu-btn cursor-pointer text-lg" @click="pageMenuMobileDrawerRef?.show()">
        <MenuOutlined />
      </div>
    </div>
    <div class="flex justify-end items-center gap-4">
      <a-dropdown>
        <div class="flex justify-end items-center gap-x-3 cursor-pointer group">
          <a-avatar :size="38" :src="logoImage" class="user-avatar" />
          <div class="hidden sm:block">
            <p class="font-bold !mb-0 leading-tight">{{ user?.username || '' }}</p>
          </div>
          <DownOutlined class="hidden sm:block text-xs text-C82 transition-transform group-hover:rotate-180" />
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
    </div>
    <page-menu-mobile-drawer ref="pageMenuMobileDrawerRef" />
  </header>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { LogoutOutlined, MenuOutlined, DownOutlined } from '@ant-design/icons-vue'
// COMPONENT
import PageMenuMobileDrawer from '@/components/layout/PageMenuMobileDrawer.vue'
import logoImage from '@/assets/images/hnp.png'
//PINIA
import { useAuthStore } from '@/stores/auth'
// UTILS

const authStore = useAuthStore()

const { logout } = authStore
const pageMenuMobileDrawerRef = ref<InstanceType<typeof PageMenuMobileDrawer> | null>(null)
const user = computed(() => authStore.userInfo)
</script>

<style lang="scss" scoped>
.app-header {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.7);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 12px 24px -14px rgba(30, 27, 75, 0.14);
}

.user-avatar {
  box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px var(--color-primary-bg);
}

.mobile-menu-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--color-primary-bg);
  color: var(--color-primary);
}
</style>
