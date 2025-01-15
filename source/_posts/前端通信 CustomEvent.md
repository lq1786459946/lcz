---
title: 前端通信 CustomEvent
date: 2024-011-08 14:39:50
tags: Vue
categories: Vue
---

通过简单的几行代码，我们能够轻松创建和触发自定义事件，从而降低特殊场景下的开发风险，并且提升我们的开发效率。而且它可以非常容易的写到 React 和 Vue 项目中，

## 实现过程

看看如何利用 CustomEvent 构建一个全局广播推送消息的机制：

```js
// 创建并触发自定义事件
const customEvent = w('yourEventName', {  
  detail: { key: 'myKey', value: 'newValue'} // 自定义数据
}); 

window.dispatchEvent(customEvent); // 推送消息

```

我们需要设置接收端：

```js
// 监听自定义事件
window.addEventListener('yourEventName', (event) => {
  const { key, value } = event.detail;
  if (key === 'myKey') {
    console.log('Detected localStorage change:', value);
  }
});
```

### Vue 组件之间进行通信

```html
<template>
  <div>
    <input v-model="username" @input="updateUser" placeholder="Enter your name" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
    };
  },
  methods: {
    updateUser() {
      // 创建并触发自定义事件
      const customEvent = new CustomEvent('userUpdated', {
        detail: { name: this.username },
      });
      window.dispatchEvent(customEvent);
    },
  },
};
</script>

```

Notification.vue

```html
<template>
  <div v-if="message">{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
    };
  },
  mounted() {
    window.addEventListener('userUpdated', (event) => {
      const { name } = event.detail;
      this.message = `User name has been changed to ${name}`;
    });
  },
  beforeDestroy() {
    window.removeEventListener('userUpdated', this.eventListener);
  },
};
</script>

```

