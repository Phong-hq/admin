<template>
  <div @click="quickCreate()">
    <slot name="button"></slot>
  </div>
  <a-drawer
    class="h-[70vh] drawer-menu-mobile"
    v-model:open="open"
    :title="isEdit ? 'Cập nhật' : 'Thêm nhãn hiệu'"
    placement="right"
    :width="isMobileComputed ? 350 : 500"
  >
    <template #footer>
      <div class="flex justify-end gap-4">
        <a-button @click="hide">Hủy</a-button>
        <a-button type="primary" @click="onFinish" :loading="loading"
          >{{ isEdit ? 'Cập nhật' : 'Tạo' }}
        </a-button>
      </div>
    </template>
    <div class="sc-full flex flex-col">
      <!-- <div class="shrink-0 py-4">
        <a-steps :current="current" :items="steps"></a-steps>
      </div> -->
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
        <a-form-item class="!col-span-2" label="Tên nhãn hiệu" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item class="!col-span-2" label="Mã nhãn hiệu" name="code">
          <a-input v-model:value="formState.code" />
        </a-form-item>

        <a-form-item class="!col-span-2" label="Mô tả" name="description">
          <a-textarea class="!min-h-[100px]" v-model:value="formState.description" auto-size />
        </a-form-item>

        <a-form-item class="!col-span-2" label="Chọn danh mục" name="categories">
          <div class="flex-center gap-2">
            <c-select-search
              v-model:value="formState.categories"
              placeholder="Vd: điện thoại, phụ kiện, ..."
              :search="selectDataStore.searchCategoryList"
              mode="multiple"
              default-data="category"
            />
            <add-category-drawer>
              <template #button>
                <create-button />
              </template>
            </add-category-drawer>
          </div>
        </a-form-item>

        <a-form-item class="!col-span-2" label="Icon" name="icon">
          <c-image v-model="formState.icon" type="multiple" />
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
import { handle_error, handle_success } from '@/utils/message'

//COMPONENTS
import CCheckboxNumber from '@/components/common/checkbox/CCheckboxNumber.vue'
import CImage from '@/components/common/upload/CImage.vue'
import CSelect from '@/components/common/select/CSelect.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import AddCategoryDrawer from '@/views/category/AddCategoryDrawer.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

//PINIA
import { useBrandStore } from '@/stores/brand'
import { useSelectDataStore } from '@/stores/select_data'
import { useRootStore } from '@/stores/root'

const emits = defineEmits<{
  (e: 'getData'): void
}>()

const brandStore = useBrandStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()

const { createBrand, updateBrand } = brandStore
const isMobileComputed = computed(() => rootStore.isMobile)

const selectList = computed(() => selectDataStore.selectList)

const rules = computed(() => {
  return {
    name: [{ required: !isEdit.value, message: 'Tên nhãn hiệu bỏ trống!', trigger: 'blur' }]
  }
})
const isEdit = computed(() => formState.id != null)

const formState = reactive({
  id: null as null | number,
  name: '',
  code: '',
  description: '',
  status: 0,
  icon: [] as string[],
  categories: []
})

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

const onFinish = async (values: any) => {
  try {
    await formRef.value?.validate()
    loading.value = true

    let data: any = { ...formState }
    console.log(data)

    if (isEdit.value) {
      await updateBrand(data?.id, data)
    } else await createBrand(data)
    if(isQuickCreate.value) await selectDataStore.getBrandList(true)
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
  formState.icon = data?.icon || []
  formState.categories = data?.categories?.map((category: any) => category?.id) || []
  formState.status = data?.status || 0
}

const handleChange = (e: any) => {
  console.log(e)
}

const quickCreate = () => {
  show()
  isQuickCreate.value = true
  formState.status = 1
}
defineExpose({ show })
</script>
