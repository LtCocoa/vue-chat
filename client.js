const socketIOClient = require("socket.io-client");
import Vue from 'vue';
import App from './App.vue'
import eventBus from './eventBus';

const client = socketIOClient('http://localhost:8080');

new Vue({
    el: "#app",
    created() {
        eventBus.$on('increaseNumber', function(value) {
            client.emit('onNumberChange', value);
        });
        eventBus.$on()
    },
    render: h => h(App)
});

client.on('myEvent', function() {
    console.log(App);
});

client.on('pushNumber', function(value) {
    eventBus.$emit('pushNumber', value);
});