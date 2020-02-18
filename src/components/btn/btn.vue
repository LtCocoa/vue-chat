<template>
  <button @click="click">OK</button>
</template>

<script>
    export default {
        name: "btn",
        data() {
            return {
                string: '',
            }
        },
        methods: {
            click() {
                this.$emit('click');
            }
        }
    }
</script>

<style>

</style>