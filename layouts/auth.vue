<script setup>
const { data } = await useFetch("/api/hello");
let aabb = ref("");
const aa = async () => {
  const res = await useFetch("/api/hello");
  aabb.value = res.data;
  console.log(
    res.data.luckycolor,
    "qwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwd",
    aabb.value
  );
};
aa();
useHead({
  title: "ceshi",
  meta: [
    { name: "description", content: "ceshi" },
    { name: "keywords", content: "ceshi" },
  ],
});
</script>

<template>
  {{ aabb.value.data.type }}
</template>
