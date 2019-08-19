<template>
  <configPanel />
</template>

<script>
import configPanel from "./components/configPanel";

export default {
  name: "app",
  components: {
    configPanel
  }
};
</script>

<style lang="less">
body {
  height: 250px;
  background: #ffffdd; 
}
</style>
