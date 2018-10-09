<template>
    <div class="home">
        A new room
    </div>
</template>

<script>

    export default {
        name: 'Room',
        created: function() {
            console.log(this.$root.$route.params);

            window.$socket.emit('join room', this.$root.$route.params);

            window.$socket.on('list users', (data) => {
                console.log("users", data);
            });

            window.$socket.on('room closed', () => {
                this.$root.$router.push('/')
            })
        }
    }
</script>
