<template>
  <a-popover overlayClassName="max-w-[250px]" placement="right">
    <template #content>
      <p class="font-semibold">Giá</p>
      <p class="mb-2">{{ currency(data?.unit_price || 0) }}</p>
      <p class="font-semibold">SKU</p>
      <p class="mb-2">{{ data?.sku ?? data?.product_variant?.sku ?? '' }}</p>
      <p class="font-semibold">Barcode</p>
      <p class="">{{ data?.product_variant?.barcode ?? data?.barcode }}</p>
    </template>
    <template #title>
      <div class="sc-full flex-center flex-col gap-2">
        <product-image
          class="w-[60px] max-h-[80px]"
          :image="data?.product_variant?.images ?? data?.images ?? ''"
        />
        <p class="text-center">{{ data?.name ?? data?.product_variant?.name }}</p>
        <a-divider class="!my-0" />
      </div>
    </template>
      <slot />
  </a-popover>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { tryParseJson, isJsonString } from '@/utils/json'
import { currency } from '../../../utils/currency'
import ProductImage from '@/components/common/image/ProductImage.vue'
import { useRouter } from 'vue-router'

// COMPONENT

// PINIA

//UTILS

type Props = {
  data: any
}

const props = withDefaults(defineProps<Props>(), {})
const router = useRouter()
// const image = computed(() => {
//   if(isJsonString(props.data?.images)) {
//     return JSON.parse(props.data?.images)[0]
//   } else {
//     return props.data?.images || ''
//   }
// })

const goToPageProduct = () => {
  router.push({ name: 'product-detail', params: { id: 1 } })
}

onMounted(() => {})
</script>

<style lang="scss"></style>
