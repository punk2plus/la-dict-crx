<template>
  <div v-if="isShow" class="ll-dict-crx-content">
    <DictPanel
      v-if="dictModel"
      :dictSetting="dictSetting"
      :dictModel="dictModel"
      @palyAudio="palyAudio"
      @addCustomerWordBook="addCustomerWordBook"
      @mouseenter.native="clearTimer"
      @mouseleave.native="startTimer"
    />
  </div>
</template>

<script>
import DictPanel from "../DictPanel";
import { dictSetting } from "config/dict";
import dictObj from "../../utils/dictObj";

export default {
  components: {
    DictPanel
  },
  data() {
    return {
      showTable: false,
      dictSetting: null,
      isShow: false,
      dictModel: null
    };
  },
  created() {
    this.initStorage();
    this.initMouseup();
    this.listernerKeydown();
  },
  methods: {
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      } 
    },
    startTimer() {
      if (!this.dictSetting) return;
      const duration = this.dictSetting.showDuration;
      if (duration > 0) {
        this.timer = setTimeout(() => {
          this.isShow = false;
        }, duration * 1000 || 3000);
      }
    },
    initStorage() {
      window.chrome.storage.sync.get(null, items => {
        console.log(items);
        this.dictSetting = items;
      });
      window.chrome.storage.onChanged.addListener(changes => {
        Object.keys(changes).forEach(function(key) {
          this.dictSetting[key] = changes[key].newValue;
        });
      });
    },
    initMouseup() {
      const self = this;
      document.documentElement.addEventListener("mouseup", event => {
        // if (!this.dictSetting.enbale) return;

        // debugger
        if (event.type === "selectstart") return;
        // 获取选中内容
        const selection = window.getSelection && window.getSelection();
        // 过来为空的情况
        if (!selection && selection.rangeCount === 0) return;
        const selectText = selection.toString().trim();
        if (!selectText) return;

        if (selectText === this.queryWord) {
          return;
        }

        if (!this.dictSetting) return;

        window.chrome.runtime.sendMessage(
          {
            type: "selectText",
            result: {
              queryWord: selectText
            }
          },
          result => {
            this.handleQueryWordResult(result);
            this.startTimer();
            this.isShow = true;
          }
        );
      });
    },
    handleQueryWordResult(result) {
      const str = JSON.stringify(dictObj);
      const dictModel = JSON.parse(str);
      // 查询词
      dictModel.query = result.query;
      // 中文
      dictModel.translation = result.translation[0];
      // 网络解释
      dictModel.webExplains = result.web;
      // 基本解释
      if (result.basic) {
        dictModel.ukPhonetic = result.basic["uk-phonetic"];
        dictModel.usPhonetic = result.basic["us-phonetic"];
        dictModel.explains = result.basic.explains;
      }
      this.dictModel = dictModel;
    },
    listernerKeydown() {
      document.documentElement.addEventListener("keydown", event => {
        const S_KEYCODE = 83;
        const D_KEYCODE = 68;
        const C_KEYCODE = 67;
        const V_KEYCODE = 86;
        const X_KEYCODE = 88;
        const B_KEYCODE = 66;
        if (event.keyCode === S_KEYCODE && event.altKey) {
          return this.toast("unable");
        }
        if (event.keyCode === D_KEYCODE && event.altKey) {
          return this.toast("enable");
        }
        if (event.keyCode === C_KEYCODE && event.altKey) {
          // save
          return this.addWordBook();
        }
        if (event.keyCode === V_KEYCODE && event.altKey) {
          return this.palyAudio();
        }
        // if (event.keyCode === B_KEYCODE && event.altKey) {
        //   return this.setState({
        //     showInput: !this.state.showInput,
        //     inputWordEn: this.state.queryWord
        //   });
        // }

        // if (event.keyCode === X_KEYCODE && event.altKey) {
        //   // 保存自定义输入
        //   this.addCustomerWordBook();
        //   return false;
        // }
      });
    },
    palyAudio() {
      chrome.runtime.sendMessage({
        type: "playAudio",
        result: {
          queryWord: this.queryWord
        }
      });
    },
    toast(text) {
      this.$toasted.show(text, {
        position: "top-left",
        theme: "outline",
        duration: 3000
      });
    },
    addWordBook() {
      chrome.runtime.sendMessage(
        {
          type: "addWordBook",
          result: {
            queryResult: this.queryResult
          }
        },
        text => {
          this.toast(text);
        }
      );
    },
    addCustomerWordBook(result) {
      const { inputWordEn, inputWordCn } = result;
      if (!inputWordCn) {
        return;
      }
      const queryResult = {
        en: inputWordEn,
        cn: inputWordCn
      };
      chrome.runtime.sendMessage(
        {
          type: "addCustomerWordBook",
          result: {
            queryResult
          }
        },
        text => {
          // this.setState({
          //   tip: text
          // });
          this.toast("自定义输入保存成功");

          // setTimeout(() => {
          //   this.setState({
          //     showInput: false,
          //     inputWordEn: "",
          //     inputWordCn: ""
          //   });
          // }, 5000);
        }
      );
    }
  }
};
</script>

<style lang="less">
.ll-dict-crx-content {
  font-size: 12px;
}
</style>