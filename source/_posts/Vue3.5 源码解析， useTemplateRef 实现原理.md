---
title: Vue3.5 源码解析， useTemplateRef 实现原理
date: 2024-09-06 14:07:04
tags: Vue3
categories: Vue3
---

## useTemplateRef 的作用

useTemplateRef 是用来专门获取 dom 或者 组件示例 的。

在之前，如果我们想要获取 dom ，那么需要这么做：

1. 先为 dom 指定 ref 属性，并且给定一个 value 值

2. 在 js 中，声明 value 值的变量，并且给定初始值为 空的 ref

   ```javascript
   <script setup>
   // 首先，您定义了一个值为undefined或空的ref
   // 并以您想要的方式命名生成的可用内容
   const divEl = ref();
   </script>

   <template>
   <!-- 然后使用与“ref”属性的值相同的名称,在模板中的某个地方 -->
   <div ref="divEl" ></div>
   </template>
   ```

   但是，这种方案存在一个问题，那就是：ref 通常用来声明响应式数据。当 ref 不光作为响应式声明，还被作为 dom 实例的时候，那么就难免有点让人疑惑了。

   所以在（3.5 之后） Vue 推出了一个新的 API 叫做 useTemplateRef 来解决这个问题：

   ```javascript
   <template>
    <div>
     <div ref="el">程序员Sunday</div>
    </div>
   </template>

   <script setup>
   import { onMounted, useTemplateRef } from 'vue'

   const elRef = useTemplateRef('el')

   onMounted(() => {
    console.log(elRef.value) // dom 示例
   })
   </script>
   ```

## useTemplateRef 的实现原理

```javascript
export function useTemplateRef(key: Keys) {
  const i = getCurrentInstance();
  const r = shallowRef(null);
  if (i) {
    const refs = i.refs === EMPTY_OBJ ? (i.refs = {}) : i.refs;

    Object.defineProperty(refs, key, {
      enumerable: true,
      get: () => r.value,
      set: (val) => (r.value = val),
    });
  }
  return r;
}
```

##### 第一个 i：通过 getCurrentInstance() 获取，得到的是 上下文实例。

​ 接下来，通过 i.refs 获取到所有的 ref 数据，然后为 refs 添加 Object.defineProperty 的监听，监听的属性名就是入参 key。如果以 useTemplateRef('el') 为例，那么就是 "el"。

通过监听对应 key 的 get 和 set 标记，这里 重点关注 set 标记，在这里为 r.value 进行了赋值，即：r.value = val。这里的 val 就是 refs[key] 的值，也就是对应的 ref 组件实例。

##### 第二个 r：通过 shallowRef(null) 获取，作为返回值

r 作为 useTemplateRef 的返回值即 最终获取的组件示例。
