import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';
import App from './App.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import store from './store';

Vue.use(VueAxios, axios);
Vue.component('Loading', Loading);

new Vue({
	store,
	router,
	render: (h) => h(App)
}).$mount('#app');
