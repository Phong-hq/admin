<template>
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
  >
    <a-form-item class="!col-span-2" label="Danh mục:" name="category_id">
      <div class="flex-center gap-2">
        <c-select
          :data="categoryOptions"
          v-model:value="formState.category_id"
          has-search
          placeholder="Chọn danh mục"
          @change="handleCategoryChange"
        />
        <add-category-drawer @get-data="fetchCategoryTree">
          <template #button>
            <create-button />
          </template>
        </add-category-drawer>
      </div>
    </a-form-item>

    <a-form-item
      class="!col-span-2"
      label="Danh mục con:"
      name="sub_category_id"
      v-if="hasChildren"
    >
      <c-select
        :data="subCategoryOptions"
        v-model:value="formState.sub_category_id"
        has-search
        placeholder="Chọn danh mục con"
        @change="handleSubCategoryChange"
      />
    </a-form-item>

    <a-form-item class="!col-span-2" label="Nhà cung cấp" name="suppliers">
      <c-select-search
        :search="searchSupplierList"
        v-model:value="formState.suppliers"
        placeholder="Chọn nhà cung cấp"
        default-data="supplier"
        mode="multiple"
      />
    </a-form-item>

    <a-form-item class="!col-span-2" label="Nhãn hiệu" name="brand_id">
      <div class="flex-center gap-2">
        <c-select
          :data="brandOptions"
          :disabled="!formState.category_id || (hasChildren && !formState.sub_category_id)"
          :placeholder="brandPlaceholder"
          has-search
          v-model:value="formState.brand_id"
        />
        <add-brand-drawer @get-data="fetchCategoryTree">
          <template #button>
            <create-button />
          </template>
        </add-brand-drawer>
      </div>

    </a-form-item>

    <a-form-item class="!col-span-2" label="Các thẻ" name="tags" v-if="isEdit || true">
      <c-select
        v-model:value="formState.tags"
        placeholder="Chọn thẻ"
        :data="tagsOptionData"
        mode="tags"
      />
    </a-form-item>

    <a-form-item
      class="!col-span-2"
      label="File đính kèm:"
      name="short_description"
      v-if="!isEdit || true"
    >
      <c-image v-model="formState.images" type="multiple" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { handle_error, handle_success } from '@/utils/message'
import type { SelectConfigItem } from '@/types/index'
import type { CATEGORY_RESPONSE } from '@/types/product/category'

//COMPONENTS
import CSelect from '@/components/common/select/CSelect.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import CImage from '@/components/common/upload/CImage.vue'

//PINIA
import { useSelectDataStore } from '@/stores/select_data'
import { useCategoryStore } from '@/stores/category'
import AddCategoryDrawer from '@/views/category/AddCategoryDrawer.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'
import CSelectSearchAndPlus from '@/components/common/select/CSelectSearchAndPlus.vue'
import AddBrandDrawer from '@/views/brand/AddBrandDrawer.vue'

type FORM = {
  brand_id: number | null
  suppliers: any
  tags: string[]
  images: string[]
  category_id: number | null
  sub_category_id: number | null
}

type Props = {
  modelValue: FORM
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'updateModelValue', id: FORM): void
}>()

const selectDataStore = useSelectDataStore()
const categoryStore = useCategoryStore()

const { searchSupplierList } = selectDataStore

const formState = computed<FORM>({
  set(value: FORM) {
    emits('updateModelValue', value)
  },
  get() {
    return props.modelValue
  }
})

// icon danh mục/nhãn hiệu có 3 kiểu: string | false | string[]
const resolveIcon = (icon: any): string | undefined => {
  if (Array.isArray(icon)) return icon[0] || undefined
  return icon || undefined
}

// Cây danh mục gốc + children + brands, lấy 1 lần để cascading category -> sub-category -> brand
const categoryTree = ref<CATEGORY_RESPONSE[]>([])

const fetchCategoryTree = async () => {
  try {
    const res = await categoryStore.getCategoryList({ status: 1, 'per-page': 50 })
    categoryTree.value = res?.items || []
  } catch (error) {
    handle_error(error)
  }
}

onMounted(fetchCategoryTree)

const categoryOptions = computed<SelectConfigItem[]>(() =>
  categoryTree.value.map((category) => ({ value: category.id, label: category.name || '' }))
)

const selectedCategory = computed<CATEGORY_RESPONSE | null>(
  () => categoryTree.value.find((category) => category.id === formState.value.category_id) || null
)

const hasChildren = computed(() => (selectedCategory.value?.children?.length ?? 0) > 0)

const subCategoryOptions = computed<SelectConfigItem[]>(() =>
  (selectedCategory.value?.children ?? []).map((child) => ({
    value: child.id,
    label: child.name || ''
  }))
)

const selectedSubCategory = computed<CATEGORY_RESPONSE | null>(
  () =>
    selectedCategory.value?.children?.find(
      (child) => child.id === formState.value.sub_category_id
    ) || null
)

// Nếu danh mục có con: nhãn hiệu lấy từ danh mục con đã chọn. Không có con: lấy từ chính danh mục.
const brandSource = computed<CATEGORY_RESPONSE | null>(() =>
  hasChildren.value ? selectedSubCategory.value : selectedCategory.value
)

const brandOptions = computed<SelectConfigItem[]>(() =>
  (brandSource.value?.brands ?? []).map((brand) => ({
    value: brand.id,
    label: brand.name || '',
    image: resolveIcon((brand as any).icon)
  }))
)

const brandPlaceholder = computed(() => {
  if (!formState.value.category_id) return 'Chọn danh mục trước'
  if (hasChildren.value && !formState.value.sub_category_id) return 'Chọn danh mục con trước'
  return 'Chọn nhãn hiệu'
})

const handleCategoryChange = () => {
  formState.value.sub_category_id = null
  formState.value.brand_id = null
}

const handleSubCategoryChange = () => {
  formState.value.brand_id = null
}

const rules = computed(() => {
  return {
    category_id: [{ required: !props.isEdit, message: 'Danh mục phẩm bỏ trống!', trigger: 'blur' }],
    sub_category_id: [
      {
        validator: (_rule: any, value: number | null) =>
          hasChildren.value && !value
            ? Promise.reject('Chọn danh mục con!')
            : Promise.resolve(),
        trigger: 'change'
      }
    ]
  }
})

const open = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const tagsOptionData = ref<string[]>([])

const handleSearchTagInput = (e: string, v: any) => {
  if (e) {
    tagsOptionData.value[0] = e
  } else {
    tagsOptionData.value = []
  }
}

const validate = async () => {
  return await formRef.value?.validate()
}

const fillFormData = async () => {
  await formRef.value?.clearValidate()
}

defineExpose({ validate, fillFormData })
</script>
