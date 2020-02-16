<template>
  <button @click="emitClick">OK</button>
</template>

<script>
import eventBus from './eventBus';

export default {
    name: "btn",
    data() {
        return {
            string: 'mega',
        }
    },
    methods: {
        emitClick() {
            this.$emit('increaseNumber');
        }
    }
}
</script>

<style>

</style>