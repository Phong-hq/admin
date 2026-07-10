<template>
  <svg
    class="mx-auto"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-v-b1c1fcaa=""
    v-if="value == 1"
  >
    <circle cx="15" cy="15" r="15" fill="#219653" data-v-b1c1fcaa=""></circle>
    <path
      d="M20.8824 10.5879L12.7941 18.6761L9.11765 14.9997"
      stroke="white"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      data-v-b1c1fcaa=""
    ></path>
  </svg>
  <svg class="mx-auto" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" v-else-if="value == -1">
    <circle cx="15" cy="15" r="15" fill="#e03636"></circle>
    <path
      d="M20.8824 10.5879L12.7941 18.6761L9.11765 14.9997"
      stroke="white"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
  <svg
    class="mx-auto"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-v-b1c1fcaa=""
    v-else
  >
    <circle cx="15" cy="15" r="15" fill="#C7C7C7" data-v-b1c1fcaa=""></circle>
    <path
      d="M20.8824 10.5879L12.7941 18.6761L9.11765 14.9997"
      stroke="white"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      data-v-b1c1fcaa=""
    ></path>
  </svg>

</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{ value: number }>(), {})
</script>
