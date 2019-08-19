<template>
  <div v-if="isShow" class="ll-dict-content-footer">
    <div class="ll-dict-content-footer__title">自定义输入</div>
    <!-- 自定义输入框 -->
    <input class="ll-dict-content-footer__input" v-model="inputWordEn" />
    <input class="ll-dict-content-footer__input" v-model="inputWordCn" />
  </div>
</template>

<script>
export default {
  props: {
    query: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      inputWordEn: "",
      inputWordCn: "",
      isShow: false
    };
  },
  mounted() {
    this.listernerKeydown();
  },
  methods: {
    listernerKeydown() {
      document.documentElement.addEventListener("keydown", event => {
        const X_KEYCODE = 88;
        const B_KEYCODE = 66;
        if (event.keyCode === B_KEYCODE && event.altKey) {
          this.isShow = !this.isShow;
          this.inputWordEn = this.query
          return
        }

        if (event.keyCode === X_KEYCODE && event.altKey) {
          // 保存自定义输入
          this.$emit('addCustomerWordBook', {
            inputWordEn: this.inputWordEn,
            inputWordCn: this.inputWordCn
          })
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.ll-dict-content-footer {
  margin-top: 5px;
  border-top: 1px solid #eee;
  &__title {
    text-align: left;
    margin: 5px 0;
    font-weight: blod;
    color: #3d7e9a;
  }
  &__input {
    margin: 5px 0;
    width: 225px;
  }
}
</style>
