import Vue from "vue";
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'; 
import root from "./root.vue";
Vue.config.productionTip = false;
/* eslint-disable no-new */

Vue.use(Antd)

new Vue({
  el: "#app",
  render: h => h(root)
});
