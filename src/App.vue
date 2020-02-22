<template>
    <div id="main-container">
        <div id="room-list-container" v-if="user.selectedRoom == ''">
            <input type="text" placeholder="username" id="" v-model.lazy="user.name">
            <h1>room list</h1>
            <ul>
                <li v-for="room in rooms" :key="room.id" @click="joinRoom(room)">
                    <span>{{room}}</span>
                </li>
            </ul>
        </div>
        <div id="chat-wrapper" v-if="user.selectedRoom !== ''">
            <div id="room-header">
                <h1>{{user.selectedRoom}}</h1>
                <button id="button-leave-room" @click="leaveRoom">x</button>
            </div>
            <div id="room-content">
                <div id="chat-box-wrapper">
                    <chat-box :messages="messages" @message="sendMessage"></chat-box>
                </div>
                <div id="user-list-wrapper">
                    <h2>users</h2>
                    <ul>
                        <li v-for="user in currentRoomUsers">
                            <span>{{user.name}}</span>
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
    
    const client = socketIOClient('http://192.168.1.65:8080');

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
                client.emit('join-room', {name: this.user.name, selectedRoom: roomName});
            },
            leaveRoom() {
                this.user.selectedRoom = '';
                client.emit('leave-room');
            },
            sendMessage(msg) {
                client.emit('message', msg);
            }
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
                console.log(this.messages);
            });

            client.on('disconnected', () => {
                this.user.selectedRoom = '';
                console.log('disconnected');
            });

            client.on('room-users', obj => {
                this.currentRoomUsers = obj;
            });

            client.on('message', msg => {
                this.messages.push(msg);
            });
        }
    }
</script>

<style scoped>
    #main-container {
        width: 1200px;
        margin: 0 auto;
        padding-top: 100px;
    }

    #room-header {
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

    #button-leave-room:hover {
        background-color: rgb(199, 39, 39);
        box-shadow: 0px 0px 8px 1px floralwhite;
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
    }

    chat-box {
        float: left;
    }

    #user-list-wrapper {
        width: 100%;
        padding-left: 50px;
    }

    #user-list-wrapper ul {
        padding: 0;
        list-style: none;
    }
    
</style>