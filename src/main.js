import Vue from 'vue'
import App from './App.vue'
import router from './router'
import io from 'socket.io-client'

Vue.config.productionTip = false;

window.$socket = io(process.env.VUE_APP_SOCKET_URL, {
    path: process.env.VUE_APP_SOCKET_PATH
});

window.$player = null;

window.$socket.on('connection', (socket) => {
    console.log(socket, 'connected');
});

window.$socket.on('room created', (room) => {
    console.log('Room created', room);
    router.push({
        name: 'room',
        params: {
            room: room.name
        }
    })

});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
