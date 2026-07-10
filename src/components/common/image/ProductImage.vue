<template>
  <img class="" :src="getImage(image)" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { SelectConfig } from '@/types'
import { isJsonString } from '@/utils/json'

// COMPONENT

// PINIA

//UTILS

interface Props {
  image: string
}

const props = withDefaults(defineProps<Props>(), {  })

const getImage = (value: string) => {
  if (isJsonString(value)) {
    return JSON.parse(value)[0]
  } else {
    return value || ''
  }
}

onMounted(() => {
})

</script>

<style lang="scss">

</style>