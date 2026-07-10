<template>
  <a-breadcrumb class="!mb-4" v-if="data?.length > 0">
    <a-breadcrumb-item :disabled="true">
      <home-outlined />
      <span>Trang chủ</span>
    </a-breadcrumb-item>
    <a-breadcrumb-item
      :class="{ 'cursor-pointer': item?.router }"
      :href="item?.router"
      @click.prevent="handleClick(item)"
      v-for="(item, i) in data"
      :key="i"
    >
      <span v-if="i == data.length - 1">{{ page || item?.label }}</span>
      <a :href="item?.router" v-else-if="item?.router">
        <span>{{ item?.label }}</span>
      </a>
      <span v-else>{{ item?.label }}</span>
    </a-breadcrumb-item>
    <!--    <a-breadcrumb-item v-if="page">{{ page }}</a-breadcrumb-item>-->
  </a-breadcrumb>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { HomeOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'

// COMPONENT

// PINIA

//UTILS

interface Props {
  page?: string
}

const props = withDefaults(defineProps<Props>(), { page: '' })

const router = useRouter()
const route = useRoute()

const data = computed<any>(() => route.meta?.breadcrumb || [])

onMounted(() => {})

const handleClick = (item: any) => {
  if (item?.router) router.push({ path: item?.router })
}
</script>

<style lang="scss"></style>
