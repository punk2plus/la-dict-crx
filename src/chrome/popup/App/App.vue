<template>
  <!-- <div class="main_app"> -->
  <div v-if="dictSetting" class="main_app">
    <div class="main_app--header">属性设置</div>
    <a-form>
      <a-form-item label="开关" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
        <a-radio-group v-model="dictSetting.enable" :options="plainOptions" />
      </a-form-item>
      <a-form-item label="划词发音" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
        <a-radio-group :options="plainOptions" v-model="dictSetting.autoAudio" />
      </a-form-item>
      <a-form-item label="隐藏翻译结果" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
        <a-radio-group :options="plainOptions" v-model="dictSetting.autoHide" />
      </a-form-item>
      <a-form-item label="划词默认发音" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
        <a-radio-group :options="plain1Options" v-model="dictSetting.defaultVoice"  />
      </a-form-item>
      <a-form-item label="持续时间" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
        <a-input size="small" v-model="dictSetting.showDuration"/>
      </a-form-item>
      <a-form-item>
        <a-button @click="saveSetting">保存</a-button>
        <a-button @click="tab">单词表</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { debuglog } from 'util';
const plainOptions = [{ label: '开', value: true },  { label: '关', value: false }];


const plain1Options = [{ label: '英 ', value: 1 },  {label: '美', value: 2 }];

export default {
  name: "app",
  data() {
    return {
      radioStyle: {
        height: "14px",
        lineHeight: "14px"
      },
      plainOptions,
      plain1Options,
      dictSetting: null,
    };
  },
  created() {
    this.initStorage();
  },
  methods: {
    tab() {
      chrome.tabs.create({ url: "/dictAdmin.html" });
    },
    initStorage() {
      window.chrome.storage.sync.get(null, (items)=> {
        this.dictSetting = items;
      });
      window.chrome.storage.onChanged.addListener((changes) => {
        Object.keys(changes).forEach(function(key){
          this.dictSetting[key] =  changes[key].newValue;
        });
      });
    },
    saveSetting() {
      const dictSetting = this.dictSetting;
      window.chrome.storage.sync.set(dictSetting);
      this.$message.info('保存成功');
    }
  },
};
</script>

<style>
body {
  height: 250px;
}

.main_app {
  width: 300px;
  margin-top: 10px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 10px;
}

.main_app--header {
  text-align: left;
}

.ant-radio-group {
  width: 350px;
  text-align: left;
}

.ant-form-item {
  margin-bottom: 0px;
}

@media (max-width: 575px) {
  .ant-form-item-label {
    text-align: left;
    vertical-align: middle;
    line-height: 25px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    width: 75px;
  }
  .ant-form-item-control-wrapper {
    display: inline-block;
    width: 120px;
  }
}
</style>
