<template>
  <div>
    <!-- {{ name }}
    <el-button>123</el-button> -->
    <header>头部</header>
    <NuxtLoadingIndicator :height="10" />
    <NuxtPage></NuxtPage>
    <!-- <main><router-view></router-view></main> -->
    <ul>
      <li><NuxtLink to="/user">用户</NuxtLink></li>
      <li><NuxtLink to="/about">关于</NuxtLink></li>
    </ul>
    <footer>尾部</footer>
  </div>
</template>
<script setup>
// getApi()
// const config = useRuntimeConfig();
// const name = ref("123");
// console.log(222);
// if (config.isServer1) {
//   console.log("server");
// } else {
//   console.log("client");
// }
</script>
