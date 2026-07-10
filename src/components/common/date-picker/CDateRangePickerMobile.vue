<template>
  <div class="">
    <div class="grid grid-cols-1 gap-2">
      <a-date-picker
        v-model:value="formState.startDate"
        :locale="Location.lang"
        format="DD/MM/YYYY"
        :placeholder="Location.lang.rangePlaceholder[0]"
        class="w-full"
      />
      <a-date-picker
        v-model:value="formState.endDate"
        :locale="Location.lang"
        format="DD/MM/YYYY"
        :placeholder="Location.lang.rangePlaceholder[1]"
        class="w-full"
      />
      <div v-if="props.isShowSummit" class="grid grid-cols-2 gap-2">
        <a-button @click="handleSubmit('delete')">Xóa</a-button>
        <a-button @click="handleSubmit('submit')" type="primary">Lưu</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs, { type Dayjs } from 'dayjs'
import { reactive, watch } from 'vue'
// UTILS
import { handle_error } from '@/utils/message'
import { DATE_REQUEST_FORMAT } from '@/utils/dayjs-helper'

type Props = {
  value: [Dayjs | null, Dayjs | null],
  isShowSummit?: boolean
}
const props = withDefaults(defineProps<Props>(), { isShowSummit: true })

const emit = defineEmits<{
  (e: 'update:value', value: [Dayjs | null, Dayjs | null]): void,
  (e: 'change', value: [Dayjs | null, Dayjs | null]): void
}>()

const formState = reactive({
  startDate: props.value?.[0] ?? null as Dayjs | null,
  endDate: props.value?.[0] ?? null as Dayjs | null,
})

const handleSubmit = (type: 'submit' | 'delete') => {
  if (type === 'submit') {
    if (dayjs(formState.startDate).format(DATE_REQUEST_FORMAT) > dayjs(formState.endDate).format(DATE_REQUEST_FORMAT)) {
      handle_error('Ngày bắt đầu không được lớn hơn ngày kết thúc')
      return
    }
  } else {
    formState.startDate = null
    formState.endDate = null
  }
  emit('change', [formState.startDate, formState.endDate])
}

watch(formState, () => {
  if(formState.startDate && formState.startDate) {
    if (dayjs(formState.startDate).format(DATE_REQUEST_FORMAT) > dayjs(formState.endDate).format(DATE_REQUEST_FORMAT)) {
      handle_error('Ngày bắt đầu không được lớn hơn ngày kết thúc')
      return
    }
  }
  emit('update:value', [formState.startDate, formState.endDate])
})

const Location = {
  lang: {
    locale: "vi_VN",
    placeholder: "Chọn ngày",
    rangePlaceholder: ["Ngày bắt đầu", "Ngày kết thúc"],
    today: "Hôm nay",
    now: "Bây giờ",
    backToToday: "Trở về hôm nay",
    ok: "OK",
    clear: "Xóa",
    month: "Tháng",
    year: "Năm",
    timeSelect: 'Chọn giờ',
    dateSelect: "Chọn ngày",
    monthSelect: "Chọn tháng",
    yearSelect: "Chọn năm",
    decadeSelect: "Chọn thập kỷ",
    yearFormat: "YYYY",
    dateFormat: "DD/MM/YYYY",
    dayFormat: "DD",
    dateTimeFormat: "DD/MM/YYYY HH:mm:ss",
    monthFormat: "MMMM",
    monthBeforeYear: true,
    previousMonth: "Tháng trước (PageUp)",
    nextMonth: "Tháng sau (PageDown)",
    previousYear: "Năm trước (Control + left)",
    nextYear: "Năm sau (Control + right)",
    previousDecade: "Thập kỷ trước",
    nextDecade: "Thập kỷ sau",
    previousCentury: "Thế kỷ trước",
    nextCentury: "Thế kỷ sau",
  },
  timePickerLocale: {
    placeholder: "Chọn giờ"
  },
  dateFormat: "DD/MM/YYYY",
  dateTimeFormat: "HH:mm:ss DD/MM/YYYY",
  weekFormat: "DD",
  monthFormat: "MM-YYYY"
}
</script>

<style lang="scss"></style>
