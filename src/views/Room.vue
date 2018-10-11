<template>
    <div class="home">
        <div class="container my-5">
            <div class="row">
                <div class="col-12 text-left">
                    <h2>Welcome to {{ room }}</h2>
                    <h5>Room is currently playing: {{ video_id }}</h5>
                </div>
            </div>
            <div class="row">
                <div class="col-6">


                    <div id="player-window">
                        <div id="player"></div>
                    </div>
                    <button @click.prevent="play" class="btn btn-primary">Play</button>
                    <button @click.prevent="pause" class="btn btn-primary">Pause</button>
                    <button @click.prevent="switchVideo('IdlKt3SWck8')" class="btn btn-primary">Switch</button>
                </div>
                <div class="col-6">
                    <div class="card">
                        <div class="card-body">
                            <div id="chat-window">
                                <ul class="list-unstyled">
                                    <li v-for="(msg, index) in chat" v-bind:key="index">
                                        <span class="author">{{ msg.from }}</span>
                                        <span class="message">{{ msg.message }}</span>
                                    </li>
                                </ul>
                            </div>

                            <div class="form-group">
                                <label for="message">What would you like to say?</label>
                                <input type="text" class="form-control" id="message" v-model="chat_message"
                                       @keyup.enter="sendChatMessage">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import YouTubePlayer from 'youtube-player'

    export default {
        name: 'Room',
        data: function () {
            return {
                room: this.$root.$route.params['room'],
                video_id: 'U9PPQvN25pc',
                video_state: null,
                available_states: {
                    '-1': 'unstarted',
                    0: 'ended',
                    1: 'playing',
                    2: 'paused',
                    3: 'buffering',
                    5: 'video cued'
                },
                readyToPlay: false,
                chat: [],
                chat_message: ''
            }
        },
        created: function () {
            this.setup();
        },
        watch: {
            '$route': 'setup'
        },
        methods: {
            sendChatMessage() {
                console.log('sending message ', this.chat_message)
                this.chat.push({
                    from: 'anon',
                    message: this.chat_message
                });
                window.$socket.emit('chat message', this.chat_message)
                this.chat_message = '';
            },

            setup() {

                console.log(this.$root.$route.params);

                window.$socket.emit('join room', this.$root.$route.params);

                window.$socket.on('room closed', () => {
                    this.$root.$router.push('/')
                });

                window.$socket.on('pause video', () => {
                    window.$player.pauseVideo()
                });

                window.$socket.on('play video', () => {
                    window.$player.playVideo();
                });

                window.$socket.on('chat message', (message) => {
                    console.log('got message', message)
                    this.chat.push(message);
                });

                window.$socket.on('switch video', (videoId) => {
                    window.$player.loadVideoById(videoId)
                })

                setTimeout(() => {
                    window.$player = new YouTubePlayer('player', {
                        height: '390',
                        width: '640',
                        videoId: this.video_id,
                        playerVars: {
                            'controls': 0,
                            'showinfo': 0,
                            'modestbranding': 1,
                            'playsinline': 1
                        },
                    });

                    window.$player.on('ready', (event) => {
                        this.readyToPlay = true;
                    })

                    window.$player.on('stateChange', (event) => {
                        this.video_state = event.data
                    });
                }, 1000)
            },
            play() {
                window.$socket.emit('play video');
                window.$player.playVideo();
                console.log('play video')
            },
            pause() {
                window.$socket.emit('pause video');
                window.$player.pauseVideo();
                console.log('pause video')
            },
            getPlayerState() {
                if(window.$player !== null)
                    return window.$player.getPlayerState()

                return '-2';
            },
            switchVideo(videoId) {
                let vid = videoId || 'IdlKt3SWck8';
                console.log('switching video', videoId)
                window.$player.loadVideoById(videoId);
                window.$socket.emit('switch video', videoId)
            },
            player() {
                if(window.$player)
                    return window.$player;
            }
        }
    }
</script>
