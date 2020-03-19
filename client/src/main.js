import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueAxios from './plugins/axios';

Vue.config.productionTip = false;

new Vue({
	VueAxios,
	vuetify,
	render: h => h(App)
}).$mount('#app');
