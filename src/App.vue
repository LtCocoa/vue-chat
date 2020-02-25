<template>
    <div id="main-container">
        <div id="user-info">
            <span>username:</span>
            <input type="text" placeholder="username" id="" v-model.lazy="user.name" @change="changeUsername" maxlength="10">
        </div>
        <div id="chat-container">
            <div id="room-list-container">
                <h1>room list</h1>
                <ul>
                    <li v-for="room in rooms" :key="room.id" @click="joinRoom(room)">
                        <span :class="{active: room === user.selectedRoom}">{{room}}</span>
                    </li>
                </ul>
                </div>
            <div id="chat-wrapper">
                <div id="room-header">
                    <h1>{{!user.selectedRoom ? 'room name': user.selectedRoom}}</h1>
                </div>
                <div id="room-content">
                    <div id="chat-box-wrapper">
                        <chat-box :messages="messages" @message="sendMessage"></chat-box>
                    </div>
                    <div id="user-list-wrapper">
                        <h2>users</h2>
                        <ul>
                            <li v-for="user in currentRoomUsers">
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
    
    const client = socketIOClient('http://localhost:8080');

    export default {
        name: "App",
        data() {
            return {
                user: {
                    name: 'anonymous',
                    selectedRoom: '',
                },
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
            sendMessage(msg) {
                if(this.user.selectedRoom != '') {
                    client.emit('message', msg);
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
    #main-container {
        max-width: 900px;
        margin: 5px auto 0px;
    }

    #user-info {
        width: 100%;
        padding: 20px 0;
    }

    #chat-container {
        display: block;
        height: 100%;
    }

    #room-header {
        display: flex;
    }

    #chat-wrapper{
        flex: 1;
        flex-flow: column;
        display: flex;
    }

    #button-leave-room {
        margin-left: 30px;
        font-size: 30px;
        width: 45px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: all .2s ease-in-out;
        outline: none;
    }

    #chat-box-wrapper{
        flex:1;
    }

    #button-leave-room:hover {
        background-color: rgb(199, 39, 39);
        box-shadow: 0px 0px 8px 1px floralwhite;
    }

    #room-list-container{
        width: 200px;
        float: left;
    }

    #room-list-container ul {
        list-style: none;
    }

    #room-list-container ul span {
        cursor: pointer;
    }

    #room-list-container ul span:hover {
        color: cornflowerblue;
    }

    #room-content {
        display: flex;
        height: 100%;
    }

    chat-box {
        float: left;
    }

    #user-list-wrapper {
        width: 100px;
        padding: 1rem;
    }

    #user-list-wrapper ul {
        padding: 0;
        list-style: none;
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
</style>