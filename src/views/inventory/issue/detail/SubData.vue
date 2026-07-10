<template>
  <div>
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
      <a-form-item class="!col-span-2" label="Chi nhánh" name="office_id">
        <c-select-search
          v-model:value="formState.office_id"
          :extra-data="[{ value: data?.office?.id, label: data?.office?.name }]"
          placeholder="Chọn danh mục"
          default-data="office"
        />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Kho" name="inventory_id">
        <c-select-search
          v-model:value="formState.inventory_id"
          :extra-data="[{ value: data?.inventory?.id, label: data?.inventory?.name }]"
          placeholder="Chọn nhà cung cấp"
          default-data="inventory"
        />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Chi nhánh tiếp nhận" name="office_receive_id">
        <c-select-search
          v-model:value="formState.office_receive_id"
          :extra-data="[{ value: data?.office_receive?.id, label: data?.office_receive?.name }]"
          placeholder="Chọn danh mục"
          default-data="office"
        />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Kho tiếp nhận" name="inventory_receive_id">
        <c-select-search
          v-model:value="formState.inventory_receive_id"
          :extra-data="[
            { value: data?.inventory_receive?.id, label: data?.inventory_receive?.name }
          ]"
          placeholder="Chọn nhà cung cấp"
          default-data="inventory"
        />
      </a-form-item>

      <a-form-item class="!col-span-2" label="Ghi chú" name="note">
        <a-textarea v-model:value="formState.note" />
      </a-form-item>
    </a-form>
  </div>
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
import type { ISSUE_RESPONSE } from '@/types/inventory/inventory'

type FORM = {
  office_id: number | null
  inventory_id: number | null
  office_receive_id: number | null
  inventory_receive_id: number | null
  note: string
}

type Props = {
  modelValue: FORM
  data: ISSUE_RESPONSE | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'updateModelValue', id: FORM): void
}>()

const selectDataStore = useSelectDataStore()

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
    office_id: [{ required: !props.isEdit, message: 'Chưa chọn chi nhánh!', trigger: 'blur' }],
    inventory_id: [{ required: !props.isEdit, message: 'Chưa chọn kho!', trigger: 'blur' }],
    office_receive_id: [
      { required: !props.isEdit, message: 'Chưa chọn chi nhánh tiếp nhận!', trigger: 'blur' }
    ]
    // inventory_receive_id: [
    //   { required: !props.isEdit, message: 'Chưa chọn kho tiếp nhận!', trigger: 'blur' }
    // ]
  }
})

const formRef = ref<any>(null)
const tagsOptionData = ref<string[]>([])

const validate = async () => {
  return await formRef.value?.validate()
}

const fillFormData = async () => {
  await formRef.value?.clearValidate()
}

defineExpose({ validate, fillFormData, formState })
</script>
