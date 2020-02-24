<template>
    <div id="chat-container">
        <h2>chat messages</h2>
        <div id="message-box-container">
            <div v-for="message in messages" class="message">
                <p>{{message.username}}</p>
                <span>{{message.message}}</span>
            </div>
        </div>
        
        <input type="text" 
            placeholder="type your message"
            class="message-input"
            v-model="message"
            @keyup.enter="newMessage">
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
        newMessage() {
            if(this.message !== '') {
                this.$emit('message', this.message);
                this.message = '';
            }
        },
        scrollToBottom() {
            var container = this.$el.querySelector("#message-box-container");
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

<style>
    #chat-container {
       display:flex;

       flex-flow:column;
        height:100%;
        flex:1;
    }

    h1 {
        margin: 0;
    }

    #message-box-container {
        max-height: 500px;
        flex:1;
        overflow-y: scroll;
    }

    .message {
        padding: 5px;
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

    .message-input {
        border: none;
        border-radius: 10px;
        outline: none;
        padding: .5rem 1rem;
        margin-top: 50px;
        font-size: 25px;
        width: 90%;
        background-color: lightgray;
        transition: all .2s ease-in-out;
    }

    .message-input:focus {
        border: 1px solid purple;
        background-color: black;
        color: white;
    }

    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px #303080;
        border-radius: 10px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #181840;
        border-radius: 10px;
        box-shadow: inset 0 0 5px lightskyblue;
    }

</style>