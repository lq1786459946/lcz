<template>
  <div>
    <input v-model="inputValue" placeholder="请输入内容" />
    <button @click="saveToLocalStorage">保存到 localStorage</button>
    <p>存储的值: {{ storedValue }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// 定义响应式数据
const inputValue = ref("");
const storedValue = ref("");

// 由于 localStorage 是浏览器特有的 API，需要在客户端挂载后操作
onMounted(() => {
  // 尝试从 localStorage 中读取数据
  const savedValue = localStorage.getItem("myData");
  if (savedValue) {
    storedValue.value = savedValue;
  }
});

// 保存数据到 localStorage 的方法
const saveToLocalStorage = () => {
  if (inputValue.value) {
    localStorage.setItem("myData", inputValue.value);
    storedValue.value = inputValue.value;
    inputValue.value = "";
  }
};
</script>
