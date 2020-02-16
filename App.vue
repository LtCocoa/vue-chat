<template>
    <div>
        <messages></messages>
        <p v-for="message in messages">{{message}}</p>
        <input type="text" v-model="input"/>
        <btn @click="sendMessage"></btn>
        <button @click="clearMessages">clear</button>
    </div>
</template>

<script>
    import eventBus from './eventBus';
    import btn from './btn';
    import messages from './Messages';
    import socketIOClient from 'socket.io-client';
    const tmi = require('tmi.js');
    const opts = {
        identity: {
            username: "AdmiralCocoa",
            password: "oauth:5ere6csxlnvqqf2bamramal7zhyopd",
        },
        channels: [
            "AdmiralBulldog"
        ]
    };
    const clientTMI = new tmi.client(opts);

    const client = socketIOClient('http://localhost:8080');

    export default {
        name: "App",
        data() {
            return {
                messages: [],
                input: ''
            }
        },
        methods: {
            sendMessage() {
                if(this.input != '') {
                    client.emit('newMessage', this.input);
                }
                this.input = '';
            },
            pushMessage(msg) {
                this.messages.push(msg);
            },
            clearMessages() {
                client.emit('clearMessages');
            },
            pushTwitchMessage(msg) {
                this.messages.push(msg);
            }
        },
        computed: {
            getNumber() {
                console.log('called computed');
                return this.messages;
            }
        },
        components: {
            btn,
            messages
        },
        mounted() {
            client.on('allMessages', (messages) => {
                this.messages = messages;
            });
            client.on('newMessage', (msg) => {
                this.pushMessage(msg);
            });

            clientTMI.on('message', this.pushTwitchMessage);
            clientTMI.on('connected', onConnectedHandler);
            // Connect to Twitch:
            clientTMI.connect();
        }
    }
</script>