<template>
  <div @click="quickCreate()">
    <slot></slot>
  </div>
  <a-modal
    v-model:open="open"
    :title="(isEdit ? 'Cập nhập' : 'Tạo') + ' bộ phận'"
    @ok="onFinish"
    :width="600"
    :after-close="handleAfterClose"
  >
    <template #footer>
      <div class="flex justify-end gap-2">
        <a-button @click="open = false">Hủy</a-button>
        <a-button type="primary" @click="onFinish" :loading="loading">Tạo</a-button>
      </div>
    </template>
    <a-form
      :model="formState"
      class=""
      ref="formRef"
      name="basic"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
      :rules="rules"
      labelWrap
      autocomplete="off"
      @finish="onFinish"
      @keyEnter="onFinish"
    >
      <a-form-item class="" label="Tên" name="name">
        <a-input class="!w-full" v-model:value="formState.name" />
      </a-form-item>

      <a-form-item class="" label="Chi nhánh" name="office_id">
        <div class="flex-center gap-4">
          <c-select-search default-data="office" v-model:value="formState.office_id" />
          <create-office-modal>
            <create-button></create-button>
          </create-office-modal>
        </div>
      </a-form-item>

      <a-form-item class="" label="Người dùng" name="user_id">
        <c-select-search default-data="user" v-model:value="formState.user_id" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { SelectConfigItem } from '@/types'
import type { DEPARTMENT_RESPONSE } from '@/types/setting/department'

// COMPONENT
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

// PINIA
import { useDepartmentStore } from '@/stores/setting/department'
import { useRootStore } from '@/stores/root'
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { handle_error, handle_success } from '@/utils/message'
import CreateOfficeModal from '@/views/setting/office/CreateOfficeModal.vue'

const route = useRoute()
const departmentStore = useDepartmentStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()

const { createDepartment, updateDepartment } = departmentStore
const { showLoading, hideLoading } = rootStore

const emits = defineEmits<{
  (e: 'getData'): void
}>()

const rules = computed(() => {
  return {
    name: [{ required: true, trigger: 'blur', message: 'Tên bộ phận để trống!' }],
    office_id: [{ required: true, trigger: 'blur', message: 'Chi nhánh để trống!' }],
    user_id: [{ required: true, trigger: 'blur', message: 'Người dùng để trống!' }],
  }
})
const user_id = computed(() => String(route?.params?.id))

onMounted(() => {
  selectDataStore.getOfficeList()
  selectDataStore.getUserList()
})

const open = ref<boolean>(false)
const isQuickCreate = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const formState = reactive({
  id: null as number | null,
  office_id: null as number | null,
  user_id: null as number | null,
  office: [] as SelectConfigItem[],
  user: [] as SelectConfigItem[],
  name: ''
})

const fillFormData = (data?: DEPARTMENT_RESPONSE) => {
  formState.id = data?.id ?? null
  formState.office = data?.office
    ? [
        {
          label: data?.office?.name,
          value: data?.office?.id
        }
      ]
    : []
  formState.user = data?.user
    ? [
        {
          label: data?.user?.username,
          value: data?.user?.id
        }
      ]
    : []
  formState.name = data?.name ?? ''
  formState.user_id = data?.user?.id ?? null
  formState.office_id = data?.office?.id ?? null
}

const onFinish = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    if (isEdit.value) {
      await updateDepartment(formState)
      handle_success('Cập nhập bộ phận thành công!')
    } else {
      await createDepartment(formState)
      handle_success('Tạo bộ phận thành công!')
    }
    // if (isQuickCreate.value) await selectDataStore.getDepartmentList(true)
    emits('getData')
    open.value = false
  } catch (e) {
    handle_error(e, isEdit.value ? 'Cập nhập bộ phận thất bại!' : 'Tạo bộ phận thất bại!')
  }
  loading.value = false
}

const showModal = (department?: DEPARTMENT_RESPONSE) => {
  if (department) {
    isEdit.value = true
  }
  fillFormData(department)
  open.value = true
}

const handleAfterClose = () => {
  formRef.value?.clearValidate()
  isEdit.value = false
  isQuickCreate.value = false
}

const quickCreate = () => {
  showModal()
  isQuickCreate.value = true
}

defineExpose({ showModal })
</script>

<style lang="scss"></style>
