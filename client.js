import Vue from 'vue';
import App from './App.vue'
import eventBus from './eventBus';

new Vue({
    el: "#app",
    render: h => h(App)
});