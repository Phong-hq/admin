import './style/index.scss'

import { createApp, defineComponent } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import {
  Button,
  ConfigProvider,
  StyleProvider,
  Form,
  Input,
  InputNumber,
  Menu,
  Dropdown,
  Space,
  Avatar,
  Table,
  Popconfirm,
  Checkbox,
  Select,
  Upload,
  Spin,
  Divider,
  Modal,
  Tag,
  Tooltip,
  Result,
  Drawer,
  DatePicker,
  Collapse,
  Pagination,
  Image,
  Empty,
  Steps,
  Breadcrumb,
  Popover,
  Radio,
  Card,
  Switch,
  } from 'ant-design-vue'
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

//ANT
app.use(Button)
app.use(ConfigProvider)
app.use(StyleProvider)
app.use(Form)
app.use(Input)
app.use(InputNumber)
app.use(Menu)
app.use(Dropdown)
app.use(Space)
app.use(Avatar)
app.use(Table)
app.use(Popconfirm)
app.use(Checkbox)
app.use(Select)
app.use(Upload)
app.use(Spin)
app.use(Divider)
app.use(Modal)
app.use(Tag)
app.use(Tooltip)
app.use(Result)
app.use(Drawer)
app.use(DatePicker)
app.use(Collapse)
app.use(Pagination)
app.use(Image)
app.use(Empty)
app.use(Steps)
app.use(Breadcrumb)
app.use(Popover)
app.use(Radio)
app.use(Card)
app.use(Switch)

app.use(CkeditorPlugin)

app.mount('#app')
