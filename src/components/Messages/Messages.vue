<template>
    <div id="messages-container">
        <div id="messages-header">
            <p>{{channelName}}</p>
        </div>
        <div id="messages">
            <div v-for="(message, index) in messages" class="message" :style="kekwStyle(message.msg)">
                <a class="messages-name" :style="getNameColor(index)" :href='`https://twitch.tv/${message.context["display-name"]}`'>{{message.context["display-name"]}}</a>:
                <span>{{message.msg}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        messages: Array,
        channelName: String,
    },
    data() {
        return {
            
        }
    },
    methods: {
        getNameColor(index) {
            return {
                color: this.messages[index].context.color,
            }
        },
        kekwStyle(msg) {
            return {
                backgroundColor: msg === "KEKW" ? "grey" : "inherit",
            }
        }
    },
    computed: {
        
    }
}
</script>

<style scoped>
    * {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
    }

    #messages-container {
        color: white;
        margin: 0 auto;
        width: 400px;
        border: 1px solid slateblue;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        float: left;
        background-color: #0e0e10;
    }

    #messages {
        height: 700px;
        overflow-y: scroll;
        overflow-x: hidden;
        word-wrap: break-word;
        padding: 5px 0 5px 5px;
    }

    #messages-header {
        padding: 0;
        display: flex;
        background-color: slateblue;
    }

    #messages-header p {
        margin-left: 20px;
        font-weight: 500;
        font-size: 20px;
    }

    .message {
        margin-bottom: 5px;
    }

    .messages-name {
        font-weight: 500;
    }

    a {
        text-decoration: none;
    }
</style>