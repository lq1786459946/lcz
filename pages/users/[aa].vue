<template>
  <div>
    <h1>关于我</h1>
    <div>{{ router.params.aa }}</div>
  </div>
</template>
<script setup>
const router = useRoute();
console.log(router.params.aa);
onMounted(() => {
  console.log(router.params.aa);
});
</script>

<style lang="scss" scoped></style>
