<template>
  <ckeditor v-model="result" :editor="editor" :config="editorConfig" />
</template>

<script lang="ts" setup>
import { computed, ref, defineComponent } from 'vue'
import {
  ClassicEditor,
  Bold,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Alignment,
  Heading,
  Link,
  List,
  Indent,
  IndentBlock,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Table,
  TableColumnResize,
  TableToolbar,
  BlockQuote,
  MediaEmbed,
  EasyImage,
  CloudServices,
  ImageInsertViaUrl,
  Font,
  type Editor
} from 'ckeditor5'
import type { EditorConfig } from 'ckeditor5'
import { MyCustomUploadAdapterPlugin } from '@/utils/uploadCkEditor'

import 'ckeditor5/ckeditor5.css'
type Props = {
  modelValue: string
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'update:modelValue', id: string): void
}>()

const result = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})

const token = localStorage.getItem('access_token')
// const CkFditor = defineComponent(CkEditor.component)

const uploadFunction = async (file: any) => {
  console.log('uploadFunction', file)
}

const editor = ClassicEditor
const editorConfig = {
  plugins: [
    Bold,
    Italic,
    Mention,
    Paragraph,
    Undo,
    Alignment,
    Heading,
    Link,
    List,
    Indent,
    IndentBlock,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageResize,
    Table,
    TableColumnResize,
    TableToolbar,
    BlockQuote,
    CloudServices,
    EasyImage,
    MediaEmbed,
    ImageInsertViaUrl,
    Font
  ],
  alignment: {
    options: ['left', 'center', 'right']
  },
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true
    }
  },
  indentBlock: {
    offset: 2,
    unit: 'em'
  },
  mediaEmbed: {
    toolbar: ['alignment', 'undo', 'redo']
  },
  image: {
    toolbar: [
      'imageTextAlternative',
      'toggleImageCaption',
      '|',
      'imageStyle:inline',
      'imageStyle:wrapText',
      'imageStyle:breakText',
      '|',
      'resizeImage'
    ],
    resizeOptions: [
      {
        name: 'resizeImage:original',
        label: 'Default image width',
        value: null
      },
      {
        name: 'resizeImage:50',
        label: '25% page width',
        value: '50'
      },
      {
        name: 'resizeImage:50',
        label: '50% page width',
        value: '50'
      },
      {
        name: 'resizeImage:75',
        label: '75% page width',
        value: '75'
      }
    ],

    insert: {
      type: 'auto',
      integrations: ['upload', 'assetManager', 'url']
    }
  },
  ImageStyle: {
    styles: {},
    on: (event: any, callback: any) => {
      console.log(event)
    }
  },
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: 'https://'
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
  },
  extraPlugins: [
    function (editor) {
      MyCustomUploadAdapterPlugin(editor, handleContentUpdated)
    }
  ],
  toolbar: {
    items: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'alignment',
      '|',
      'bold',
      'italic',
      'link',
      '|',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'indent',
      'outdent',
      '|',
      'insertImage',
      'insertTable',
      'blockQuote',
      'mediaEmbed',
      '|',
      'numberedList',
      'bulletedList'
    ],
    shouldNotGroupWhenFull: true
  },
  licenseKey: '<YOUR_LICENSE_KEY>'
} as EditorConfig
const handleContentUpdated = (content: any) => {
  const images = result.value?.match(/data:image[^\s"]*/g)
}
</script>

<style lang="scss">
.ck-content {
  max-height: 600px;
  overflow: auto;
}

</style>
