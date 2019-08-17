<template>
  <div class="main_app">
    <h1 @click="tab">这是点击插件弹出页面</h1>
     <a-button type="primary">下一步</a-button>
    <div>
      开关：
      <input type="radio" id="huey" name="drone" value="huey" checked />
      <label for="huey">开</label>
      <input type="radio" id="huey" name="drone" value="huey" />
      <label for="huey">关</label>
    </div>
    <div>
      划词自动发音
      <input type="radio" id="huey" name="drone" value="huey" checked />
      <label for="huey">开</label>
      <input type="radio" id="huey" name="drone" value="huey" />
      <label for="huey">关</label>
    </div>
    <div>
      自动隐藏翻译结果
      <input type="radio" id="huey" name="drone" value="huey" checked />
      <label for="huey">开</label>
      <input type="radio" id="huey" name="drone" value="huey" />
      <label for="huey">关</label>
    </div>
    <div>
      划词默认发音
      <input type="radio" id="huey" name="drone" value="huey" checked />
      <label for="huey">美</label>
      <input type="radio" id="huey" name="drone" value="huey" />
      <label for="huey">英</label>
    </div>
    <div>
      翻译结果显示持续时间
      <input />
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      dictSeeting: null
    }
  },
  created() {
    this.initStorage()
  },
  methods: {
    tab() {
      chrome.tabs.create({ url: "/dictAdmin.html" });
    },
    initStorage() {
      window.chrome.storage.sync.get(null,function (items) {
        this.dictSeeting = items
      })
      window.chrome.storage.onChanged.addListener(function (changes) {
        this.dictSeeting = changes
      })
    }
  }
};
</script>

<style>
.main_app {
  width: 300px;
  margin-top: 60px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
