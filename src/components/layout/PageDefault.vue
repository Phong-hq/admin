<template>
  <div class="w-full flex-col main overflow-hidden">
    <page-header class="shrink-0" />
    <div class="w-full grid sm:grid-cols-[auto] grid-cols-1 sm:grow overflow-hidden gap-4 sm:p-4 p-3">
      <!-- <page-menu class="z-[10] h-full" /> -->
      <div
        class="absolute inset-0 sc-full flex justify-center p-7 pt-[100px] bg-[#cfcfcf5e] backdrop-blur-sm z-[10000]"
        v-if="loading"
      >
        <a-spin size="large"></a-spin>
      </div>
      <main
        class="content-surface w-full px-4 sm:py-7 py-4 overflow-auto relative bg-white rounded-[20px] transition-shadow duration-300"
        :class="{ '!p-0 !rounded-none !shadow-none': isNoPadding, '!overflow-hidden': loading }"
      >
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// COMPONENT
import PageHeader from '@/components/layout/PageHeader.vue'
import PageMenu from './PageMenu.vue'

//PINIA
import { useRootStore } from '@/stores/root'

const rootStore = useRootStore()
const route = useRoute()

const isNoPadding = computed(() => route?.meta?.no_padding)
const loading = computed(() => rootStore.loadingPage)
</script>

<style lang="scss" scoped>
.main {
  background-color: var(--color-canvas);
  background-image: radial-gradient(circle at 12% 0%, rgba(79, 70, 229, 0.06), transparent 42%);
}

.content-surface {
  border: 1px solid rgba(226, 232, 240, 0.7);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 16px 32px -12px rgba(30, 27, 75, 0.12);
}
</style>
