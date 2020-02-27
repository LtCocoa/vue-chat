<template>
    <div id="main-wrapper">
        <div id="main-container">
            <div id="user-info-container">
                <span>username:</span>
                <input type="text" placeholder="username" id="user-name-input" v-model.lazy="user.name" @change="changeUsername" maxlength="10">
            </div>
            <div id="chat-wrapper">
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
                    <div>
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
                        <li v-for="user in currentRoomUsers">
                            <span class="user-name">{{user.name}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import socketIOClient from 'socket.io-client';
    import ChatBox from './components/ChatBox';
    
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
            whisperTo(userId) {
                
            },
        },
        components: {
            "chat-box": ChatBox,
        },
        mounted() {
            client.on('room-list', (data) => {
                this.rooms = data;
            });

            client.on('connected', obj => {
                if(obj.result) {
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

    #user-info-container {
        display: flex;
        flex-flow: column;
        padding: 20px;
    }

    #chat-box-wrapper{
        grid-area: chatmn;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background-color: rgb(236, 243, 248);
    }

    #chat-wrapper {
        display: grid;
        grid-template-columns: 1fr 4fr 1fr;
        grid-template-rows: 6rem 1fr;
        grid-template-areas:
            "roomhd chathd usershd"
            "roommn chatmn usersmn";
        width: 100vw;
        border: 1px solid black;
        margin-top: 10px;
        border-bottom-left-radius: 15px;
        border-top-left-radius: 15px;
    }

    .section-header {
        border-bottom: 1px solid rgba(128, 128, 128, 0.226);
    }

    .section-header h5 {
        margin-left: 1rem;
        font-size: 1.2rem;
        text-transform: uppercase;
        font-weight: 600;
    }

    .section-header-room-list {
        background-color: rgb(219, 228, 235);
        border-top-left-radius: 15px;
        grid-area: roomhd;
    }

    .section-header-room-name {
        grid-area: chathd;
        background-color: rgb(236, 243, 248);
    }

    .section-header-user-list {
        grid-area: usershd;
        background-color: rgb(219, 228, 235);
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
        background-color: rgb(219, 228, 235);
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
        background-color: rgb(219, 228, 235);
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

    #user-name-input {
        border: none;
        outline: none;
        border-radius: 5px;
        padding: 5px;
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