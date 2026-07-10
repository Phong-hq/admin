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

//COMPONENTS
import CCheckboxNumber from '@/components/common/checkbox/CCheckboxNumber.vue'
import CImage from '@/components/common/upload/CImage.vue'

//PINIA
import { useCategoryStore } from '@/stores/category'
import { useSelectDataStore } from '@/stores/select_data'
import { useRootStore } from '@/stores/root'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { clone } from '@/utils/clone'

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

const formState = reactive({
  id: null as null | number,
  name: '',
  code: '',
  description: '',
  status: 0,
  icon: [] as string[]
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

    if (isEdit.value) {
      await updateCategory(data?.id, data)
    } else await createCategory(data)
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
  formState.icon = clone(data?.icon || [])
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
