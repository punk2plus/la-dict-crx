<template>
    <div class="main_app">
        <h1 @click="tab">这是点击插件弹出页面</h1>
    </div>
</template>

<script>
export default {
    name: 'app',
    methods: {
        tab() {
            chrome.tabs.create({ url: '/dictAdmin.html' })
        }
    }
}
</script>

<style>
.main_app {
    width: 300px;
    margin-top: 60px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
