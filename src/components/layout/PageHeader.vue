<template>
  <header
    class="flex justify-between item-center bg-white w-full sm:px-7 px-4 py-3"
    style="border-bottom: 1px solid var(--color-CDE)"
  >
    <div class="flex items-center gap-2">
      <img class="h-8" src="@/assets/images/hnp.png" alt="HNP" />
      <p class="text-xl m-0 font-semibold !leading-[40px]">Newzen POS</p>
    </div>
    <div class="flex justify-end items-center gap-4">
      <div
        class="block sm:hidden cursor-pointer text-xl" 
        @click="pageMenuMobileDrawerRef?.show()"
      >
        <MenuOutlined />
      </div>
      <a-dropdown>
        <div class="flex justify-end items-center gap-x-3 cursor-pointer">
          <!-- <a-avatar :src="user?.profile_picture" :size="40" v-if="true" /> -->
          <a-avatar :size="40">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <div class="hidden sm:block">
            <p class="font-bold">{{ user?.username || '' }}</p>
            <!-- <p class="text-A9">Admin</p> -->
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
    </div>
    <page-menu-mobile-drawer ref="pageMenuMobileDrawerRef" />
  </header>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons-vue'
// COMPONENT
import PageMenuMobileDrawer from '@/components/layout/PageMenuMobileDrawer.vue'
//PINIA
import { useAuthStore } from '@/stores/auth'
// UTILS

const authStore = useAuthStore()

const { logout } = authStore
const pageMenuMobileDrawerRef = ref<InstanceType<typeof PageMenuMobileDrawer> | null>(null)
const user = computed(() => authStore.userInfo)
</script>

<style lang="scss"></style>
