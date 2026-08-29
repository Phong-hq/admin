<template>
  <nav class="header-menu flex items-center gap-2">
    <a-dropdown v-for="item in data" :key="item.key" :trigger="['hover']" placement="bottomLeft" overlay-class-name="header-menu-dropdown">
      <div class="flex-center w-11 h-11 menu-item" :class="{ active: isActiveCategory(item) }">
        <img :src="item.icon" width="24" height="24" alt="" class="menu-item-icon" />
      </div>
      <template #overlay>
        <a-menu v-model:selectedKeys="selectedKeys" :items="item.menu" @click="handleClick"></a-menu>
      </template>
    </a-dropdown>
  </nav>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// UTILS
import { listMenu } from '@/utils/menu'

const route = useRoute()
const router = useRouter()

const data = computed(() => listMenu)

const isActiveCategory = (data: any) => {
  if (!data?.menu || !data?.menu?.length) return false

  const groupKeys = data.menu.map((item: any) => item.key)
  const children = data.menu.map((item: any) => item.children || []).flat()
  return selectedKeys.value.some(
    (key) => groupKeys.includes(key) || children.find((item: any) => item.key === key)
  )
}

const handleClick = (data: any) => {
  if (data?.key) {
    router.push({ name: data?.key })
  }
}

const getActiveKey = () => {
  selectedKeys.value = []
  if (route?.matched.length > 1) {
    for (let i = 0; i < route?.matched.length; i++) {
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

onMounted(() => {
  getActiveKey()
})
</script>

<style lang="scss" scoped>
.header-menu {
  .menu-item {
    cursor: pointer;
    border-radius: 12px;
    position: relative;
    transition: background-color 0.2s;

    .menu-item-icon {
      display: block;
      width: 24px;
      height: 24px;
      object-fit: contain;
      transition: filter 0.2s;
    }

    &:hover {
      background-color: var(--color-primary-bg);
    }

    &.active {
      background-color: var(--color-primary);

      .menu-item-icon {
        filter: brightness(0) invert(1);
      }

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
}
</style>

<style lang="scss">
.header-menu-dropdown {
  .ant-menu {
    border-radius: 14px;
    padding: 8px;
    border-inline-end: none !important;
    box-shadow:
      0 1px 2px rgba(15, 23, 42, 0.04),
      0 20px 36px -14px rgba(30, 27, 75, 0.18);
  }

  .ant-menu-item-group-title {
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
</style>
