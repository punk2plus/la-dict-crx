<template>
  <div class="ll-dict-crx">
    <DictPanel
    ref="dictPanel"
      v-if="queryWord && queryResult"
      :queryResult="queryResult"
      :queryWord="queryWord"
      @palyAudio="palyAudio"
    />
  </div>
</template>

<script>
import DictPanel from "../../components/DictPanel";

export default {
  name: "app",
  components: {
    DictPanel
  },
  data() {
    return {
      showTable: false,
      timer: null,
      queryResult: null,
      queryWord: "",
    };
  },
  created() {
    document.documentElement.addEventListener("mouseup", event => {
      if (event.type === "selectstart") return;
      // 获取选中内容
      const selection = window.getSelection && window.getSelection();
      // 过来为空的情况
      if (!selection && selection.rangeCount === 0) return;
      const selectText = selection.toString().trim();
      if (!selectText) return;

      if (this.timer) {
        return;
      }

      this.timer = setTimeout(() => {
        window.chrome.runtime.sendMessage(
          {
            type: "selectText",
            result: {
              queryWord: selectText
            }
          },
          data => {
            this.queryResult = data;
            this.queryWord = selectText;

            clearTimeout(this.timer);
            this.timer = null;
          }
        );
      }, 50);
    });
    this.listernerKeydown();
  },
  methods: {
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
        if (event.keyCode === B_KEYCODE && event.altKey) {
          return this.setState({
            showInput: !this.state.showInput,
            inputWordEn: this.state.queryWord
          });
        }

        if (event.keyCode === X_KEYCODE && event.altKey) {
          // 保存自定义输入
          this.addCustomerWordBook();
          return false;
        }
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
    addCustomerWordBook() {

      const inputWordEn = this.$refs.dictPanel.inputWordEn
      const inputWordCn = this.$refs.dictPanel.inputWordCn
  
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
          this.toast('自定义输入保存成功')

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
