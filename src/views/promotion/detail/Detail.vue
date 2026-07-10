<template>
  <c-breadcrumb />
  <div class="page-box-white">
    <p class="heading-1">Tạo mã giảm giá</p>
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
      <a-form-item class="" label="Tên mã" name="title">
        <a-input v-model:value="formState.title" :length="9" />
      </a-form-item>

      <a-form-item class="" label="Mã giảm giá" name="code">
        <c-random-number type="string" :length="10" v-model="formState.code" />
      </a-form-item>

    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'

// COMPONENT
import CBreadcrumb from '@/components/common/breadcrumb/CBreadcrumb.vue'
import CRandomNumber from '@/components/common/input/CRandomNumber.vue'
import CEditor from '@/components/common/editor/CEditor.vue'

// PINIA

//UTILS

const rules = {
  name: [{ required: true, message: 'Tên sản phẩm bỏ trống!', trigger: 'blur' }],
  sku: [{ required: true, message: 'Mã sku bỏ trống!', trigger: 'blur' }],
  bar_code: [{ required: true, message: 'Mã vạch bỏ trống!', trigger: 'blur' }]
}

const formState = reactive({
  apply_for_all: false,
  code: '',
  condition_type: '',
  condition_items: [],
  description: '',
  discount_value: '',
  discount_type: 0,
  status: 0,
  end_date: '',
  start_date: '',
  title: '',
  limit: 0,
  order_total_required: null
});

onMounted(() => {
})
</script>

<style lang="scss"></style>