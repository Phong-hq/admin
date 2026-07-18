<template>
  <div
    class="w-full h-full sm:flex-col hidden items-center gap-3 py-6 menu-list relative"
    :class="{ pinned }"
    @mouseleave="activeKeyHover = activeMenu"
    ref="railRef"
  >
    <div
      v-for="item in data"
      :key="item.key"
      class="flex-center w-11 h-11 menu-item"
      :class="{ active: isActiveCategory(item) }"
      @click="handleItemClick(item)"
    >
      <span
        class="menu-item-icon"
        :style="{ '-webkit-mask-image': `url(${item.icon})`, maskImage: `url(${item.icon})` }"
      ></span>
    </div>
    <div class="w-[256px] h-full absolute top-0 right-0 bg-white p-4 menu-list-item">
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
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
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})

const isActiveCategory = (data: any) => {
  if (!data?.menu || !data?.menu?.length) return false

  let children = data?.menu?.map((item: any) => item.children || []).flat()
  return children.find((item: any) => item.key === selectedKeys.value[0])
}

const handleClick = (data: any) => {
  pinned.value = false
  if (data?.key) {
    router.push({ name: data?.key })
  }
}

// Rail is expanded via CSS :hover for mouse users, and via a pinned/click state
// for touch devices (tablets at a sale counter), where :hover never fires.
const handleItemClick = (item: any) => {
  if (pinned.value && activeKeyHover.value === item.key) {
    pinned.value = false
    return
  }
  activeKeyHover.value = item.key
  pinned.value = true
}

const handleDocumentClick = (e: MouseEvent) => {
  if (pinned.value && railRef.value && !railRef.value.contains(e.target as Node)) {
    pinned.value = false
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

const railRef = ref<HTMLElement | null>(null)
const pinned = ref(false)
const selectedKeys = ref<string[]>(['product'])
const activeKeyHover = ref(data.value[0].key)
</script>

<style lang="scss" scoped>
.menu-list {
  border-radius: 20px;
  background: var(--color-sidebar);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 20px 36px -16px rgba(21, 19, 42, 0.4);

  .menu-item {
    cursor: pointer;
    border-radius: 12px;
    position: relative;
    transition: background-color 0.2s;

    .menu-item-icon {
      display: block;
      width: 22px;
      height: 22px;
      background-color: var(--color-sidebar-text);
      -webkit-mask-size: contain;
      mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-position: center;
      transition: background-color 0.2s;
    }

    &:hover {
      background-color: var(--color-sidebar-soft);
      .menu-item-icon {
        background-color: #fff;
      }
    }

    &.active {
      background-color: var(--color-primary);

      .menu-item-icon {
        background-color: #fff;
      }

      // signature: a die-cut price-tag corner on the active nav item
      &::after {
        content: '';
        position: absolute;
        top: 3px;
        right: 3px;
        width: 7px;
        height: 7px;
        background: var(--color-tag);
        clip-path: polygon(100% 0, 0 0, 100% 100%);
        border-radius: 0 4px 0 0;
      }
    }
  }

  .menu-list-item {
    transition: 0.15s;
    opacity: 0;
    pointer-events: none;
    transform: translateX(90%);
    border-radius: 18px;
    border: 1px solid rgba(226, 232, 240, 0.7);
    box-shadow:
      0 1px 2px rgba(15, 23, 42, 0.04),
      0 20px 36px -14px rgba(30, 27, 75, 0.18);

    :deep(.ant-menu) {
      border-inline-end: none !important;
    }

    :deep(.ant-menu-item-group-title) {
      position: relative;
      padding-left: 18px !important;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--color-C82);

      &::before {
        content: '';
        position: absolute;
        left: 4px;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 3px;
        border-radius: 2px;
        background: var(--color-tag);
      }
    }
  }

  &:hover .menu-list-item,
  &.pinned .menu-list-item {
    transition: transform 0.2s, opacity 0.2s;
    opacity: 1;
    pointer-events: all;
    transform: translateX(100%);
  }
}
</style>
