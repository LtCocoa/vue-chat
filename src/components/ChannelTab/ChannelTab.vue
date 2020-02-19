<template>
    <div id="channel-tab-container">
        <div v-show="connected">
            <button class="button-disconnect" @click="leaveChannel">x</button>
        </div>
        <div v-show="!connected">
            <input type="text" v-model.lazy="channelName" @keyup.enter="joinChannel"/>
            <button class="button-connect" @click="joinChannel">Connect</button>
        </div>
        <messages :messages="messages" :channelName="channelName"></messages>
    </div>
</template>

<script>
import messages from '../Messages/Messages';
const tmi = require('tmi.js');

export default {
    data() {
        return {
            channelName: '',
            messages: [],
            connected: false,
            opts: {
                identity: {
                    username: "AdmiralCocoa",
                    password: "oauth:5ere6csxlnvqqf2bamramal7zhyopd",
                },
                channels: [],
            },
            clientTMI: null,
        }
    },
    methods: {
        joinChannel() {
            this.opts.channels.push(this.channelName);
            this.clientTMI = new tmi.client(this.opts);
            this.clientTMI.on('message', this.pushTwitchMessage);
            this.clientTMI.connect();
            this.connected = true;
        },
        leaveChannel() {
            this.clientTMI.disconnect();
            this.connected = false;
            this.$emit('closeTab');
        },
        pushTwitchMessage(target, context, msg, self) {
            this.messages.push({context, msg});
            var container = this.$el.querySelector("#messages");
            container.scrollTop = container.scrollHeight;
            if(this.messages.length > 50) {
                this.messages.shift();
            }
        },
    },
    components: {
        messages,
    }
}
</script>

<style scoped>
    #channel-tab-container {
        float: left;
        display: block!important;
        border-radius: 10px;
        background-color: brown;
        height: 100%;
        margin: 10px;
    }

    p {
        color: white;
    }

    input {
        border: none;
        border-radius: 10px;
        padding: 10px;
        background-color: brown;
        margin-bottom: 0px;
        width: 300px;
        font-size: 25px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
    }

    .button-connect {
        border: none;
        font-size: 18px;
        background-color: brown;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
    }

    .button-disconnect {
        width: 100%;
        border: none;
        font-size: 18px;
        border-radius: -50%;
        background-color: brown;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
    }
</style>