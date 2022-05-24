import { createApp } from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';
import App from './App.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import store from './store';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(VueAxios, axios);
app.component('Loading', Loading);

app.mount('#app');
