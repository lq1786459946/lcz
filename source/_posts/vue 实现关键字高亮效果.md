---
title: vue 实现关键字高亮效果
date: 2024-011-29 14:23:50
tags: Vue
categories: Vue
---

## vue 实现关键字高亮效果

这是啥子意思呢，就是类似于百度搜索，根据关键词搜索结果，搜索结果中，与关键词相同的字显示红色，仅此而已，没有什么大的功能。简单写一下demo。

```html
<template>
  <div class="ed-con">
    <el-input v-model="input" style="width: 240px" placeholder="Please input"/>
    <p v-html="txt"></p>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const input = ref('');

const txt = ref('在古老的小镇边缘，有一间被岁月温柔抚摸过的木屋，它静静地伫立在一片绚烂的野花丛中。屋内，住着一位名叫苏婉的女子，她拥有一双能洞察人心的眼睛和一头如夜色般深邃的长发。每天黄昏，苏婉都会坐在窗边，手捧一本泛黄的书，眼神时而凝重，时而温柔，仿佛在与书中人物进行着跨越时空的对话。\n' +
    '\n' +
    '某天，一阵突如其来的风雨打破了小镇的宁静，也吹散了苏婉心中的平静。一位浑身湿透的青年男子闯入了她的世界，带着一身未解之谜。苏婉望着他，眼中闪过一抹不易察觉的光芒，她知道，自己的生活从此将不再平凡。两人在雨后的木屋里，围绕着炉火，开始编织起一段关于寻找、救赎与爱的故事，而窗外的世界，正悄悄地为这段奇遇添上一抹神秘的色彩。')

</script>

<style scoped lang="scss">
.ed-con {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;

  ::v-deep(.ed-highlight) {
    color: red;
  }
}
</style>


```

接下来就是怎么实现输入框输入数据之后，下面的文字中，与关键字相同的文字高亮成红色的，很简单，就一个方法：

```js
const highlightText = () => {
  if (!input.value) {
    return txt.value;
  }
  const regex = new RegExp(`(${input.value})`, 'gi');
  const highlightedText = txt.value.replace(regex, '<span class="ed-highlight">$1</span>');
  return highlightedText;
}

```

然后再调用一下这个方法就可以了：

```html
<p v-html="highlightText()"></p>
```

