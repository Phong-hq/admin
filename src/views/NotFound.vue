<template>
  <div class="flex-center w-screen h-screen">
    <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
      <template #extra>
        <a-button type="primary" @click="goToHome">Back Home</a-button>
      </template>
    </a-result>
  </div>
</template>

<script lang="ts" setup>
const goToHome = () => {
  window.location.href = '/' // Replace with your desired home page URL
}
</script>
