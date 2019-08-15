<template>
  <div class="ll-dict-crx-content">
    <!-- 查询header -->
    <div>{{ queryWord }}</div>
    <div class="ceVoiceContainer" @click="palyAudio" />
    <!-- 中文含义 -->
    <div v-if="queryResult && queryResult.translation">
      {{ queryResult.translation[0] }}
    </div>
    <!-- 音标 -->
    <div v-if="ukPhonetic">
      英<span>[{{ ukPhonetic }}]</span> 美<span>[{{ usPhonetic }}]</span>
    </div>
    <!-- 基本释义 -->
    <div v-if="explains">
      <div v-for="(item, index) in explains" :key="index">
        <div>{{ item }}</div>
      </div>
    </div>
    <!-- 网络释义 -->
    <div>网络释义</div>
    <div v-for="(item, index) in web" :key="index">
      <div>{{ item.key }} : {{ item.value ? item.value.join(",") : null }}</div>
    </div>
    <!-- 自定义输入框 -->
    <div>
      <div class="ll-dict-input"><el-input v-model="inputWordEn" size="mini" type="text" /></div>
      <div class="ll-dict-input"><el-input v-model="inputWordCn" size="mini" type="text" /></div>
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
      web: "",
      inputWordEn: '', 
      inputWordCn: ''
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
  methods: {
    palyAudio() {
      this.$emit('palyAudio')
    }
  }
};
</script>

<style>
.ll-dict-crx-content {
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


.ceVoiceContainer {
  float: right;
  width: 16px;
  height: 16px;
  margin-right: 12px;
  opacity: 0.5;
  cursor: pointer;
  vertical-align: text-bottom;
  background-image: url("data:image/png;base64,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");
  background-position: bottom center;
  background-size: 16px 16px;
  background-repeat: no-repeat;
}

.ceVoiceContainer:hover {
  opacity: 1;
}


.ceBtn {
  float: right;
  width: 16px;
  height: 16px;
  margin-right: 12px;
  opacity: 0.5;
  cursor: pointer;
  vertical-align: text-bottom;
  background-image: url("data:image/png;base64,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");
  background-position: bottom center;
  background-size: 16px 16px;
  background-repeat: no-repeat;
  border: 0px;
}

</style>
