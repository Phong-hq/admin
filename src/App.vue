<template>
<!--  <c-json-editor :model-value="isRouterReadys" />-->

  <a-config-provider
    :theme="{
      token: ANT_CONFIG_TOKEN
    }"
  >
    <a-style-provider hash-priority="hight">
      <component :is="layout" v-if="isRouterReady">
        <router-view />
      </component>
      <div class="h-screen flex-center" v-else>
       <c-spin />
      </div>
      <modal-confirm />

    </a-style-provider>
  </a-config-provider>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, provide, watch, onBeforeUnmount } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { ANT_CONFIG_TOKEN } from '@/constant/ant'
import C, { defineRootColor } from '@/constant/color'
import { setAxiosInstance } from '@/plugins/axios'
import VI from 'ant-design-vue/es/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

// COMPONENT
import DefaultLayout from '@/components/layout/PageDefault.vue'
import BlankLayout from '@/components/layout/Blank.vue'
import ModalConfirm from './components/modal/Confirm.vue'
import CSpin from '@/components/common/spin/CSpin.vue'
//PINIA
import { useAuthStore } from './stores/auth'
import { useSelectDataStore } from './stores/select_data'
import { useRootStore } from './stores/root'
import CJsonEditor from '@/components/common/input/CJsonEditor.vue'

dayjs.locale('vi');

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()
 

const { getUserInfo } = authStore
const { getSelectList, getGroupList  } = selectDataStore
const { startTracking, stopTracking } = rootStore

const reloadCount = computed(() => authStore.reloadCount)
const layout = computed(() => {
  switch (route?.meta?.layout) {
    case 'blank': {
      return BlankLayout
    }
    default: {
      return DefaultLayout
    }
  }
})

onMounted(async () => {
  defineRootColor()
  try {
    //CHECK TOKEN LOCAL
    const token = localStorage.getItem('access_token')
    if (!token) {
      setTimeout(() => {
        isRouterReady.value = true
      }, 1000)
      return
    }

    setAxiosInstance(token)
    await getGroupList()
    initDataConfig()
    await router.isReady()
  } catch (error) {
    console.log(error)
  }
  isRouterReady.value = true
  startTracking()
})

onBeforeUnmount(() => {
  stopTracking()
})

const initDataConfig = () => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      isRouterReady.value = false
      // getSelectList()
      await Promise.allSettled([getUserInfo()])
      resolve
    } catch (error) {
      reject(error)
    }
    isRouterReady.value = true
  })
}

const isRouterReady = ref(true)

watch(
  () => reloadCount.value,
  (newValue) => {
    if (newValue) {
      initDataConfig()
    }
  }
)
</script>

<style></style>
