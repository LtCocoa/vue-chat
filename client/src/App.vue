<template>
    <div id="main-wrapper">
        <div id="main-container">
            <div id="navbar">
                <ul id="navbar-nav">
                    <li class="nav-item">
                        <a href="#" class="nav-link">
                            <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="user"
                                class="svg-inline--fa fa-user fa-w-14"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                                ></path>
                            </svg>
                            <span class="nav-text">{{user.name}}</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        
                        <input type="text" placeholder="username" id="user-name-input" v-model.lazy="user.name" @change="changeUsername" maxlength="10">
                    </li>
                </ul>
            </div>
            <div id="chat-wrapper">
                <div id="chat-container">
                    <div class="section-header section-header-room-list">
                        <h5>room list</h5>
                    </div>
                    <div class="section-header section-header-room-name">
                        <h5>{{!user.selectedRoom ? 'room name': user.selectedRoom}}</h5>
                    </div>
                    <div class="section-header section-header-user-list">
                        <h5>users</h5>
                    </div>
                    <div id="room-list-wrapper">
                        <ul>
                            <li v-for="room in rooms" :key="room.id" @click="joinRoom(room)">
                                <span :class="{active: room === user.selectedRoom}">{{room}}</span>
                            </li>
                        </ul>
                    </div>
                    <div id="chat-box-wrapper">
                        <chat-box :messages="messages"></chat-box>
                        <div id="message-input-wrapper">
                            <input type="text" 
                                placeholder="type your message"
                                class="message-input"
                                v-model="newMessage"
                                @keyup.enter="sendMessage"
                                v-if="user.selectedRoom.length > 0">
                        </div>
                    </div>
                    <div id="user-list-wrapper">
                        <ul>
                            <li v-for="(user, index) in currentRoomUsers" :key="index">
                                <span class="user-name">{{user.name}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import socketIOClient from 'socket.io-client';
    import ChatBox from './components/ChatBox';
    import { VDialog } from 'vuetify/lib';
    
    const client = socketIOClient('http://localhost:8080');

    export default {
        name: "App",
        data() {
            return {
                user: {
                    name: 'anonymous',
                    selectedRoom: '',
                },
                newMessage: '',
                rooms: [],
                currentRoomUsers: [],
                messages: [],
            }
        },
        computed: {
            
        },
        methods: {
            joinRoom(roomName) {
                if(this.user.name == '') {
                    return;
                }
                if(roomName !== this.user.selectedRoom){
                    this.leaveRoom();
                    client.emit('join-room', {name: this.user.name, selectedRoom: roomName});
                }
            },
            leaveRoom() {
                this.user.selectedRoom = '';
                client.emit('leave-room');
            },
            sendMessage() {
                if((this.user.selectedRoom.length > 0) && (this.newMessage.length > 0)) {
                    client.emit('message', this.newMessage);
                    this.newMessage = '';
                }
            },
            changeUsername() {
                client.emit('change-username', this.user.name);
            },
        },
        components: {
            "chat-box": ChatBox,
        },
        mounted() {
            console.log(vuetify);
            localStorage.setItem('token', 'asdklknczlkxc');

            client.on('room-list', (data) => {
                this.rooms = data;
            });

            client.on('connected', obj => {
                if(obj.result) {
                    console.log(obj);
                    this.user.selectedRoom = obj.name;
                    this.messages = obj.messages;
                }
            });

            client.on('disconnected', () => {
                this.user.selectedRoom = '';
                console.log('disconnected');
            });

            client.on('room-users', obj => {
                this.currentRoomUsers = obj;
                console.log("room users: ", obj);
            });

            client.on('message', msg => {
                this.messages.push(msg);
            });
        }
    }
</script>

<style scoped>
    #main-wrapper {
        display: block;
        height: 100%;
    }

    #main-container {
        display: flex;
        height: 100%;
        background-color: rgb(30, 28, 36);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    #navbar {
        position: fixed;
        display: block;
        width: 5rem;
        height: 100%;
        top: 0;
        transition: width 600ms ease;
        background-color: rgb(50, 43, 63);
    }

    #navbar:hover {
        width: 14rem;
    }

    #navbar:hover .nav-text {
        display: inline;
    }

    #navbar span {
        color: rgb(212, 212, 212);
    }

    #navbar-nav {
        display: flex;
        flex-direction: column;
        list-style: none;
        padding: 0;
        margin: 0;
        height: 100%;
    }

    .nav-item {
        width: 100%;
    }

    .nav-link {
        display: flex;
        height: 5rem;
        align-items: center;
    }

    .nav-item svg {
        width: 2rem;
        min-width: 2rem;
        margin: 0 1.5rem;
        color: rgb(177, 177, 177);
    }

    .nav-text {
        display: none;
    }

    #user-name-input {
        border: none;
        outline: none;
        border-radius: 5px;
        padding: 5px;
        width: 5rem;
    }

    #chat-box-wrapper{
        grid-area: chatmn;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background-color: var(--chat-1);
    }
    
    #chat-wrapper {
        margin-top: 10px;
        margin-left: 7rem;
        width: 100%;
    }

    #chat-container {
        display: grid;
        grid-template-columns: 1fr 4fr 1fr;
        grid-template-rows: 6rem 1fr;
        grid-template-areas:
            "roomhd chathd usershd"
            "roommn chatmn usersmn";
        height: 99%;
        border: 1px solid black;
        border-bottom-left-radius: 15px;
        border-top-left-radius: 15px;
    }

    .section-header {
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(128, 128, 128, 0.226);
    }

    .section-header h5 {
        margin-left: 1rem;
        font-size: 1.3rem;
        text-transform: uppercase;
        font-weight: 600;
    }

    .section-header-room-list {
        background-color: var(--chat-2);
        border-top-left-radius: 15px;
        grid-area: roomhd;
    }

    .section-header-room-name {
        grid-area: chathd;
        background-color: var(--chat-1);
    }

    .section-header-user-list {
        grid-area: usershd;
        background-color: var(--chat-2);
    }

    #room-list-wrapper ul {
        margin: 0;
        padding-left: 2rem;
        list-style-type: none;
        cursor: pointer;
        margin-top: 10px;
    }

    #user-list-wrapper ul {
        margin: 0;
        padding-left: 2rem;
        list-style-type: none;
        cursor: pointer;
        margin-top: 10px;
    }

    #room-list-wrapper{
        grid-area: roommn;
        background-color: var(--chat-2);
    }

    #room-content {
        display: flex;
        height: 100%;
    }

    chat-box {
        float: left;
    }

    #user-list-wrapper {
        grid-area: usersmn;
        background-color: var(--chat-2);
    }

    .user-name {
        cursor: pointer;
    }

    .user-name:hover {
        color: cornflowerblue;
    }
    
    .active {
        color: cornflowerblue;
    }

    #message-input-wrapper {
        padding: 20px;
    }

    .message-input {
        border: 1px solid transparent;
        border-radius: 10px;
        outline: none;
        padding: .5rem 1rem;
        font-size: 25px;
        width: 100%;
        box-sizing: border-box;
        background-color: lightgray;
        transition: all .2s ease-in-out;
    }

    .message-input:focus {
        border: 1px solid purple;
        box-sizing: border-box;
        background-color: black;
        color: white;
    }
</style>