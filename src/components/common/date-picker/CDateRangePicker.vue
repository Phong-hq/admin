<template>
  <a-range-picker
    :locale="Location"
    :placeholder="['Ngày bắt đầu', 'Ngày kết thúc']"
    :format="'DD/MM/YYYY'"
    >
<!--    <template #dateRender>2</template>-->
  </a-range-picker>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

// COMPONENT

// PINIA

//UTILS

const Location = {
  "lang": {
    "locale": "vi_VN",
    "placeholder": "Chọn ngày",
    "rangePlaceholder": ["Ngày bắt đầu", "Ngày kết thúc"],
    "today": "Hôm nay",
    "now": "Now",
    "backToToday": "Trở về hiện tại",
    "ok": "OK",
    "clear": "Xóa",
    "month": "Tháng",
    "year": "Năm",
    "timeSelect": 'Chọn giờ',
    "dateSelect": "Chọn ngày",
    "monthSelect": "Chọn tháng",
    "yearSelect": "Chọn năm",
    "decadeSelect": "Chọn thập kỷ",
    "yearFormat": "YYYY",
    "dateFormat": "DD/MM/YYYY",
    "dayFormat": "DD",
    "dateTimeFormat": "DD/MM/YYYY HH:mm:ss",
    "monthFormat": "MMMM",
    "monthBeforeYear": true,
    "previousMonth": "Previous month (PageUp)",
    "nextMonth": "Next month (PageDown)",
    "previousYear": "Last year (Control + left)",
    "nextYear": "Next year (Control + right)",
    "previousDecade": "Last decade",
    "nextDecade": "Next decade",
    "previousCentury": "Last century",
    "nextCentury": "Next century"
  },
  "timePickerLocale": {
    "placeholder": "Select time"
  },
  "dateFormat": "DD/MM/YYYY",
  "dateTimeFormat": "HH:mm:ss DD/MM/YYYY",
  "weekFormat": "DD",
  "monthFormat": "MM-YYYY"
}


onMounted(() => {
})
</script>

<style lang="scss"></style>
