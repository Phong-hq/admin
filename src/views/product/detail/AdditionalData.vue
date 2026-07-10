<template>
  <div>
    <a-divider class="!my-0"></a-divider>
    <div class="" v-for="(item, i) in result" :key="i" @click="showAdditionalItemModal(item.name)">
      <div
        class="grid grid-cols-[80px_auto_20px] hover:bg-item_hover cursor-pointer gap-7 px-4 py-4"
      >
        <div class="flex items-center">
          <p>{{ item.name }}</p>
        </div>
        <div
          class="w-full max-h-[200px] overflow-auto"
          v-html="item.value"
          v-if="typeof item.value == 'string'"
        ></div>
        <a-dropdown>
          <div class="flex-center sc-full cursor-pointer">
            <small-dash-outlined class="text-lg" />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item class="h-10">
                <a-space>
                  <edit-outlined />
                  <p @click="showAdditionalItemModal(item.name)">Chỉnh sửa</p>
                </a-space>
              </a-menu-item>

              <a-menu-item class="h-10">
                <a-space>
                  <delete-outlined />
                  <p @click="handleRemoveAdditionalItem(item.name)">Xóa</p>
                </a-space>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <a-divider class="!my-0"></a-divider>
    </div>
    <p class="text-blue cursor-pointer mt-4" @click="showAdditionalItemModal()">+ Thêm thông tin</p>
    <a-modal
      v-model:open="infoModal"
      :title="activeKey != null ? 'Chỉnh sửa thông tin' : 'Thêm thông tin'"
      :width="900"
      :bodyStyle="{ padding: '16px' }"
      @ok="handleModalConfirm"
      :after-close="handleAdditionalModalClose"
    >
      <a-form
        :model="additionalState"
        class=""
        ref="additionalFormRef"
        name="basic"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :rules="rules"
        labelWrap
        autocomplete="off"
        @finish="handleModalConfirm"
      >
        <a-form-item class="" label="Tiêu đề:" name="name">
          <a-input class="!w-full" v-model:value="additionalState.name" />
        </a-form-item>
        <a-form-item class="" label="Nội dung:" name="bale">
          <c-editor v-model="additionalState.value" />
        </a-form-item>
        <a-button class="opacity-[0]" type="primary" html-type="submit"></a-button>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { EditOutlined, DeleteOutlined, SmallDashOutlined } from '@ant-design/icons-vue'

//COMPONENTS
import CEditor from '@/components/common/editor/CEditor.vue'

//PINIA
import { useSelectDataStore } from '@/stores/select_data'

type Props = {
  modelValue: { name: string; value: string }[]
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'updateModelValue', id: { name: string; value: string }[]): void
}>()

const result = computed<{ name: string; value: string }[]>({
  set(value: { name: string; value: string }[]) {
    emits('updateModelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const checkDuplicateKey = (rule: string, value: string, call: any) => {
  if (
    result.value.length &&
    result.value.some((e: any) => e.name == value && activeKey.value != value)
  ) {
    return Promise.reject('Tiều đề bị trùng!!')
  }
  return Promise.resolve()
}

const rules = {
  name: [
    { required: true, message: 'key bỏ trống!', trigger: 'blur' },
    { validator: checkDuplicateKey, trigger: 'blur', message: 'Tiều đề bị trùng!!' }
  ]
}

const additionalState = reactive({
  name: '',
  value: ''
})

const infoModal = ref<any>(false)
const activeKey = ref<string | null>(null)
const additionalFormRef = ref<any>(null)

const showAdditionalItemModal = async (key?: string) => {
  activeKey.value = key || null
  additionalState.value = ''
  additionalState.name = ''
  if (key) {
    const item = result.value.find((e) => e.name === key)
    additionalState.name = item?.name || ''
    additionalState.value = item?.value || ''
  }
  infoModal.value = true
}

const handleRemoveAdditionalItem = (key: string) => {
  const index = result.value.findIndex((e: any) => e.name === key)
  if (index > -1) {
    result.value = result.value.splice(index, 1)
  }
}

const handleModalConfirm = async () => {
  await additionalFormRef.value?.validate()

  if (activeKey.value != null) {
    const index = result.value.findIndex((e: any) => e.name === activeKey.value)
    if (index > -1) {
      result.value[index] = { ...additionalState }
    }
  } else {
    result.value.push({ ...additionalState })
  }
  infoModal.value = false
}

const handleAdditionalModalClose = () => {
  activeKey.value = null
  additionalFormRef.value?.clearValidate()
}
</script>
