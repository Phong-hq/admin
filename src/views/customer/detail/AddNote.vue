<template>
  <create-button type="primary" @click="showModal">Tạo ghi chú</create-button>
  <a-modal v-model:open="open" title="Tạo ghi chú" @ok="handleOk">
    <p class="heading-2">Ghi chú</p>
    <a-input class="!w-full" @keydown.enter="handleOk" v-model:value="note"  />
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
  (e: 'addNote', id: any): void
}>()

const selectDataStore = useSelectDataStore()

onMounted(() => {
  selectDataStore.getContactList()
})
const open = ref<boolean>(false)
const note = ref(null)

const showModal = () => {
  note.value = null
  open.value = true
}

const handleOk = () => {
 if(note.value) {
   emits('addNote', note.value)
 }
  open.value = false
}
</script>

<style lang="scss"></style>