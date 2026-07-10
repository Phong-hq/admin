<template>
  <a-button type="primary" @click="openFilter()">
    <template #icon><filter-outlined /></template>
    Lọc {{ count }}
  </a-button>
  <a-drawer 
    v-model:open="open"
    :title="'Lọc đơn hàng'"
    :width="isMobileComputed ? 350 : 500"
  >
    <div class="">
      <a-form
        :model="formStateClone"
        ref="formRef"
        name="basic"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        labelWrap
        autocomplete="off"
      >
        <a-form-item class="" label="Chọn ngày:" name="date">
          <div class="sm:hidden block w-full">
            <c-date-range-picker-mobile :is-show-summit="false" class="w-full" v-model:value="formStateClone.date" />
          </div>
          <div class="sm:block hidden">
            <c-date-range-picker class="!w-full" v-model:value="formStateClone.date" />
          </div>
        </a-form-item>

        <a-form-item class="" label="Chọn chi nhánh:" name="inventory_id">
          <c-select-search
            v-model:value="formStateClone.inventory_id"
            placeholder=""
            default-data="inventory"
          />
        </a-form-item>

        <a-form-item class="" label="Chọn kho:" name="office_id">
          <c-select-search
            v-model:value="formStateClone.office_id"
            placeholder=""
            default-data="inventory"
          />
        </a-form-item>

        <div class="flex-center gap-2">
          <a-button type="primary" @click="filter">Lọc</a-button>
          <a-button type="primary" ghost @click="reset">Xóa tất cả</a-button>
        </div>
      </a-form>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import AddCategoryDrawer from '@/views/category/AddCategoryDrawer.vue'
import type { Dayjs } from 'dayjs'
import { FilterOutlined } from '@ant-design/icons-vue'

// COMPONENT
import CreateButton from '@/components/common/button/CreateButton.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import CDateRangePicker from '@/components/common/date-picker/CDateRangePicker.vue'
import CDateRangePickerMobile from '@/components/common/date-picker/CDateRangePickerMobile.vue'

// PINIA
import { useRootStore } from '@/stores/root'
//UTILS

type Props = {
  data: any
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'getData', data: any): void
}>()
const rootStore = useRootStore()
const isMobileComputed = computed(() => rootStore.isMobile)
const count = computed(() => {
  let result = 0
  if (props.data?.date && props.data?.date?.length > 0) result = result + 1
  if (props.data?.office_id) result = result + 1
  if (props.data?.inventory_id) result = result + 1
  return result > 0 ? `(${result})` : ''
})

onMounted(() => {})

const formState = reactive({
  date: null as [Dayjs, Dayjs] | null,
  office_id: null as any,
  inventory_id: null as any
})

const formStateClone = reactive({
  date: [null, null] as [Dayjs | null, Dayjs | null],
  office_id: null as any,
  inventory_id: null as any
})
const open = ref(false)

const openFilter = () => {
  formStateClone.date = props.data?.date ?? [null, null]
  formStateClone.office_id = props.data?.office_id ?? undefined
  formStateClone.inventory_id = props.data?.inventory_id ?? undefined
  open.value = true
}

const filter = () => {
  emits('getData',formStateClone)
  open.value = false
}

const reset = () => {
  formStateClone.date = [null, null]
  formStateClone.office_id = undefined
  formStateClone.inventory_id = undefined
  emits('getData',formStateClone)
  open.value = false
}
</script>

<style lang="scss"></style>
