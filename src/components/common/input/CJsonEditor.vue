<template>
  <codemirror
    v-model="content"
    placeholder=""
    :style="{ height: 'auto', width: '100%  !important' }"
    :autofocus="false"
    :indent-with-tab="true"
    :tab-size="1"
    :extensions="extensions"
  />
</template>
<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { basicSetup, EditorView } from 'codemirror'
import { gutter, GutterMarker, lineNumbers } from '@codemirror/view'
import { jsonLanguage, json } from '@codemirror/lang-json'
import { EditorState, Compartment } from '@codemirror/state'
import { Codemirror } from 'vue-codemirror'
import C from '@/constant/color'

const language = new Compartment()

const theme = EditorView.theme({
  '&': {
    color: C.Text,
    backgroundColor: '#fff'
  },
  '.cm-content': {
    caretColor: '#0e9',
    border: `1px solid ${C.BorderGray}`,
    borderRadius: '8px'
  },
  '.cm-line': {
    textWrap: 'wrap'
  },
  '.ͼd': {
    color: C.Success
  },
  '.ͼe': {
    color: C.Error
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: C.Text
  },
  '.cm-gutters': {
    display: 'none'
  }
})

const emptyMarker = new (class extends GutterMarker {
  toDOM() {
    return document.createTextNode('ø')
  }
})()
const emptyLineGutter = gutter({
  lineMarker(view, line) {
    return line.from == line.to ? emptyMarker : emptyMarker
  },
  initialSpacer: () => emptyMarker
})
const lineNumber = lineNumbers()
const extensions = [json(), theme, lineNumber, emptyLineGutter]

type Props = {
  modelValue: string
}

const props = withDefaults(defineProps<Props>(), {})

const emits = defineEmits<{
  (e: 'update:modelValue', id: string): void
}>()

const content = computed({
  get() {
    return format(props.modelValue)
  },
  set(value) {
    emits('update:modelValue', value.trim())
  }
})

onMounted(() => {
})

const format = (text: string): string => {
  try {
    const obj = JSON.parse(text)
    return JSON.stringify(obj, undefined, '\t')
  } catch (e) {
    return text
  }
}
</script>

<style lang="scss">
.cm-content {
  padding: 8px !important;
  transition: all 0.2s;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    border-color: #242424;
  }

  .cm-line {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
