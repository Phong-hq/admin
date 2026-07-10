<template>
  <div class="w-full flex-col main">
    <page-header class="shrink-0"/>
    <div class="w-full grid sm:grid-cols-[60px_auto] grid-cols-1 sm:grow overflow-hidden">
      <page-menu class="z-[10] h-full" />
      <div
        class="absolute inset-0 sc-full flex justify-center p-7 pt-[100px] bg-[#cfcfcf5e] z-[10000]"
        v-if="loading"
      >
        <a-spin size="large"></a-spin>
      </div>
      <main
        class="w-full px-4 sm:py-7 py-4 overflow-auto relative"
        :class="{ '!p-0': isNoPadding, '!overflow-hidden': loading }"
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

<style lang="scss"></style>
