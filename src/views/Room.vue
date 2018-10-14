<template>
    <div class="home">
        <div class="container-fluid my-5">
            <div class="row justify-content-center mb-5">
                <div class="col-8 text-left">
                    <h2>Welcome to {{ room }}</h2>
                    <h5>Room is currently playing: {{ video_id }}</h5>
                </div>
            </div>
            <div class="row">
                <div class="col-8">
                    <div id="player-window">
                        <vue-plyr ref="player">
                            <div data-plyr-provider="youtube" :data-plyr-embed-id="video_id"></div>
                        </vue-plyr>
                    </div>
                    <div class="row">
                        <div class="col-6">

                            <button @click.prevent="play" class="btn btn-primary">Play</button>
                            <button @click.prevent="pause" class="btn btn-primary">Pause</button>
                        </div>
                        <div class="col-6">
                            <form action="" class="form-inline w-100">
                                <div class="form-group">
                                    <input type="text" class="form-control" v-model="search_video_id">
                                    <button @click.prevent="switchVideo" class="btn btn-primary">Switch
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="card h-100">
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
    import VuePlayer from 'vue-plyr'

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
                chat_message: '',
                search_video_id: ''
            }
        },
        created: function () {
            this.setup();
        },
        watch: {
            '$route': 'setup'
        },
        mounted() {
            this.player = this.$refs.player.player;
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
                    this.player.pause()
                });

                window.$socket.on('play video', () => {
                    console.log('play vid', this.player);
                    this.player.play();
                });

                window.$socket.on('chat message', (message) => {
                    console.log('got message', message)
                    this.chat.push(message);
                });

                window.$socket.on('switch video', (videoId) => {
                    this.player.source = {
                        type: 'video',
                        sources: [
                            {
                                src: videoId,
                                provider: 'youtube',
                            },
                        ],
                    };
                });
            },
            play() {
                window.$socket.emit('play video');
                this.player.play();
            },
            pause() {
                window.$socket.emit('pause video');
                this.player.pause();
            },
            getPlayerState() {
                if (window.$player !== null)
                    return window.$player.getPlayerState()

                return '-2';
            },
            switchVideo() {
                let vid1 = 'https://www.youtube.com/watch?v=Vpw7DZAjFOQ';
                let vid2 = 'https://www.youtube.com/watch?v=IdlKt3SWck8';
                let vid = this.search_video_id;

                this.player.source = {
                    type: 'video',
                    sources: [
                        {
                            src: this.search_video_id,
                            provider: 'youtube',
                        },
                    ],
                };

                window.$socket.emit('switch video', this.search_video_id);

                this.search_video_id = '';
            },
        }
    }
</script>
