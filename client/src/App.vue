<template>
  <v-app style="height: 100%; overflow:auto;">
    <div id="main-wrapper">
      <div id="main-container">
        <room-list v-model="showRoomList" v-bind:rooms="rooms" @roomSelected="joinRoom"></room-list>
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
                  />
                </svg>
                <span class="nav-text">{{user.name}}</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" @click="showRoomList = true">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="comments"
                  class="svg-inline--fa fa-comments fa-w-18"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path
                    fill="currentColor"
                    d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z"
                  />
                </svg>
                <span class="nav-text">Rooms</span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link" @click="loginClick">
                <svg
                  v-if="user.isLoggedIn"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="door-open"
                  class="svg-inline--fa fa-door-open fa-w-20"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path
                    fill="currentColor"
                    d="M624 448h-80V113.45C544 86.19 522.47 64 496 64H384v64h96v384h144c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM312.24 1.01l-192 49.74C105.99 54.44 96 67.7 96 82.92V448H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h336V33.18c0-21.58-19.56-37.41-39.76-32.17zM264 288c-13.25 0-24-14.33-24-32s10.75-32 24-32 24 14.33 24 32-10.75 32-24 32z"
                  />
                </svg>
                <svg
                  v-if="!user.isLoggedIn"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="key"
                  class="svg-inline--fa fa-key fa-w-16"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z"
                  />
                </svg>
                <span class="nav-text">{{user.isLoggedIn ? "Log Out" : "Log In"}}</span>
                <log-in v-model="dialog" @handle-login="handleLogin"></log-in>
              </a>
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
              <ul class="room-list">
                <li
                  v-for="room in rooms"
                  :key="room.id"
                  @click="joinRoom(room)"
                  class="room-list-item"
                  :class="{active: room === user.selectedRoom}"
                >
                  <span>{{room}}</span>
                </li>
              </ul>
            </div>
            <div id="chat-box-wrapper">
              <chat-box :messages="messages"></chat-box>
              <div id="message-input-wrapper">
                <v-textarea
                  append-icon="mdi-comment-text-outline"
                  class="message-input"
                  placeholder="your message"
                  rows="2"
                  no-resize
                  auto-grow
                  v-model="newMessage"
                  @keyup.enter="sendMessage"
                  v-if="user.selectedRoom.length > 0"
                  solo
                  hide-details
                ></v-textarea>
              </div>
            </div>
            <div id="user-list-wrapper">
              <ul>
                <li v-for="(user, index) in currentRoomUsers" :key="index">
                  <span>{{user.name}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import socketIOClient from "socket.io-client";
import ChatBox from "./components/ChatBox";
import LogInButton from "./components/LogIn";
import RoomList from "./components/RoomList";

const client = socketIOClient("http://localhost:8080");

export default {
  name: "App",
  data() {
    return {
      user: {
        name: "anonymous",
        selectedRoom: "",
        isLoggedIn: false
      },
      newMessage: "",
      rooms: [],
      currentRoomUsers: [],
      messages: [],
      dialog: false,
      showRoomList: false
    };
  },
  computed: {},
  methods: {
    joinRoom(roomName) {
      if (this.user.name == "") {
        return;
      }
      if (roomName !== this.user.selectedRoom) {
        this.leaveRoom();
        client.emit("join-room", {
          name: this.user.name,
          selectedRoom: roomName
        });
      }
      this.showRoomList = false;
    },
    leaveRoom() {
      this.user.selectedRoom = "";
      client.emit("leave-room");
    },
    sendMessage(e) {
      e.preventDefault();
      if (this.user.selectedRoom.length > 0 && this.newMessage.length > 0) {
        client.emit("message", this.newMessage.trim());
        this.newMessage = "";
      }
    },
    changeUsername() {
      client.emit("change-username", this.user.name);
    },
    handleLogin(name) {
      this.user.name = name;
      this.dialog = false;
      this.user.isLoggedIn = true;
      this.changeUsername();
    },
    loginClick() {
      if (this.user.isLoggedIn) {
        this.user.isLoggedIn = false;
        this.user.name = "anonymous";
        this.changeUsername();
        localStorage.removeItem("auth-token");
      } else {
        this.dialog = true;
      }
    }
  },
  components: {
    "chat-box": ChatBox,
    "log-in": LogInButton,
    "room-list": RoomList
  },
  mounted() {
    client.on("room-list", data => {
      this.rooms = data;
    });

    client.on("connected", obj => {
      if (obj.result) {
        this.user.selectedRoom = obj.name;
        this.messages = obj.messages;
      }
    });

    client.on("disconnected", () => {
      this.user.selectedRoom = "";
      console.log("disconnected");
    });

    client.on("room-users", obj => {
      this.currentRoomUsers = obj;
    });

    client.on("message", msg => {
      this.messages.push(msg);
    });
  },
  created() {
    this.joinRoom("room 1");
  }
};
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

#navbar {
  position: fixed;
  display: block;
  transition: width 600ms ease;
  background-color: rgb(50, 43, 63);
}

#navbar span {
  color: rgb(212, 212, 212);
}

#navbar-nav {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
}

.nav-item {
  width: 100%;
}

.nav-item:last-child {
  margin-top: auto;
}

.nav-link {
  display: flex;
  height: 5rem;
  align-items: center;
  transition: 0.3s;
}

.nav-link:hover {
  background-color: rgb(38, 33, 48);
}

.nav-item svg {
  width: 2rem;
  min-width: 2rem;
  margin: 0 1.5rem;
  color: rgb(177, 177, 177);
}

.nav-text {
  opacity: 0;
  left: -999px;
  position: absolute;
  text-decoration: none;
  transition: opacity 0.5s ease-in-out;
  white-space: nowrap;
}

#chat-box-wrapper {
  grid-area: chatmn;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--chat-1);
}

#chat-wrapper {
  margin-top: 10px;
  width: 100%;
}

#chat-container {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-rows: 4rem 1fr;
  grid-template-areas:
    "roomhd chathd usershd"
    "roommn chatmn usersmn";
  height: 100%;
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
  background-color: var(--chat-2);
  border-top-right-radius: 15px;
  grid-area: usershd;
}

.room-list {
  margin: 0;
  padding: 0 0.5rem;
  list-style-type: none;
  cursor: pointer;
  margin-top: 10px;
  font-size: 1.2rem;
}

.room-list-item {
  border-radius: 5px;
  padding: 0.2rem 1rem;
  margin-bottom: 3px;
}

.active {
  color: black;
  background-color: rgb(161, 161, 161);
}

.active:hover {
  color: black;
  background-color: rgb(161, 161, 161);
}

.room-list-item:hover {
  color: rgb(37, 37, 37);
  background-color: rgb(201, 201, 201);
}

#user-list-wrapper ul {
  margin: 0;
  padding: 0 0.5rem;
  list-style-type: none;
  cursor: pointer;
  margin-top: 10px;
  font-size: 1.2rem;
}

#user-list-wrapper li {
  border-radius: 5px;
  padding: 0 1rem;
}

#user-list-wrapper li:hover {
  color: rgb(37, 37, 37);
  background-color: rgb(201, 201, 201);
}

#room-list-wrapper {
  grid-area: roommn;
  background-color: var(--chat-2);
  border-bottom-left-radius: 15px;
}

#room-content {
  display: flex;
  height: 100%;
}

#user-list-wrapper {
  grid-area: usersmn;
  background-color: var(--chat-2);
  border-bottom-right-radius: 15px;
}

.message-input {
  font-size: 1.4rem;
}

@media only screen and (max-width: 768px) {
  .section-header-room-list,
  .section-header-user-list,
  #room-list-wrapper,
  #user-list-wrapper {
    display: none;
  }

  #chat-container {
    grid-template-areas:
      "chathd"
      "chatmn";
    grid-template-columns: 1fr;
    grid-template-rows: 3.5rem 1fr;
  }

  #navbar {
    bottom: 0;
    width: 100vw;
    height: 5rem;
  }

  #navbar-nav {
    flex-direction: row;
  }

  .nav-link {
    justify-content: center;
  }

  #chat-wrapper {
    margin-bottom: 5rem;
  }
}

@media only screen and (min-width: 768px) {
  #navbar {
    width: 5rem;
    height: 100%;
    top: 0;
  }

  #navbar:hover {
    width: 14rem;
  }

  #navbar:hover .nav-text {
    opacity: 1;
    left: 5rem;
  }

  #navbar-nav {
    flex-direction: column;
  }

  #chat-wrapper {
    width: 80%;
    margin: 20px auto;
  }

  #message-input-wrapper {
    padding: 20px;
  }

  .message-input .v-input__slot {
    max-height: 200px !important;
    overflow: auto !important;
  }
}
</style>