import Vue from "vue";
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'; 
import AppComponent from "./App/App.vue";
Vue.use(Antd)
Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});



