<template>
  <div class="w-full min-h-screen flex-center bg-[#F3F5F8]">
    <div class="w-[430px] flex-center flex-col page-box-white py-10">
      <img class="w-[140px]" src="@/assets/images/hnp.png" alt="HNP" />
      <p class="uppercase py-4">phần mềm quản lý bán hàng</p>
      <a-form
        class=""
        ref="formRef"
        :model="formState"
        name="basic"
        :rules="rules"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        labelWrap
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item class="!col-span-2" :label="'Tên tài khoản'" name="email">
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item class="!col-span-2" label="Mật khẩu" name="password">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <!-- <div class="w-full flex justify-end mt-2">
          <a class="text-right" href="/recovery">Quên mật khẩu</a>
        </div> -->

        <div class="!col-span-2 flex flex-col !pt-7 w-full gap-4">
          <a-button
            class="!col-span-2 !w-full !h-[40px]"
            type="primary"
            html-type="submit"
            :loading="loading"
            >Đăng nhập</a-button
          >
        </div>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { handle_error } from '@/utils/message'

//PINIA
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const { login } = authStore
const formState = reactive({
  email: '',
  password: ''
})
const rules = {
  email: [{ required: true, message: 'Please input your user name!', trigger: 'change' }],
  password: [{ required: true, message: 'Please input your password!' }]
}

onMounted(() => {})

onUnmounted(() => {})

const loading = ref(false)

const onFinish = async () => {
  try {
    loading.value = true
    const res = await login(formState)
    router.push({ path: '/' })
  } catch (error) {
    handle_error(error, 'Login failed')
  } finally {
    loading.value = false
  }
}

const onFinishFailed = (data: any) => {
  console.log('Login failed:', data)
}
</script>
