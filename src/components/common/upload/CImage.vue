<template>
  <a-upload
    class="update-input-custom"
    :class="{ small: size == 'small' }"
    :loading="loading"
    :disabled="loading"
    :fileList="fileListRender"
    accept="image/png, image/jpeg, image/webp"
    :placeholder="placeholder"
    :action="handleUpload"
    @remove="handleRemove"
    :list-type="listType"
    :showUploadList="true"
    :multiple="type == 'multiple'"
  >
    <div v-if="!(type == 'default' && fileListRender && fileListRender?.length >= 1)">
      <div class="" v-if="listType == 'picture-card'">
        <div class="relative flex-center flex-col">
          <plus-outlined class="text-black" v-if="!loading" />
          <a-spin class="mr-4" :indicator="indicator" v-else />
          <div style="margin-top: 8px; margin-left: 4px">Thêm hình</div>
        </div>
      </div>
      <a-button v-else>
        <upload-outlined class="text-black" v-if="!loading" />
        <a-spin class="!mr-2" size="small" :indicator="indicator" v-else />
        thêm hình
      </a-button>
    </div>
  </a-upload>
</template>

<script lang="ts" setup>
import { ref, computed, h, onMounted } from 'vue'
import { uploadFile, removeFile } from '@/utils/file-helper'
import type { UploadProps, UploadFile } from 'ant-design-vue'
// import UploadComponent from './Index.vue'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { handle_error } from '@/utils/message'

interface Props {
  modelValue: string | string[] | null
  type?: 'default' | 'multiple'
  listType?: 'picture' | 'picture-card'
  isCreate?: boolean
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  isCreate: false,
  type: 'default',
  size: 'medium',
  listType: 'picture-card'
})

const emits = defineEmits<{
  (e: 'update:modelValue', id: string | string[] | null): void
  (e: 'change'): void
}>()

const result = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})
const image = computed(() => (typeof result.value == 'string' ? result.value : ''))
const fileListRender = computed<UploadProps['fileList']>(() => {
  if (typeof result.value == 'string') {
    const hasFile = fileList.value?.find((file) => file.thumbUrl === result.value)
    if (!result.value) {
      return []
    } else if (hasFile) {
      return [hasFile]
    } else {
      return [
        {
          uid: result.value,
          name: '',
          thumbUrl: result.value,
          status: 'done',
          preview: result.value
        } as UploadFile
      ]
    }
  } else {
    return result.value?.map((e) => {
      const file = fileList.value?.find((file) => file.thumbUrl == e)
      if (file) return file
      else {
        const link  = e.toString().replace("https://", "https:")
        return {
          uid: e,
          name: '',
          thumbUrl: link,
          status: 'done',
          preview: link
        } as UploadFile
      }
    })
  }
})

onMounted(() => {
  // console.log(fileListRender.value)
})

const fileList = ref<UploadProps['fileList']>([])
const loading = ref(false)

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '24px'
  },
  spin: true
})

const handleUpload = async (e: any) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      loading.value = true
      if (fileListRender.value && fileListRender.value[0] && props.type == 'default') {
        handleRemove(fileListRender.value[0])
      }
      const res = await uploadFile(e)
      if (res && res?.url) {
        const file = {
          uid: res?.delete_url,
          name: res?.name,
          thumbUrl: res?.url,
          status: 'done',
          preview: res?.url
        } as UploadFile
        fileList.value?.push(file)
        if (props.type == 'multiple' && typeof result.value != 'string' && result.value != null) {
          result.value.push(file.thumbUrl || '')
        } else {
          result.value = file.thumbUrl ?? ''
        }
        resolve
      }
      reject
    } catch (error) {
      reject(error)
    } finally {
      loading.value = false
    }
  })
}

const handleRemove = async (file: UploadFile) => {
  const fileIndex = fileList.value?.findIndex((e) => e.uid == file.uid) ?? -1
  if (fileIndex > -1) fileList.value?.splice(fileIndex, 1)
  if (props.type == 'multiple' && result.value?.length && typeof result.value != 'string') {
    const resultIndex =
      result.value?.findIndex((e) => {
        if (fileIndex > -1) {
          return e == file.uid
        } else {
          return e == file.uid
        }
      }) ?? -1
    if (resultIndex > -1) result.value?.splice(resultIndex, 1)
  } else {
    result.value = ''
  }

  if (file.uid && fileIndex != undefined && fileIndex > -1) {
    try {
      await removeFile(file.uid)
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="scss">
.ant-upload {
  &.ant-upload-select {
    width: 100%;
  }
}
</style>
