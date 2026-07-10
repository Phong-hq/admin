<template>
  <a-collapse class="cms-input-field" :activeKey="activeKey" accordion>
    <a-collapse-panel class="cms-input-field-item" key="1" forceRender>
      <template #header>
        <a-input v-model:value="result"></a-input>
      </template>
      <template #extra>
        <div class="w-10 flex-center cursor-pointer" @click="handleClick">
          <setting-outlined />
        </div>
      </template>

      <!-- SELECT -->

      <a-form
        :model="dataResult"
        class="!flex !items-center !gap-4"
        ref="selectForm"
        :rules="SELECT_RULES"
        autocomplete="off"
        v-if="type == SCHEMAS.SELECT"
      >
        <a-form-item class="grow" name="value">
          <c-select
            class="w-full"
            v-model:value="dataResult.value"
            placeholder="Thêm lựa chọn"
            :data="[]"
            mode="tags"
          ></c-select>
        </a-form-item>
        <a-form-item class="" label="" name="type">
          <c-select
            class="!w-[200px]"
            v-model:value="dataResult.type"
            :data="['single', 'multiple']"
            placeholder="Chọn thuộc tính"
          ></c-select>
        </a-form-item>
        <a-form-item>
          <a-tooltip title="xóa trường">
            <div
              class="w-10 h-10 flex-center cursor-pointer shrink-0"
              @click="emits('removeField')"
            >
              <delete-outlined />
            </div>
          </a-tooltip>
        </a-form-item>
      </a-form>

      <!-- RELATION -->

      <a-form
        :model="dataResult"
        class="!flex !items-center !gap-4"
        ref="relationForm"
        :rules="RELATION_RULES"
        autocomplete="off"
        v-else-if="type == SCHEMAS.RELATION"
      >
        <a-form-item class="grow" name="ref_table">
          <c-select
            class="w-full"
            v-model:value="dataResult.ref_table"
            @change="handleTableRelationChange"
            placeholder="Chọn CMS hoặc data khác"
            :data="tableRelationData"
            show-search
          ></c-select>
        </a-form-item>
        <a-form-item class="" label="" name="type">
          <c-select
            class="!w-[200px]"
            v-model:value="dataResult.type"
            :data="['single', 'multiple']"
            placeholder="Chọn thuộc tính"
          ></c-select>
        </a-form-item>

        <a-form-item>
          <a-tooltip title="xóa trường">
            <div
              class="w-10 h-10 flex-center cursor-pointer shrink-0"
              @click="emits('removeField')"
            >
              <delete-outlined />
            </div>
          </a-tooltip>
        </a-form-item>
      </a-form>

      <!-- FILE -->

      <a-form
        :model="dataResult"
        class="w-full !flex !items-center !gap-4"
        ref="relationForm"
        :rules="FILE_RULES"
        autocomplete="off"
        v-else-if="type == SCHEMAS.FILE"
      >
<!--        <a-form-item class="grow" name="ref_table">-->
<!--          <c-select-->
<!--            class="w-full"-->
<!--            v-model:value="dataResult.ref_table"-->
<!--            @change="handleTableRelationChange"-->
<!--            placeholder="Chọn CMS hoặc data khác"-->
<!--            :data="tableRelationData"-->
<!--            show-search-->
<!--          ></c-select>-->
<!--        </a-form-item>-->
        <a-form-item class="grow" label="" name="type">
          <c-select
            class="!w-[200px]"
            v-model:value="dataResult.type"
            :data="['single', 'multiple']"
            placeholder="Chọn thuộc tính"
          ></c-select>
        </a-form-item>

        <a-form-item>
          <a-tooltip title="xóa trường">
            <div
              class="w-10 h-10 flex-center cursor-pointer shrink-0"
              @click="emits('removeField')"
            >
              <delete-outlined />
            </div>
          </a-tooltip>
        </a-form-item>
      </a-form>

      <div class="flex justify-between" v-else>
        <div></div>
        <a-tooltip title="xóa trường">
          <div class="w-10 h-10 flex-center cursor-pointer" @click="emits('removeField')">
            <delete-outlined />
          </div>
        </a-tooltip>
      </div>
    </a-collapse-panel>
    <template #expandIcon></template>
  </a-collapse>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import { type SCHEMAS_TYPE, SCHEMAS } from '@/constant/cms'
import { DeleteOutlined } from '@ant-design/icons-vue'

//COMPONENTS
import CSelect from '@/components/common/select/CSelect.vue'
import { useCmsStore } from '@/stores/cms'

type Props = {
  modelValue: string
  data: any
  type: SCHEMAS
}

const props = withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  (e: 'getData'): void
  (e: 'update:modelValue', id: string): void
  (e: 'update:data', id: string): void
  (e: 'removeField'): void
}>()

const cmsStore = useCmsStore()

const result = computed({
  set(value: string) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const dataResult = computed({
  set(value: string) {
    emits('update:data', value)
  },
  get() {
    return props.data
  }
})

const tableRelationData = computed(
  () => cmsStore.tableRelation?.map((table) => table.table_name || '') ?? []
)

const SELECT_RULES = {
  value: [{ required: true, message: 'chựa có lựa chọn!', trigger: 'blur' }],
  type: [{ required: true, message: 'thuộc tính bỏ trống!', trigger: 'blur' }]
}
const RELATION_RULES = {
  ref_table: [{ required: true, message: 'data chưa hợp lệ!', trigger: 'blur' }],
  type: [{ required: true, message: 'thuộc tính bỏ trống!', trigger: 'blur' }]
}

const FILE_RULES = {
  type: [{ required: true, message: 'thuộc tính bỏ trống!', trigger: 'blur' }]
}

const activeKey = ref<string[]>([])
const selectForm = ref<any>(null)
const relationForm = ref<any>(null)

const handleClick = () => {
  if (activeKey.value.length > 0) activeKey.value = [] as string[]
  else activeKey.value.push('1')
}

const handleTableRelationChange = (value: string) => {
  dataResult.value.is_cms = cmsStore.tableRelation.find((e) => e.table_name == value)?.is_cms || 0
}

const validate = async (): Promise<any> => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      await selectForm.value?.validate()
      await relationForm.value?.validate()
      resolve(true)
    } catch (error) {
      activeKey.value = ['1']
      reject(error)
    }
  })
}

defineExpose({ validate })
</script>

<style lang="scss">
.cms-input-field {
  border-radius: 0px !important;

  .cms-input-field-item {
    border-radius: 0px !important;
  }

  .ant-collapse-header {
    display: flex;
    align-items: center !important;
    padding-right: 0px !important;

    .ant-collapse-expand-icon {
      display: none !important;
    }
  }

  .ant-collapse-content {
    border-radius: 0px !important;
  }
}
</style>
