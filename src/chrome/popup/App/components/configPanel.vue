<template>
  <div v-if="dictSetting" class="ll-dict-crx-popup-panel">
    <div class="ll-dict-crx-popup-panel__header">Setting</div>
    <a-form>
      <a-form-item label="开关" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
        <a-radio-group v-model="dictSetting.enable" :options="switchOptions" />
      </a-form-item>
      <a-form-item label="划词发音" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
        <a-radio-group :options="switchOptions" v-model="dictSetting.autoAudio" />
      </a-form-item>
      <a-form-item label="隐藏翻译结果" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
        <a-radio-group :options="switchOptions" v-model="dictSetting.autoHide" />
      </a-form-item>
      <a-form-item label="划词默认发音" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
        <a-radio-group :options="pronunciationOptions" v-model="dictSetting.defaultVoice" />
      </a-form-item>
      <a-form-item label="持续时间" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
        <a-input size="small" v-model="dictSetting.showDuration" />
      </a-form-item>
    </a-form>
    <div class="ll-dict-crx-popup-panel__footer">
      <a-button shape="circle" icon="save" @click="saveSetting" />
      <a-button shape="circle" type="primary" icon="link" @click="tab" />
    </div>
  </div>
</template>

<script>
const switchOptions = [
  { label: "开", value: true },
  { label: "关", value: false }
];
const pronunciationOptions = [
  { label: "英 ", value: 1 },
  { label: "美", value: 2 }
];

export default {
  data() {
    return {
      dictSetting: null,
      switchOptions,
      pronunciationOptions
    };
  },
  created() {
    this.initStorage();
  },
  methods: {
    initStorage() {
      window.chrome.storage.sync.get(null, items => {
        this.dictSetting = items;
      });
      window.chrome.storage.onChanged.addListener(changes => {
        Object.keys(changes).forEach(function(key) {
          this.dictSetting[key] = changes[key].newValue;
        });
      });
    },
    tab() {
      chrome.tabs.create({ url: "/options.html" });
    },
    saveSetting() {
      const dictSetting = this.dictSetting;
      window.chrome.storage.sync.set(dictSetting);
      this.$message.info("保存成功");
    }
  }
};
</script>

<style lang="less">
.ll-dict-crx-popup-panel {
  width: 300px;
  margin-top: 10px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 10px 15px;

  &__footer {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
  }

  &__header {
    text-align: center;
    font-weight: bold;
    margin-bottom: 10px;
  }

  /* 覆盖ant-design样式 */
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
      line-height: 32px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      width: 100px;
    }
    .ant-form-item-control-wrapper {
      display: inline-block;
      width: 120px;
    }
    .ant-form-item-control {
      line-height: 32px;
    }
  }
}
</style>
