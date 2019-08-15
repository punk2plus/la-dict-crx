<template>
  <div class="ll-dict-ce">
    <DictPanel
      v-if="queryWord && queryResult"
      :queryResult="queryResult"
      :queryWord="queryWord"
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
      queryWord: ""
    };
  },
  created() {
    this.$toasted.show("hello billo", {
      position: "top-left",
      theme: "outline",
      duration: 3000
    });
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

      console.log("======>>>>", selectText);

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
          return this.setState({
            tip: "unable"
          });
        }
        if (event.keyCode === D_KEYCODE && event.altKey) {
          return this.setState({
            tip: "enable"
          });
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
    }
  }
};
</script>
