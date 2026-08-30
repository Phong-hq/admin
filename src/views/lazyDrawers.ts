import { defineAsyncComponent, type Component } from 'vue'

export const AddCategoryDrawerAsync: Component = defineAsyncComponent(
  () => import('@/views/category/AddCategoryDrawer.vue')
)
