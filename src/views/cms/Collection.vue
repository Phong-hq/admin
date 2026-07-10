<template>
  <div
    class="h-full bg-white flex-col px-4 py-7"
    style="border-right: 1px solid var(--color-CDE); border-left: 1px solid var(--color-CDE)"
  >
    <c-search class="shrink-0" v-model:value="search" />
    <div class="grow overflow-y-auto my-4">
      <div
        class="p-4 truncate hover:bg-item_hover cursor-pointer rounded-md mb-2"
        :class="{ 'bg-item_hover': active == item.id }"
        v-for="item in collectionsRender"
        :key="item.id || 0"
        @click="handleSelectCollection(item.id)"
      >
        {{ item.name }}
      </div>
    </div>
    <a-button type="primary" @click="emits('createCollection')">Tạo mới CMS</a-button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'

//UTILS
import { useDebounce } from '@/utils/debounce'

//PINIA
import { useCmsStore } from '@/stores/cms'
import { handle_error } from '@/utils/message'

//COMPONENT
import CSearch from '@/components/common/input/CSearch.vue'

type Props = {
  activeCollection: any
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'update:activeCollection', id: any): void
  (e: 'createCollection'): void
  (e: 'getData'): void
}>()

const cmsStore = useCmsStore()

const { getCmsCollection } = cmsStore

const active = computed({
  get() {
    return props.activeCollection
  },
  set(value) {
    emits('update:activeCollection', value)
  }
})
const collections = computed(() => cmsStore.collectionList)
const collectionsRender = computed(() => {
  if (!search.value) return collections.value
  return collections.value.filter((item) =>
    item.name?.toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(() => {
  initData()
  // cmsStore.deleteCmsCollection(67)
})

const search = ref('')

const initData = async () => {
  try {
    await getCmsCollection()
    const currentCollection = collections.value.find((e) => e.id == active.value)
    if (active.value == null || !currentCollection) {
      handleSelectCollection(collections.value[0].id)
    }
  } catch (error) {
    handle_error(error)
  }
}

const handleSelectCollection = (id: any) => {
  active.value = id
  getRecordDebounce()
}

const getRecordDebounce = useDebounce(() => {
  emits('getData')
}, 300)

defineExpose({ initData })
</script>
