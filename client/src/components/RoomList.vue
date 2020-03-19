<template>
  <v-dialog :value="value" :rooms="rooms" width="300" @input="$emit('input')">
    <v-card>
      <v-list>
        <v-subheader>ROOMS</v-subheader>
        <v-list-item v-for="room in rooms" :key="room" @click="select(room)">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="room"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "UserList",
  props: {
    value: Boolean,
    rooms: Array
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    select(room) {
      this.$emit("roomSelected", room);
    }
  }
};
</script>

<style>
.v-subheader {
  font-size: 1.1rem !important;
}

.v-list-item__title {
  font-size: 1.1rem !important;
}
</style>