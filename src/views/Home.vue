<template>
    <div class="home">
        <button @click="newRoom">Create a new room</button>
    </div>
</template>

<script>

    export default {
        name: 'home',
        methods: {
            newRoom: function () {
                window.$socket.emit('create room')
            }
        }
    }
</script>
