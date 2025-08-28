import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

import './assets/css/style.css'
import './assets/js/main.js'
import router from '@/router/index.js'


import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";

createApp(App)
    .use(createPinia())
    .use(router)
    .mount('#app')
