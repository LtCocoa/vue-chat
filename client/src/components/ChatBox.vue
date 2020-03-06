<template>
    <div id="messages-container">
        <div v-for="(message, index) in messages" :key="index" class="message">
            <p>{{message.userName}}</p>
            <span>{{message.message}}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        messages: Array,
    },
    data() {
        return {
            message: '',
        }
    },
    methods: {
        scrollToBottom() {
            var container = this.$el;
            container.scrollTop = container.scrollHeight;
        }
    },
    updated() {
        this.scrollToBottom();
    },
    mounted() {
        this.scrollToBottom();
    }
}
</script>

<style scoped>
    h1 {
        margin: 0;
    }

    #messages-container {
        height: 700px;
        flex: 1;
        overflow-y: auto;
        margin-bottom: 20px;
    }

    .message {
        padding: 10px 20px;
        background-color: rgb(207, 207, 207);
        border-radius: 10px;
        margin: 5px 15px;
    }

    .message p {
        color:royalblue;
        margin: 0;
        font-size: 20px;
    }

    .message span {
        font-size: 16px;
        word-wrap: break-word;
    }

    ::-webkit-scrollbar {
        width: 5px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 4px #16163b;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #3030af;
        box-shadow: inset 0 0 5px lightskyblue;
    }

</style>