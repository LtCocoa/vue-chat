<template>
  <v-dialog :value="value" width="500" @input="$emit('input')">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        <v-tabs>
          <v-tab @click="handleTabClick('login')">Log In</v-tab>
          <v-tab @click="handleTabClick('register')">Register</v-tab>
        </v-tabs>
      </v-card-title>

      <v-card-text>
        <v-text-field clearable placeholder="Username" v-model="username"></v-text-field>
        <v-text-field
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          placeholder="Password"
          v-model.lazy="password"
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click.native="$emit('input')">Close</v-btn>
        <v-btn color="primary" outlined @click.native="handleClick">{{tab}}</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout">
      {{ snackbarText }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-dialog>
</template>

<script>
export default {
  name: "LogIn",
  props: ["value"],
  data() {
    return {
      dialog: false,
      tab: "login",
      showPassword: false,
      username: "",
      password: "",
      snackbar: false,
      snackbarText: "",
      snackbarTimeout: 2000
    };
  },
  components: {},
  methods: {
    logIn() {
      if (!this.checkForm()) {
        return;
      }

      this.axios
        .post("http://localhost:8080/login", {
          name: this.username,
          password: this.password
        })
        .then(response => {
          if (response.data.result === "error") {
            this.showSnackbar(response.data.message);
          } else {
            localStorage.setItem("auth-token", response.headers["auth-token"]);
            this.$emit("handle-login", response.data.name);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    register() {
      if (!this.checkForm()) {
        return;
      }

      this.axios
        .post("http://localhost:8080/register", {
          name: this.username,
          password: this.password
        })
        .then(response => {
          if (response.data.result === "ok") {
            this.logIn();
          } else {
            this.showSnackbar(response.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleClick() {
      if (this.tab === "login") {
        this.logIn();
      } else {
        this.register();
      }
    },
    handleTabClick(tabName) {
      this.username = "";
      this.password = "";
      this.tab = tabName;
    },
    showSnackbar(message) {
      this.snackbar = true;
      this.snackbarText = message;
    },
    checkForm() {
      if (this.username.length < 2 || this.username.length > 15) {
        this.showSnackbar("Username should be 2-15 characters long");
        return false;
      }
      if (this.password.length < 6 || this.password.length > 15) {
        this.showSnackbar("Password should be 6-15 characters long");
        return false;
      }

      return true;
    }
  },
  mounted() {
    if (localStorage["auth-token"]) {
      this.axios
        .get("http://localhost:8080/auth", {
          headers: {
            "auth-token": localStorage["auth-token"]
          }
        })
        .then(response => {
          this.$emit("handle-login", response.data);
        });
    }
  }
};
</script>
