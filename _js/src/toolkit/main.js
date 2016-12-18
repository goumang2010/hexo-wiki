import Vue from 'vue';

import Router from 'vue-router';
Vue.use(Router);

import VuePagination from 'vue2-pagination';
Vue.use(VuePagination);

import App from './App.vue';
import routes from './routes';

Vue.config.debug = true;

const router = new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes
});

import './filter/index.js';

/* eslint-disable no-new */
new Vue({
    router,
    ...App
}).$mount('#app');
