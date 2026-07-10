<template>
  <c-breadcrumb />
  <div class="page-box-white">
    <p class="heading-1">{{ isEdit ? 'Cập nhập tài khoản' : 'Tạo mới tài khoản' }}</p>
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
      @keyEnter="onFinish"
    >
      <a-form-item class="" label="Tên đăng nhập" name="username">
        <a-input class="!w-full" v-model:value="formState.username" />
      </a-form-item>

      <a-form-item class="" label="Email" name="email">
        <a-input class="!w-full" v-model:value="formState.email" />
      </a-form-item>

      <a-form-item class="" label="Mật khẩu" name="password">
        <a-input-password class="!w-full" v-model:value="formState.password" />
      </a-form-item>

      <a-form-item class="" label="Nhập lại mật khẩu" name="confirm_password">
        <a-input-password class="!w-full" v-model:value="formState.confirm_password" />
      </a-form-item>

      <a-form-item class="" label="Vai trò" name="role">
        <c-select class="!w-full" :data="USER_ROLE_DATA" v-model:value="formState.role" />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Trạng thái" name="status">
        <c-checkbox-number v-model="formState.status">Kích hoạt</c-checkbox-number>
      </a-form-item>

      <a-form-item
        class=""
        label="Chọn chi nhánh"
        name="offices"
        v-if="formState.role != USER_ROLE.ADMIM"
      >
        <div class="flex-center gap-2">
          <c-select-search
            class="!w-full"
            mode="multiple"
            :default-data="'office'"
            v-model:value="formState.offices"
            :extra-data="formState.offices_data"
          />
          <create-office-modal>
            <create-button></create-button>
          </create-office-modal>
        </div>
      </a-form-item>

      <a-form-item
        class=""
        label="Chọn nhà cung cấp"
        name="suppliers"
        v-if="formState.role != USER_ROLE.ADMIM"
      >
        <div class="flex-center gap-2">
          <c-select-search
            class="!w-full"
            mode="multiple"
            :default-data="'supplier'"
            v-model:value="formState.suppliers"
            :extra-data="formState.suppliers_data"
          />
        </div>
      </a-form-item>
    </a-form>
  </div>
  <div class="sticky bottom-0 w-full flex-center gap-4 z-[2] mt-7">
    <a-button class="w-[150px]" type="primary" @click="onFinish" :loading="loading">Lưu</a-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { USER_ROLE, USER_ROLE_DATA } from '@/constant/setting/user'
import type { USER_RESPONSE } from '@/types/setting/user'
import type { SelectConfigItem } from '@/types'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CSelect from '@/components/common/select/CSelect.vue'
import CCheckboxNumber from '@/components/common/checkbox/CCheckboxNumber.vue'
import CSelectSearch from '@/components/common/select/CSelectSearch.vue'
import CreateOfficeModal from '@/views/setting/office/CreateOfficeModal.vue'
import CreateButton from '@/components/common/button/CreateButton.vue'

// PINIA
import { useUserStore } from '@/stores/setting/user'
import { useRootStore } from '@/stores/root'
import { useSelectDataStore } from '@/stores/select_data'

//UTILS
import { isValidEmail } from '@/utils/form-rule-helper'
import { handle_error, handle_success } from '@/utils/message'

const route = useRoute()
const userStore = useUserStore()
const selectDataStore = useSelectDataStore()
const rootStore = useRootStore()

const { createUser, getUserDetail, updateUser } = userStore
const { showLoading, hideLoading } = rootStore

const checkConfirmPassword = (rule: string, value: string, call: any) => {
  if (formState.password && formState.password != value) {
    return Promise.reject()
  }
  Promise.resolve()
}

const rules = computed(() => {
  return {
    email: [
      { validator: isValidEmail, trigger: 'blur', message: 'Email không hợp lệ!' },
      {
        required: true,
        trigger: 'blur',
        message: 'Email để trống!'
      }
    ],
    username: [{ required: true, trigger: 'blur', message: 'Tên tài khoản để trống!' }],
    password: [{ required: !isEdit.value, trigger: 'blur', message: 'Mật khẩu để trống!' }],
    confirm_password: [
      { validator: checkConfirmPassword, trigger: 'blur', message: 'Mật khẩu không trùng khớp!' }
    ],
    role: [{ required: true, trigger: 'blur', message: 'Vai trò để trống!' }]
  }
})
const isEdit = computed(() => route?.name == 'setting-user-detail')
const user_id = computed(() => String(route?.params?.id))

onMounted(() => {
  selectDataStore.getInventoryList()
  selectDataStore.getSupplierList()
  if (isEdit.value) {
    initData()
  }
})
const loading = ref(false)
const formState = reactive({
  id: null as number | null,
  email: '',
  offices: [] as any,
  password: '',
  role: '',
  confirm_password: '',
  status: 0,
  suppliers: [] as any,
  username: '',
  suppliers_data: [] as SelectConfigItem[],
  offices_data: [] as SelectConfigItem[]
})

const initData = async () => {
  try {
    showLoading()
    const res = await getUserDetail(user_id.value)
    fillFormData(res)
  } catch (error) {
    handle_error(error, 'Lấy thông tin thất bại!')
  }
  hideLoading()
}

const fillFormData = (data: USER_RESPONSE) => {
  formState.id = data?.id ?? null
  formState.status = data?.status ?? 0
  formState.username = data?.username ?? ''
  formState.offices = data?.offices?.map((e) => e.id) ?? []
  formState.suppliers = data?.suppliers?.map((e) => e.id) ?? []
  formState.role = data?.role ?? ''
  formState.email = data?.email ?? ''
  formState.suppliers_data =
    data?.suppliers?.map((e) => {
      return {
        value: e.id,
        label: e.name
      }
    }) ?? []
  formState.offices_data =
    data?.offices?.map((e) => {
      return {
        value: e.id,
        label: e.name
      }
    }) ?? []
}

const onFinish = async () => {
  try {
    loading.value = true
    if (isEdit.value) {
      await updateUser(formState)
      handle_success('Cập nhập tài khoản thành công!')
    } else {
      await createUser(formState)
      handle_success('Tạo tài khoản thành công!')
    }
  } catch (e) {
    handle_error(e, isEdit.value ? 'Cập nhập tài khoản thất bại!' : 'Tạo tài khoản thất bại!')
  }
  loading.value = false
}
</script>

<style lang="scss"></style>
