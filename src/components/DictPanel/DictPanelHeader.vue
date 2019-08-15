<template>
  <div class="ll-dict-crx-content-header">
    <!-- 查询header -->
    <div>{{ queryWord }}</div>
    <!-- 中文含义 -->
    <div v-if="queryResult && queryResult.translation">
      {{ queryResult.translation[0] }}
    </div>
  </div>
</template>

<script>
export default {
  name: "DictPanel",
  props: {
    queryResult: {
      type: Object,
      default: null
    },
    queryWord: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      ukPhonetic: "",
      usPhonetic: "",
      explains: "",
      web: ""
    };
  },
  watch: {
    queryResult(val) {
      const { basic, web } = val;
      if (!basic) {
        return;
      }
      this.ukPhonetic = basic["uk-phonetic"];
      this.usPhonetic = basic["us-phonetic"];
      const explains = basic ? basic.explains : [];
      this.explains = explains;
      this.web = web;
    }
  },
  mounted() {
    if (!this.queryResult) return;
    const { basic, web } = this.queryResult;
    if (!basic) {
      return;
    }
    this.ukPhonetic = basic["uk-phonetic"];
    this.usPhonetic = basic["us-phonetic"];
    const explains = basic ? basic.explains : [];
    this.explains = explains;
    this.web = web;
  },
  methods: {}
};
</script>

<style>
.ll-dict-content {
  position: fixed;
  right: 10px;
  top: 80px;
  z-index: 99999;
  background: #ffffdd;
  width: 250px;
  border-color: #999999;
  border-image: initial;
  border-radius: 4px;
  text-decoration: none;
  border-width: 1px;
  border-style: solid;
  padding: 10px 10px 15px 10px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 20px;
  overflow: auto;
  font-size: 14px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 400;
  color: #222222;
  text-align: left;
  text-shadow: none;
  animation: 0.3s ease 0s 1 normal none running fade-in;
}

.ll-dict-input {
  margin: 10px 0;
}
</style>
