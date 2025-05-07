<template>
  <NuxtLayout name="auth">
    <button @click="increment">增加计数器</button>
  </NuxtLayout>
</template>

<script setup>
import { useState } from "#app";
// definePageMeta({
//   layout: "auth",
// });
const config = useRuntimeConfig();
console.log(config.isServer1, "config.isServer1");

const authTokenCookie = useCookie("authToken");

const counter = useState("counter", () => 0);

const increment = () => {
  console.log(config, "asdasdasdasd");
};
</script>
