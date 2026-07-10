<template>
  <!-- <span class="mr-2">
  </span> -->
  <span class="" v-if="dayjs(time).isValid()">
<!--    {{ dayjs(time).format(TABLE_DATE_TIME_RENDER1) || '' }}-->
<!--    {{ dayjs(time).format('DD') || '' }} thg-->
    {{ dayjs(time).format(DATE_RENDER) || '' }}
  </span>
  <!-- <p class="text-C82">
    {{ dayjs(time).format(TABLE_DATE_TIME_RENDER1) || '' }}
  </p> -->
</template>

<script lang="ts" setup>
import { DATE_RENDER, TABLE_DATE_TIME_RENDER1, TABLE_DATE_TIME_RENDER2 } from '@/utils/dayjs-helper'
import dayjs from 'dayjs'
const props = withDefaults(defineProps<{ time: any }>(), {})
</script>
