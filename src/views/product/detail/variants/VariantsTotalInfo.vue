<template>
  <div>
    <p class="sub-heading md:mb-7 mb-4">
      Chúng tôi đã kết hợp các tùy chọn của bạn thành các biến thể sản phẩm. Bây giờ bạn có:
    </p>
    <div class="grid md:grid-cols-4 grid-cols-1 md:h-[60px] h-auto md:border-t-0 md:border-b-0 border-t border-b border-[gray]">
      <div class="md:border-b-0 border-b border-l md:border-r-0 border-r border-[gray] md:px-4 px-2">
        <p class="">Tổng sản phẩm</p>
        <p class="font-bold">{{ data.length }}</p>
      </div>
      <div class="md:border-b-0 border-b border-l md:border-r-0 border-r border-[gray] md:px-4 px-2">
        <p class="">Sản phẩm đã chọn</p>
        <p class="font-bold">{{ isUseData.length }}</p>
      </div>
      <div class="md:border-b-0 border-b border-l md:border-r-0 border-r border-[gray] md:px-4 px-2">
        <p class="">Giá tiền</p>
        <p class="font-bold">{{ currency(min) + ' - ' + currency(max) }}</p>
      </div>
      <div class="border-l border-r border-[gray] md:px-4 px-2">
        <p class="">Kho</p>
        <p class="font-bold">0</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { currency, currencyNumber } from '@/utils/currency'

//COMPONENTS

//PINIA

type Props = {
  data: any
}

const props = withDefaults(defineProps<Props>(), {})

const isUseData = computed(() => {
  return props.data?.filter((e: any) => e.isUse)
})

const min = computed((): number => {
  return isUseData.value?.reduce(
    (result: number, e: any) =>
      currencyNumber(e.unit_price) > result && result > 0 ? result : currencyNumber(e.unit_price),
    0
  )
})

const max = computed(() => {
  return isUseData.value?.reduce(
    (result: number, e: any) =>
      result > currencyNumber(e.unit_price) ? result : currencyNumber(e.unit_price),
    0
  )
})
</script>
