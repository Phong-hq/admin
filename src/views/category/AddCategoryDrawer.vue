<template>
  <div @click="quickCreate()">
    <slot name="button"></slot>
  </div>
  <a-drawer
    class="h-[70vh] drawer-menu-mobile"
    v-model:open="open"
    :title="isEdit ? 'Cập nhật' : 'Thêm danh mục'"
    placement="right"
    :width="isMobileComputed ? 350 : 500"
  >
    <template #footer>
      <div class="flex justify-end gap-4">
        <a-button @click="hide">Hủy</a-button>
        <a-button type="primary" @click="onFinish" :loading="loading">{{
          isEdit ? 'Cập nhật' : 'Tạo'
        }}</a-button>
      </div>
    </template>
    <div class="sc-full flex flex-col">
      <a-form
        :model="formState"
        class="form-2"
        ref="formRef"
        name="basic"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :rules="rules"
        labelWrap
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        @keyEnter="onFinish"
      >
        <a-form-item class="!col-span-2" label="Tên danh mục" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item class="!col-span-2" label="Mã danh mục" name="code">
          <a-input v-model:value="formState.code" />
        </a-form-item>

        <a-form-item class="!col-span-2" label="Mô tả" name="description">
          <a-textarea class="!min-h-[100px]" v-model:value="formState.description" auto-size />
        </a-form-item>

        <a-form-item class="!col-span-2" label="Chọn nhãn hiệu" name="brands">
          <div class="flex flex-col gap-2">
            <div
              class="flex items-center gap-2"
              v-for="(_, index) in formState.brands"
              :key="index"
              draggable="true"
              @mousedown="handleBrandRowMousedown"
              @mouseup="handleBrandRowMouseup"
              @dragstart="handleBrandDragStart(index, $event)"
              @dragover.prevent
              @drop="handleBrandDrop(index, $event)"
              @dragend="handleBrandDragEnd"
            >
              <holder-outlined class="js-brand-drag-handle cursor-move text-gray shrink-0" />
              <c-select-search
                class="!flex-1"
                v-model:value="formState.brands[index]"
                placeholder="Vd: samsung, apple, ..."
                :search="selectDataStore.searchBrandList"
                default-data="brand"
                :extra-data="formState.brands_data"
              />
              <delete-outlined
                class="cursor-pointer text-error shrink-0"
                @click="removeBrandRow(index)"
              />
            </div>
            <div class="flex-center gap-2">
              <a-button type="dashed" class="!flex-1" @click="addBrandRow">
                <template #icon>
                  <plus-outlined />
                </template>
                Thêm nhãn hiệu
              </a-button>
              <add-brand-drawer>
                <template #button>
                  <create-button />
                </template>
              </add-brand-drawer>
            </div>
          </div>
        </a-form-item>

        <a-form-item class="!col-span-2" label="Icon" name="icon">
          <a-select
            class="!w-full"
            v-model:value="formState.icon"
            placeholder="Chọn icon"
            allow-clear
            show-search
            option-filter-prop="label"
            :options="CATEGORY_ICON_OPTIONS"
          >
            <template #option="{ label, svg }">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 shrink-0" v-html="svg"></span>
                <span>{{ label }}</span>
              </div>
            </template>
          </a-select>
          <div class="flex items-center gap-2 mt-2 text-gray" v-if="selectedIcon">
            <span class="w-6 h-6 shrink-0" v-html="selectedIcon"></span>
            <span>{{ CATEGORY_ICON_LABELS[formState.icon] || formState.icon }}</span>
          </div>
        </a-form-item>

        <a-form-item class="!col-span-2" label="Trạng thái" name="status">
          <c-checkbox-number v-model="formState.status"
            ><p class="font-semibold">Kích hoạt</p></c-checkbox-number
          >
        </a-form-item>

        <!-- <a-form-item class="!col-span-2" label="Trạng thái" name="status" v-if="isEdit">
          <c-select v-model:value="formState.status" :data="STATUS_ACTIVE_DATA" />
        </a-form-item> -->

        <a-form-item class="!col-span-2 flex-center !pt-7 !hidden">
          <a-button class="" type="primary" html-type="submit" :loading="loading">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>


<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { PlusOutlined, HolderOutlined, DeleteOutlined } from '@ant-design/icons-vue'

//COMPONENTS
import CCheckboxNumber from '@/components/common/checkbox/CCheckboxNumber.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import AddBrandDrawer from '@/views/brand/AddBrandDrawer.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

//PINIA
import { useCategoryStore } from '@/stores/category'
import { useSelectDataStore } from '@/stores/select_data'
import { useRootStore } from '@/stores/root'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

//CONSTANT
import {
  CATEGORY_ICONS,
  CATEGORY_ICON_LABELS,
  CATEGORY_ICON_OPTIONS
} from '@/constant/category-icon'

//TYPES
import type { SelectConfigItem } from '@/types/index'

const emits = defineEmits<{
  (e: 'getData'): void
}>()

const categoryStore = useCategoryStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()

const { createCategory, updateCategory } = categoryStore
const isMobileComputed = computed(() => rootStore.isMobile)
const rules = computed(() => {
  return {
    name: [{ required: !isEdit.value, message: 'Tên danh mục bỏ trống!', trigger: 'blur' }]
  }
})
const isEdit = computed(() => formState.id != null)

type FORM = {
  id: number | null
  name: string
  code: string
  description: string
  status: number
  icon: string
  brands: (number | null)[]
  brands_data: SelectConfigItem[]
}

type CATEGORY_PAYLOAD = Omit<FORM, 'brands_data' | 'icon' | 'brands'> & {
  icon: string[]
  brands: number[]
}

const formState = reactive<FORM>({
  id: null,
  name: '',
  code: '',
  description: '',
  status: 0,
  icon: '',
  brands: [],
  brands_data: []
})

const selectedIcon = computed(() => CATEGORY_ICONS[formState.icon] || '')

const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const isQuickCreate = ref(false)

const show = async (data?: any) => {
  await formRef.value?.clearValidate()
  reset(data)
  open.value = true
}

const hide = () => {
  open.value = false
}

const onFinish = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    const { brands_data, ...data }: FORM = { ...formState }
    const payload: CATEGORY_PAYLOAD = {
      ...data,
      icon: data.icon ? [data.icon] : [],
      brands: data.brands.filter((id): id is number => id != null)
    }

    if (isEdit.value) {
      await updateCategory(payload.id, payload)
    } else await createCategory(payload)
    if(isQuickCreate.value) await selectDataStore.getCategoryList(true)
    handle_success(isEdit.value ? 'Cập nhật thành công!' : 'Thêm thành công!')
    emits('getData')
    hide()
  } catch (error) {
    handle_error(error)
  }
  loading.value = false
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

const reset = (data?: any) => {
  formState.id = null
  loading.value = false
  isQuickCreate.value = false
  if (data) formState.id = data?.id
  formState.name = data?.name || ''
  formState.code = data?.code || ''
  formState.description = data?.description || ''
  const iconKey = Array.isArray(data?.icon) ? data.icon[0] : data?.icon
  formState.icon = typeof iconKey === 'string' && CATEGORY_ICONS[iconKey] ? iconKey : ''
  formState.brands = data?.brands?.map((brand: any) => brand?.id) || []
  formState.brands_data =
    data?.brands?.map((brand: any) => {
      return {
        value: brand?.id,
        label: brand?.name,
        image: brand?.icon
      }
    }) || []
  formState.status = data?.status || 0
}

const handleChange = (e: any) => {
  console.log(e)
}

const addBrandRow = () => {
  formState.brands.push(null)
}

const removeBrandRow = (index: number) => {
  formState.brands.splice(index, 1)
}

// mousedown fires on the actual handle icon; dragstart fires on the ancestor
// that has draggable=true (the row div), so the handle restriction is tracked separately.
const canDragBrandRow = ref(false)
const dragBrandIndex = ref<number | null>(null)

const handleBrandRowMousedown = (event: MouseEvent) => {
  canDragBrandRow.value = !!(event.target as HTMLElement).closest('.js-brand-drag-handle')
}

const handleBrandRowMouseup = () => {
  canDragBrandRow.value = false
}

const handleBrandDragStart = (index: number, event: DragEvent) => {
  if (!canDragBrandRow.value) {
    event.preventDefault()
    return
  }
  dragBrandIndex.value = index
  event.dataTransfer?.setData('text/plain', String(index))
}

const handleBrandDrop = (index: number, event: DragEvent) => {
  event.preventDefault()
  if (dragBrandIndex.value === null || dragBrandIndex.value === index) {
    dragBrandIndex.value = null
    return
  }
  const [moved] = formState.brands.splice(dragBrandIndex.value, 1)
  formState.brands.splice(index, 0, moved)
  dragBrandIndex.value = null
}

const handleBrandDragEnd = () => {
  dragBrandIndex.value = null
  canDragBrandRow.value = false
}

const quickCreate = () => {
  show()
  isQuickCreate.value = true
  formState.status = 1
}

defineExpose({ show })
</script>
