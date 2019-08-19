<template>
  <div class="ll-dict-crx-content-explains">
    <!-- 基本释义 -->
    <div v-for="(item, index) in explains" :key="index">
      <div>{{ item }}</div>
    </div>
    <!-- 网络释义 -->
    <div>网络释义</div>
    <div v-for="(item, index) in webExplains" :key="index+'web'">
      <div>{{ item.key }} : {{ item.value ? item.value.join(",") : null }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    explains: {
      type: Array,
      default: () => []
    },
    webExplains: {
      type: Array,
      default: () => []
    }
  }
};
</script>