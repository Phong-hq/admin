<template>
  <a-drawer
    class="h-[70vh]"
    v-model:open="open"
    :title="isEdit ? 'Cập nhật' : 'Tạo mới CMS'"
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
        @finishFailed="onFinishFailed"
        @keyEnter="onFinish"
      >
        <a-form-item class="!col-span-2" label="Tên" name="name">
          <a-input
            v-model:value="formState.name"
            placeholder="VD:pages_section"
            @input="handleInputName"
          />
        </a-form-item>

        <a-form-item class="!col-span-2 flex-center !pt-7 !hidden">
          <a-button class="" type="primary" html-type="submit" :loading="loading">Submit</a-button>
        </a-form-item>
        <a-divider class="!mt-0"></a-divider>
        <p class="font-semibold mb-4">Cấu hình</p>
        <div class="flex-col gap-4">
          <transition-group class="flex-col gap-4" name="list" tag="div">
            <collection-setting-field-item
              ref="collectionInputFieldRef"
              :type="item.type"
              v-model:data="item.options"
              v-model="item.name"
              v-for="item in formState.schemas"
              :key="item.id"
              @remove-field="handleRemoveField(item.id)"
            >
            </collection-setting-field-item>
          </transition-group>
          <a-dropdown :trigger="['click']" v-model:open="handleAddFieldDropdownOpen">
            <a-button
              class="z-[10]"
              type="primary"
              @click="handleAddFieldDropdownOpen = !handleAddFieldDropdownOpen"
              >Thêm một trường mới
            </a-button>
            <template #overlay>
              <div class="grid grid-cols-3 gap-4 page-box-white">
                <div
                  class="hover:bg-item_hover p-2 rounded-md cursor-pointer"
                  v-for="item in SCHEMAS_TYPE_DATA"
                  @click="handleAddMoreField(item.type)"
                  :key="item.type"
                >
                  {{ item.label }}
                </div>
              </div>
            </template>
          </a-dropdown>
        </div>
        <a-form-item class="!col-span-2 translate-y-[-20px]" label="" name="schemas">
          <div></div>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { type SCHEMAS_TYPE, SCHEMAS } from '@/constant/cms'
import { DeleteOutlined } from '@ant-design/icons-vue'

//UTILS
import { handle_error, handle_success } from '@/utils/message'

//COMPONENTS
import CollectionSettingFieldItem from './collection/CollectionSettingFieldItem.vue'

//PINIA
import { useCmsStore } from '@/stores/cms'
import { useRootStore } from '@/stores/root'

const emits = defineEmits<{
  (e: 'getData'): void
}>()
type SCHEMAS_REQUEST = {
  name: string
  type: SCHEMAS
  validator: any
  options: any
  id: number
}

const cmsStore = useCmsStore()
const rootStore = useRootStore()

const { createCmsCollection, getCmsCollection, updateCmsCollection } = cmsStore

const isMobileComputed = computed(() => rootStore.isMobile)
const SCHEMAS_TYPE_DATA = [
  { label: 'Text', type: SCHEMAS.TEXT },
  { label: 'Email', type: SCHEMAS.EMAIL },
  { label: 'File', type: SCHEMAS.FILE },
  { label: 'Select', type: SCHEMAS.SELECT },
  { label: 'Relation', type: SCHEMAS.RELATION },
  { label: 'Boolean', type: SCHEMAS.BOOLEAN },
  { label: 'Date time', type: SCHEMAS.DATE_TIME },
  { label: 'Editor', type: SCHEMAS.EDITOR },
  { label: 'Json', type: SCHEMAS.JSON },
  { label: 'Number', type: SCHEMAS.NUMBER },
  { label: 'Url', type: SCHEMAS.URL }
]

const rules = computed(() => {
  return {
    name: [{ required: true, message: 'Tên CMS bỏ trống!', trigger: 'blur' }],
    schemas: [{ required: true, message: 'cấu hình chưa hợp lệ!', trigger: 'blur' }]
  }
})
const maxId = computed(() =>
  formState.schemas.reduce((result, item) => (result = result > item.id ? result : item.id), 0)
)

const formState = reactive({
  id: null as any,
  type: 1,
  name: '',
  schemas: [] as SCHEMAS_REQUEST[]
})

const open = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)
const collectionInputFieldRef = ref<InstanceType<typeof CollectionSettingFieldItem>[] | null>(null)
const handleAddFieldDropdownOpen = ref(false)

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
    if (collectionInputFieldRef.value?.length) {
      for (let i = 0; i < collectionInputFieldRef.value?.length; i++) {
        await collectionInputFieldRef.value[i]?.validate()
      }
    }
    loading.value = true

    let data: any = { ...formState }
    if (isEdit.value) {
      await updateCmsCollection(data)
    } else {
      await createCmsCollection(data)
    }
    await getCmsCollection()
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
  isEdit.value = false
  if (data) isEdit.value = true
  formState.id = data?.id || null
  formState.name = data?.name || ''
  formState.schemas = data?.schemas || []
}

const handleChange = (e: any) => {
  console.log(e)
}

const handleAddMoreField = (type: SCHEMAS) => {
  formState.schemas.push(getNewDefaultField(type))
  handleAddFieldDropdownOpen.value = false
}

const getNewDefaultField = (type: SCHEMAS): SCHEMAS_REQUEST => {
  let options = {} as any
  if (type == SCHEMAS.SELECT) options = { value: [], type: null }
  else if (type == SCHEMAS.RELATION) options = { ref_table: null, type: null, is_cms: null }
  return {
    name: type + (maxId.value + 1),
    type,
    validator: [],
    options,
    id: maxId.value + 1
  }
}

const handleRemoveField = (id: any) => {
  const index = formState.schemas.findIndex((schema) => schema.id == id)
  if (index > -1) formState.schemas.splice(index, 1)
}

const handleInputName = () => {
  formState.name = formState.name.replace(' ', '_')
}

defineExpose({ show })
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease !important;
}

.list-enter-from,
.list-leave-to {
  opacity: 0 !important;
}

.list-enter-from {
  height: 0 !important;
  transform: translateY(-20px) !important;
}
</style>
