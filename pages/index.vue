<!-- pages/index.vue -->
<template>
  <div>
    <NuxtLink to="/about">关于</NuxtLink>
    <NuxtLink to="/login">登录</NuxtLink>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

// if (config.isServer1) {
//   //跳转
//   const router = useRouter();
//   router.push("login");
// }
if (config.isServer1) {
  //跳转
  console.log(123);

  navigateTo("login");
}
</script>
