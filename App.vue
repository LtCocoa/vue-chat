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
        }
    }
</script>