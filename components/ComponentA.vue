<template>
  <button @click="increment">增加计数器</button>
</template>

<script setup>
import { useState } from "#app";

const counter = useState("counter", () => 0);

const increment = () => {
  counter.value++;
};
</script>
