<template>
  <create-button type="primary" @click="showModal">Chèn liên hệ</create-button>
  <a-modal v-model:open="open" title="Chèn liên hệ khách hàng" @ok="handleOk">
    <p class="heading-2">Chọn nhiều liên hệ</p>
    <c-select-search class="!w-full" v-model:value="contact_id" default-data="contact" />
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import CreateButton from '@/components/common/button/CreateButton.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'

// COMPONENT

// PINIA
import { useSelectDataStore } from '@/stores/select_data'

//UTILS

const emits = defineEmits<{
  (e: 'addContact', id: any): void
}>()

const selectDataStore = useSelectDataStore()

onMounted(() => {
  selectDataStore.getContactList()
})
const open = ref<boolean>(false)
const contact_id = ref(null)

const showModal = () => {
  contact_id.value = null
  open.value = true
}

const handleOk = () => {
 if(contact_id.value) {
   emits('addContact', contact_id.value)
 }
  open.value = false
}
</script>

<style lang="scss"></style>