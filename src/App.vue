<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="scss">
    @import "assets/scss/app";
</style>

<script>
    export default {
        name: 'App',
        created: () => {
            // let api_tag = document.createElement('script');
            // api_tag.src = 'https://youtube.com/iframe_api';
            //
            // let firstScriptTag = document.getElementsByTagName("script")[0];
            //
            // firstScriptTag.parentNode.insertBefore(api_tag, firstScriptTag);
        }
    }
</script>