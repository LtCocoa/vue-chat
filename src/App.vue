<template>
    <div id="main-container">
        <div class="new-channel-tab-wrapper">
            <button class="new-channel-tab" @click="newChannelTab">+</button>
        </div>
        <div id="channel-tab-wrapper">
            <channelTab v-for="(tab, index) in channelTabs" v-bind:key="tab.id"></channelTab>
        </div>
    </div>
</template>

<script>
    import btn from './components/btn/btn';
    import channelTab from './components/ChannelTab/ChannelTab';
    import socketIOClient from 'socket.io-client';
    
    const client = socketIOClient('http://192.168.1.65:8080');

    export default {
        name: "App",
        data() {
            return {      
                channelTabs: []
            }
        },
        methods: {
            newChannelTab() {
                let newTabId = this.channelTabs.length > 0 ? this.channelTabs[this.channelTabs.length - 1].id + 1 : 1;
                this.channelTabs.push({id: newTabId});
                console.log(this.channelTabs);
            }
        },        
        computed: {
            getNumber() {
                console.log('called computed');
                return this.messages;
            },
        },
        components: {
            btn,
            channelTab,
        },
    }
</script>

<style scoped>
    #main-container {
        padding: 20px;
    }

    .new-channel-tab-wrapper {
        display: flex;
        position: fixed;
    }

    #channel-tab-wrapper {
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: center;
        margin: 80px auto 0;
    }

    .new-channel-tab {
        padding: 10px 20px;
        font-size: 30px;
        font-weight: bold;
    }
</style>