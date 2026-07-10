<template>
  <div>
    <!--    <vue3-barcode value="eeee" :height="50" />-->
    <a-button @click="showModal">
      <template #icon>
        <printer-outlined />
      </template>
      Print barcode
    </a-button>
    <a-modal v-model:open="open" title="Print barcode" :footer="null" :width="850">
      <div class="flex justify-center gap-4">
        <div>
          <p class="heading-2">Variants</p>
            <c-table class="w-full" :columns="columns" :data="variantQuantityData">
              <template #bodyCell="{ text, record, column, index }">
                <template v-if="column.key == 'quantity'">
                  <a-input-number v-model:value="variantQuantityData[index].quantity" />
                </template>
                <template v-else-if="column.key == 'name'">
                  <a-input v-model:value="variantQuantityData[index].name" />
                </template>
                <template v-else-if="column.key == 'unit_price'">
                  <a-input
                    v-model:value="variantQuantityData[index].unit_price"
                    @input="
                      variantQuantityData[index].unit_price = currencyInput(
                        variantQuantityData[index].unit_price
                      )
                    "
                  />
                </template>
              </template>
            </c-table>
<!--          <a-card title="Variants" size="small" :bodyStyle="{ padding: '12px', overflow: 'hidden' }">-->
<!--          </a-card>-->
        </div>
      </div>
      <div class="grid grid-cols-[250px_1fr] mt-4 gap-4 h-auto">
        <a-card class="!h-full" title="Print size" size="small">
          <a-radio-group class="flex !flex-col gap-2" v-model:value="grid" :options="Roll_Data" />
        </a-card>
        <a-card class="grow !h-full" title="Stamp sample" size="small">
          <div class="flex !flex-col gap-2">
            <div>
              <a-switch v-model:checked="showName" size="small"
                ><span class="ml-2">Variant name:</span></a-switch
              >
              <span class="ml-2">Variant name</span>
            </div>
            <div>
              <a-switch v-model:checked="showBarcode" size="small" />
              <span class="ml-2">Barcode</span>
            </div>
            <div>
              <a-switch v-model:checked="showPrice" size="small" />
              <span class="ml-2">Price</span>
            </div>
          </div>
        </a-card>
      </div>
      <div class="flex justify-end gap-4 mt-7">
        <a-button type="primary" @click="print" :loading="submitLoading">
          <template #icon>
            <printer-outlined />
          </template>
          Print
        </a-button>
        <a-button class="!bg-success" type="primary" @click="printPdf" :loading="pdfSubmitLoading">
          <template #icon>
            <printer-outlined />
          </template>
          Print file PDF
        </a-button>
      </div>
    </a-modal>
    <teleport to="#app">
      <div class="hidden print-item z-[99999999] w-full bg-white">
        <div
          style="width: 100%; display: grid; gap: 0; margin: -12px 0 -8px 0 !important"
          :style="`grid-template-columns: repeat(${grid}, 1fr)`"
        >
          <template v-for="(itemBarcode, i) in listBarcode" :key="i">
            <div
              style="
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
              "
            >
              <p
                style="
                  padding: 0px 2px !important;
                  text-align: center;
                  font-size: 10px;
                  font-weight: 700;
                  margin: 0 !important;
                  display: -webkit-box;
                  -webkit-font-smoothing: antialiased;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  text-overflow: ellipsis;
                  overflow: hidden;
                "
                v-if="showName"
              >
                {{ itemBarcode.name }}
              </p>
              <div
                style="padding: 0 8px !important; display: flex; justify-content: center"
                v-if="showBarcode"
              >
                <svg :id="'barcode-item-' + itemBarcode.barcode"></svg>
              </div>
              <p
                style="
                  text-align: center;
                  font-size: 10px;
                  font-weight: 700;
                  margin: 0 !important;
                  display: -webkit-box;
                  -webkit-font-smoothing: antialiased;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  text-overflow: ellipsis;
                  overflow: hidden;
                "
              >
                <!--              {{ itemBarcode.sku }}-->
              </p>
              <p
                style="
                  padding: 0 2px !important;
                  text-align: center;
                  font-size: 12px;
                  font-weight: 700;
                  margin: -2px 0 0 0 !important;
                  display: -webkit-box;
                  -webkit-font-smoothing: antialiased;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  text-overflow: ellipsis;
                  overflow: hidden;
                "
                v-if="showPrice"
              >
                {{ currency(itemBarcode.unit_price) }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { PrinterOutlined } from '@ant-design/icons-vue'
import type { COLUMN_TYPE } from '@/types/table'
import JsBarcode from 'jsbarcode'
import { svg2pdf } from 'svg2pdf.js'
import fontRoboto from "@/assets/font/roboto_base64";

// COMPONENT
import CTable from '@/components/common/table/CTable.vue'

// PINIA

//UTILS
import { currency, currencyInput } from '../../utils/currency'
import { jsPDF } from 'jspdf'
// const { jsPDF } = (window as any).jspdf;
type Props = {
  variant: any
}

type Barcode = {
  id: any
  name: string
  quantity: number
  unit_price: string
  barcode: any
}

const props = withDefaults(defineProps<Props>(), {})

const Roll_Data = [
  {
    label: '3 stamps (110x22mm)',
    value: 3,
    stamp_width: 36,
    roll_width: 110,
    roll_height: 22
  },
  {
    label: '2 stamps (77x22mm)',
    value: 2,
    stamp_width: 36,
    roll_width: 77,
    roll_height: 22
  }
]

const columns = [
  {
    title: 'ID',
    key: 'id'
  },
  {
    title: 'Name',
    key: 'name',
    width: 450
  },
  {
    title: 'Quantity',
    key: 'quantity'
  },
  {
    title: 'Unit price',
    key: 'unit_price'
  }
] as COLUMN_TYPE[]

onMounted(() => {})
const open = ref<boolean>(false)
const submitLoading = ref<boolean>(false)
const pdfSubmitLoading = ref<boolean>(false)
const variantQuantityData = ref<Barcode[]>([])
const listBarcode = ref<Barcode[]>([])
const grid = ref(3)
const showPrice = ref(true)
const showBarcode = ref(true)
const showName = ref(true)

const showModal = () => {
  variantQuantityData.value = []
  open.value = true
  let id = 0
  props.variant.forEach((item: any) => {
    id++
    variantQuantityData.value.push({
      id: id ?? null,
      name: item.name ?? '',
      quantity: item.quantity ?? 0,
      unit_price: currency(item.unit_price ?? 0),
      barcode: item.sku ?? 0
    })
  })
}

const generateAllBarcode = async () => {
  listBarcode.value = []
  let id = 0
  for (let i = 0; i < variantQuantityData.value.length; i++) {
    for (let j = 0; j < (variantQuantityData.value[i].quantity || 0); j++) {
      listBarcode.value.push({ ...variantQuantityData.value[i], id })
      id++
    }
  }

  for (let k = 0; k < variantQuantityData.value.length; k++) {
    await generateBarcode(
      variantQuantityData.value[k].barcode,
      'barcode-item-' + variantQuantityData.value[k].barcode
    )
  }
}

const printPdf = async () => {
  pdfSubmitLoading.value = true
  await generateAllBarcode()
  const roll_config = Roll_Data.find((e) => e.value == grid.value)
  if (roll_config) {

    const pdf = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: [roll_config.roll_width, roll_config.roll_height]
    })
    pdf.addFileToVFS("Roboto-Regular.ttf", fontRoboto);
    pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    pdf.setFont("Roboto");
    let index = 0
    const padding = (roll_config.roll_width - roll_config.value * roll_config.stamp_width) / 2
    const barcode_width = 20
    const barcode_height = 10
    for (let i = 0; i < listBarcode.value?.length; i++) {
      index++
      if (index > roll_config.value) {
        pdf.addPage([roll_config.roll_width, roll_config.roll_height])
        index = 1
      }
      const svgElement = document.getElementById('barcode-item-' + listBarcode.value[i].barcode)
      let fontSize = 4
      if (listBarcode.value[i].name.length > 48) fontSize = 3.5
      pdf.setFontSize(fontSize)
      if (showName.value) {
        pdf.text(
          listBarcode.value[i].name,
          padding + roll_config.stamp_width * (index - 1) + roll_config.stamp_width / 2,
          4,
          { align: 'center' }
        )
      }
      pdf.setFontSize(4)
      if (showPrice.value) {
        pdf.text(
          currency(listBarcode.value[i].unit_price),
          padding + roll_config.stamp_width * (index - 1) + roll_config.stamp_width / 2,
          18,
          { align: 'center' }
        )
      }
      if (svgElement && showBarcode.value) {
        await svg2pdf(svgElement, pdf, {
          x:
            padding +
            (roll_config.stamp_width - barcode_width) / 2 +
            roll_config.stamp_width * (index - 1),
          y: 5,
          width: barcode_width,
          height: barcode_height
        })
      }
    }
    const time = Date.now()
    pdf.save(`barcode_print_${time}.pdf`)
  }
  pdfSubmitLoading.value = false
}

const print = async () => {
  submitLoading.value = true
  await generateAllBarcode()
  window.print()
  submitLoading.value = false
}

const generateBarcode = async (value: string, id: string) => {
  let interval = null as any
  const promise2 = new Promise<any>((resolve) =>
    setTimeout(
      () => {
        clearInterval(interval)
        resolve(true)
      },
      3000,
      'Slow'
    )
  )
  const promise1 = new Promise<any>((resolve) => {
    if (value && id) {
      interval = setInterval(() => {
        try {
          JsBarcode(`#${id}`, value, {
            format: 'CODE128', // Barcode format
            lineColor: '#000', // Color of the bars
            width: 2, // Width of a single bar
            height: 100, // Height of the barcode
            displayValue: true // Show the value below the barcode
          })
          clearInterval(interval)
          resolve(true)
        } catch (e) {
          console.log(e)
        }
      }, 200)
    } else {
      resolve(true)
    }
  })
  return Promise.race([promise1, promise2]).then((result) => {})
}
</script>

<style lang="scss">
@media print {
  .print-item {
    display: block !important;
  }
  .ant-layout {
    display: none !important;
  }
  .ant-modal-root {
    display: none !important;
  }
  .ant-notification {
    display: none !important;
  }
}
</style>
