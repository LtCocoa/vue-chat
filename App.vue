<template>
    <div>
        <p>{{ number }}</p>
        <btn @increaseNumber="onIncreaseNumber"/>
    </div>
</template>

<script>
    import eventBus from './eventBus';
    import btn from './btn';


    export default {
        name: "App",
        data: function() {
            return {
                number: 0
            }
        },
        methods: {
            onIncreaseNumber() {
                eventBus.$emit('increaseNumber');
            },
            updateValue(newValue) {
                this.number = newValue;
            }
        },
        components: {
            btn
        },
        mounted() {
            eventBus.$on('pushNumber', (value) => {
                this.updateValue(value);
            });
        }
    }
</script>