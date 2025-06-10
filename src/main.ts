import { createApp } from 'vue';

import ElementPlus from 'element-plus';
// import * as icons from '@element-plus/icons-vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import 'element-plus/dist/index.css';
import './assets/main.css';

import App from './App.vue';
import router from './router';
import pinia from './stores';

const app = createApp(App);

app.use(pinia);

app.use(router);

app.use(ElementPlus, { locale: zhCn });

app.mount('#app');

// for (const [key, icon] of Object.entries(icons)) {
//   app.component(key, icon);
// }