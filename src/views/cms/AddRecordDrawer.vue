<template>
  <a-drawer
    class="h-[70vh]"
    v-model:open="open"
    :title="isEdit ? 'Thông tin record' : 'Tạo record'"
    placement="right"
    :width="500"
  >
    <template #footer>
      <div class="flex justify-end gap-4">
        <a-button @click="hide">Hủy</a-button>
        <a-button type="primary" @click="onFinish" :loading="loading"
          >{{ isEdit ? 'Cập nhập' : 'Tạo' }}
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
        <template v-for="(item, i) in collection?.schemas" :key="i">
          <template v-if="!item.name"></template>
          <a-form-item
            class="!col-span-2"
            :label="item.name"
            :name="item.name"
            v-else-if="item.type == SCHEMAS.NUMBER"
          >
            <a-input-number class="!w-[200px]" v-model:value="formState[item.name]" />
          </a-form-item>

          <a-form-item
            class="!col-span-2"
            label=""
            :name="item.name"
            v-else-if="item.type == SCHEMAS.BOOLEAN"
          >
            <a-checkbox v-model:checked="formState[item.name]">{{ item.name }}</a-checkbox>
          </a-form-item>

          <a-form-item
            class="!col-span-2"
            :label="item.name"
            :name="item.name"
            v-else-if="item.type == SCHEMAS.DATE_TIME"
          >
            <a-date-picker class="" v-model:value="formState[item.name]" placeholder="Chọn ngày" />
          </a-form-item>

          <a-form-item
            class="!col-span-2"
            :label="item.name"
            :name="item.name"
            v-else-if="item.type == SCHEMAS.FILE"
          >
            <c-image
              class=""
              v-model="formState[item.name]"
              :type="item.options?.type == 'multiple' ? 'multiple' : undefined"
            />
          </a-form-item>

          <a-form-item
            class="!col-span-2"
            :label="item.name"
            :name="item.name"
            v-else-if="item.type == SCHEMAS.SELECT"
          >
            <c-select
              class=""
              v-model:value="formState[item.name]"
              :data="item.options?.value"
              :mode="item.options?.type == 'multiple' ? 'multiple' : undefined"
            />
          </a-form-item>

          <a-form-item
            class="!col-span-2"
            :label="item.name"
            :name="item.name"
            v-else-if="item.type == SCHEMAS.EDITOR"
          >
            <c-editor v-model="formState[item.name]" />
          </a-form-item>
          <template v-else-if="item.type == SCHEMAS.RELATION">
            <p class="font-semibold">{{ item.name }}</p>
            <relation-input
              v-if="open"
              v-model="formState[item.name]"
              :options="item.options"
              :collection="collection"
            />
            <a-form-item class="!col-span-2" :label="''" :name="item.name"></a-form-item>
          </template>

          <a-form-item
            class="!col-span-2"
            :label="item.name"
            :name="item.name"
            v-else-if="item.type == SCHEMAS.JSON"
          >
            <!--            <json-editor-vue v-model="formState[item.name]" />-->
            <c-json-editor v-model="formState[item.name]" />
          </a-form-item>

          <a-form-item class="!col-span-2" :label="item.name" :name="item.name" v-else>
            <a-input v-model:value="formState[item.name]">item.name</a-input>
          </a-form-item>
        </template>

        <a-form-item class="!col-span-2 flex-center !pt-7 !hidden">
          <a-button class="" type="primary" html-type="submit" :loading="loading">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { type SCHEMAS_TYPE, SCHEMAS } from '@/constant/cms'
import type { COLLECTION_RESPONSE } from '@/types/cms/collection'
import dayjs from 'dayjs'
import JsonEditorVue from 'json-editor-vue'
//UTILS
import { handle_error, handle_success } from '@/utils/message'
import { isValidEmail, isValidURL, isValidJson } from '@/utils/form-rule-helper'
import { DATE_REQUEST_FORMAT } from '@/utils/dayjs-helper'

//COMPONENTS
import CImage from '@/components/common/upload/CImage.vue'
import CSelect from '@/components/common/select/CSelect.vue'
import CEditor from '@/components/common/editor/CEditor.vue'
import RelationInput from './record/RelationInput.vue'
import CJsonEditor from '@/components/common/input/CJsonEditor.vue'
//PINIA
import { useCmsStore } from '@/stores/cms'

type Props = {
  collection: COLLECTION_RESPONSE | null
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'getData'): void
}>()

const cmsStore = useCmsStore()

const { createCmsRecord, updateCmsRecord } = cmsStore

const rules = computed(() => {
  const emailValidate = { validator: isValidEmail, trigger: 'blur', message: 'Email không hợp lệ!' }
  const urlValidate = { validator: isValidURL, trigger: 'blur', message: 'Url không hợp lệ!' }
  const jsonValidate = { validator: isValidJson, trigger: 'blur', message: 'Json không hợp lệ!' }
  let result = {} as any
  if (props.collection?.schemas?.length) {
    props.collection?.schemas.forEach((schema) => {
      if (schema.name) {
        if (schema.type == SCHEMAS.EMAIL) {
          result[schema.name] = [emailValidate]
        } else if (schema.type == SCHEMAS.URL) {
          result[schema.name] = [urlValidate]
        } else if (schema.type == SCHEMAS.JSON) {
          result[schema.name] = [jsonValidate]
        } else {
          result[schema.name] = []
        }
      }
    })
  }
  return result
})

const formState = ref<any>({})

const open = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const loading = ref<boolean>(false)
const formRef = ref<any>(null)

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

    let data: any = { ...formState.value }
    const keyArr = Object.keys(data)

    keyArr.forEach((key) => {
      const type = props.collection?.schemas?.find((schema) => schema.name == key)?.type
      const options = props.collection?.schemas?.find((schema) => schema.name == key)?.options
      if (type == SCHEMAS.DATE_TIME) data[key] = dayjs(data[key]).format(DATE_REQUEST_FORMAT)
      else if (type == SCHEMAS.SELECT && options?.type == 'multiple') {
        data[key] = JSON.stringify(data[key])
      }
    })
    if (isEdit.value) {
      await updateCmsRecord(props.collection?.name || '', formState.value?.id, data)
    } else {
      await createCmsRecord(props.collection?.name || '', data)
    }
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
  formState.value = {}
  isEdit.value = false
  if (data) {
    isEdit.value = true

    formState.value = { ...data }
    if (props.collection?.schemas?.length) {
      props.collection?.schemas.forEach((schema) => {
        if (schema.name) {
          if (schema.type == SCHEMAS.SELECT && schema.options?.type == 'multiple') {
            formState.value[schema.name] = JSON.parse(data[schema.name])
          }
        }
      })
    }
  } else if (props.collection?.schemas?.length) {
    props.collection?.schemas.forEach((schema) => {
      let value = null
      if (
        schema.type == SCHEMAS.EDITOR ||
        schema.type == SCHEMAS.RELATION ||
        schema.type == SCHEMAS.JSON
      )
        value = ''
      else if (schema.type == SCHEMAS.BOOLEAN) value = false
      else if (schema.type == SCHEMAS.NUMBER) value = 0
      else if (schema.type == SCHEMAS.SELECT && schema.options?.type == 'multiple') value = []
      else if (schema.type == SCHEMAS.FILE && schema.options?.type == 'multiple') value = []
      formState.value[schema.name || ''] = value
    })
  }
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
