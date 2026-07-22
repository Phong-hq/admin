<template>
  <a-drawer
    placement="left"
    :visible="visible"
    title="Newzen POS"
    @close="visible = false"
    class="drawer-menu-mobile"
    :width="350"
  >
    <div class="flex justify-center gap-3 items-center menu-list border-b border-CDE pb-4 mb-4">
      <div
        v-for="item in data"
        :key="item.key"
        class="flex-center w-11 h-11 menu-item"
        :class="{ active: isActiveCategory(item) }"
        @click="handleActiveMenuItem(item.key)"
      >
        <span
          class="menu-item-icon"
          :style="{ '-webkit-mask-image': `url(${item.icon})`, maskImage: `url(${item.icon})` }"
        ></span>
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
import { useRoute, useRouter } from 'vue-router'

// COMPONENT

// UTILS
import { listMenu } from '@/utils/menu'

const route = useRoute()
const router = useRouter()

const visible = ref<boolean>(false)
const data = computed(() => listMenu)

const menu = computed(() => {
  return data.value.find((item) => item.key === activeKeyHover.value)?.menu || []
})

const isActiveCategory = (data: any) => {
  if (!data?.menu || !data?.menu?.length) return false

  const groupKeys = data.menu.map((item: any) => item.key)
  const children = data.menu.map((item: any) => item.children || []).flat()
  return selectedKeys.value.some(
    (key) => groupKeys.includes(key) || children.find((item: any) => item.key === key)
  )
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
const activeKeyHover = ref(data.value[0].key)
const handleActiveMenuItem = (key: string) => {
  visible.value = true
  activeKeyHover.value = key
}
const show = () => {
  const activeItem = data.value.find((item) => isActiveCategory(item))
  if (activeItem) {
    activeKeyHover.value = activeItem.key
  }
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
.menu-list {
  .menu-item {
    cursor: pointer;
    border-radius: 12px;
    position: relative;
    transition: background-color 0.2s;

    .menu-item-icon {
      display: block;
      width: 22px;
      height: 22px;
      background-color: var(--color-C82);
      -webkit-mask-size: contain;
      mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-position: center;
      transition: background-color 0.2s;
    }

    &.active {
      background-color: var(--color-primary);

      .menu-item-icon {
        background-color: #fff;
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
:deep(.ant-drawer-body){
  padding: 16px !important;
}
</style>
