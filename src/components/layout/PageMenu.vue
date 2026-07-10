<template>
  <div class="w-full h-full sm:flex-col hidden items-center gap-4 bg-white py-7 menu-list relative" @mouseleave="activeKeyHover = activeMenu">
    <div
      v-for="item in data"
      :key="item.key"
      class="flex-center w-[40px] h-[40px] p-1 menu-item"
      :class="{ active: isActiveCategory(item) }"
      @click="activeKeyHover = item.key"
    >
      <img :src="item.icon" alt="" />
    </div>
    <div
      class="w-[256px] h-full absolute top-0 right-0 bg-white p-4 menu-list-item border border-CDE"
    >
      <a-menu
        v-model:selectedKeys="selectedKeys"
        style="width: 224px"
        mode="inline"
        :items="menu"
        @click="handleClick"
      ></a-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// COMPONENT

//PINIA

// UTILS
import { listMenu } from '@/utils/menu'


const route = useRoute()
const router = useRouter()

const data = computed(() => listMenu)

const menu = computed(() => {
  return data.value.find((item) => item.key === activeKeyHover.value)?.menu || []
})
const activeMenu = computed(() => data.value.find((item) => isActiveCategory(item))?.key || '')

onMounted(() => {
  getActiveKey()
})

const isActiveCategory = (data: any) => {
  if (!data?.menu || !data?.menu?.length) return false

  let children = data?.menu?.map((item: any) => item.children || []).flat()
  return children.find((item: any) => item.key === selectedKeys.value[0])
}

const handleClick = (data: any) => {
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
</script>

<style lang="scss" scoped>
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
</style>
