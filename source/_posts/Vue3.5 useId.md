---
title: Vue3.5 useId
date: 2024-09-27 15:14:20
tags: Vue3
categories: Vue3
---

## useId的作用

他的作用也是生成唯一ID，同一个Vue应用里面每次调用`useId`生成的ID都不同。

使用方法也很简单，代码如下：

```js
<script setup lang="ts">
import { useId } from 'vue'

const id0 = useId();
console.log(id0); // v-0

const id1 = useId();
console.log(id1); // v-1

const id2 = useId();
console.log(id2); // v-2
</script>
```

## useId是如何实现的

来看看`useId`的源码，非常简单！！简化后的代码如下：

```js
function useId(): string {
  const i = getCurrentInstance()
  if (i) {
    return (i.appContext.config.idPrefix || 'v') + '-' + i.ids[0] + i.ids[1]++
  }
  return ''
}

```

## 总结

生成的ID分为三部分：

- 第一部分为前缀：[`app.config.idPrefix`](https://link.juejin.cn?target=https%3A%2F%2Fcn.vuejs.org%2Fapi%2Fapplication.html%23app-config-idprefix)，如果没有配置，那么就是字符串`v`。

- 第二部分字符串：`-`。

- 第三部分的值为一个自增的数字，存在vue实例上面的`ids`属性，所有的vue实例上面的`ids`属性都是指向同一个数组。这也就是为什么说`useId`可以在`Vue应用内`生成唯一的ID，而不是在`Vue组件内`生成唯一的ID。
