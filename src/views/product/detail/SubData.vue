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
      <div></div>
      <!--      <c-select-search-and-plus :search-config="{ search: searchCategoryList, placeholder: 'Chọn danh mục', d}" />-->
      <div class="flex-center gap-2">
        <c-select-search
          :search="searchCategoryList"
          v-model:value="formState.category_id"
          placeholder="Chọn danh mục"
          default-data="category"
        />
        <add-category-drawer>
          <template #button>
            <create-button />
          </template>
        </add-category-drawer>
      </div>
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
        <c-select-search
          :search="searchBrandList"
          v-model:value="formState.brand_id"
          placeholder="Chọn nhãn hiệu"
          default-data="brand"
        />
        <add-brand-drawer>
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
import { ref, reactive, computed } from 'vue'
import { handle_error, handle_success } from '@/utils/message'

//COMPONENTS
import CSelect from '@/components/common/select/CSelect.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import CImage from '@/components/common/upload/CImage.vue'

//PINIA
import { useSelectDataStore } from '@/stores/select_data'
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

const { searchBrandList, searchCategoryList, searchSupplierList } = selectDataStore

const select_data = computed(() => selectDataStore.selectList)
const formState = computed<FORM>({
  set(value: FORM) {
    emits('updateModelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const rules = computed(() => {
  return {
    category_id: [{ required: !props.isEdit, message: 'Danh mục phẩm bỏ trống!', trigger: 'blur' }],
    brand_id: [{ required: !props.isEdit, message: 'Nhãn hiệu phẩm bỏ trống!', trigger: 'blur' }]
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
