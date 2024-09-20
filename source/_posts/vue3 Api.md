---
title: vue3 Api
date: 2024-06-13 16:39:58
tags: Vue3
categories: Vue3
# cover: https://i.postimg.cc/rFkk79gD/image-20240827154520239.png
---

**defineProps()和 defineEmits()**

v-model:childValueModel 修改了值 本来应该是 modeValue

defineEmites() 使用要添加 update:

```javascript
<defineModelChild v-model;childValueModel="childValue"></defineModelChild>
```

​

```javascript

<template>
<div>{{ childValueModel }}</div>
<button @click="myEmits('update:childValueModel', childValueModel + 1)">数据 + 1</button>
</template>
<script setup>
const myProps = defineProps(['childValueModel']);
const myEmits= defineEmits(['update:childValueModel']);
</script>
```

**父组件**

```javascript
<script setup>
import HelloWorld from './components/defineProps-----defineEmits .vue'
//父组件
function count(value) {
  console.log(value);
}
</script>

<template>

  <HelloWorld a="qwdqwd"
    @count='count' />
</template>
```

**子组件**

```javascript
<script setup>
import { ref } from "vue"
//子组件
let count = ref(0)
let emit = defineEmits(["count"])
const props = defineProps(({
  a: String
}))
function increment() {
  count.value++
  emit("count", count.value)
}
</script>

<template>
  <button @click="increment">{{ count }} {{props.a}}</button>
</template>
```

**defineModel() 3.4+版本**

defineModel 其实也是一个语法糖，是对 v-model 再包装的语法糖

defineModel 帮你获取到了 prop 中的 modelValue ，且当 值发生变化时，会自动帮你调用 update:modelValue

```javascript
const myProps = defineProps(["modelValue"]);
const myEmits = defineEmits(["update:modelValue"]);

// 说白了，这里的 modelValue 等价于 props.modelValue + emit('update:modelValue')
// defineModel 帮你 封装了 modelValue 和 update:modelValue
const modelValue = defineModel();
```

**父组件**

```javascript
<template>
  <defineModelChild v-model="childValue"></defineModelChild>
</template>

<script setup>
import { ref } from 'vue';
import defineModelChild from './components/defineModelChild.vue';

const childValue = ref(0);
</script>
```

**v-model 子组件**

```javascript
<template>
<template>
  <div>{{ modelValue }}</div>
  <button @click="myEmits('update:modelValue', modelValue + 1)">数据 + 1</button>
</template>

<script setup>
defineProps(['modelValue']);

const myEmits = defineEmits(['update:modelValue']);
</script>
```

**defineModel() 子组件**

```javascript
<template>
  <div>{{ modelValue }}</div>
  <button @click="modelValue++">数据 + 1</button>
</template>

<script setup>
const modelValue = defineModel();
</script>
```

**defineExpose 子传父**

（用在子组件，暴露想传递的值或方法，父组件通过 ref 属性获取子组件暴露的）

使用 script setup 的组件是默认关闭的——即通过模板引用或者 $parent 链获取到的组件的公开实例，不会暴露任何在 script setup 中声明的绑定。

那么，通过 defineExpose 编译器宏来显式指定在

然后，父组件通过 ref 属性访问子组件

**父组件：**

```javascript
<Index ref="childeRef"></Index>

<script setup>
    import Index from "./index.vue";

    const childeRef = ref();

    function test() {
        console.log(childeRef.value.msg) // Hello World
    }

    onMounted(() => {
      let flag:boolean = true;
      let value:number= 5;
      childeRef.value.childFn(flag,value) // 调用子组件函数, 输出 6
    })

</script>
```

**子组件：**

```javascript
<script setup>
    import {ref} from "vue";

    function childFn(type：boolean, data：number) {
        console.log('我是子组件');
        if(data){
           let value = data + 1;
           return value;
        }
    }
    const msg = 'Hello World';

    defineExpose({ //暴露想要传递的值或方法
        msg,
        childFn,
    });
</script>
```

**defineOptions 3.3+**

```javascript
<script setup>
import { defineOptions } from 'vue'
defineOptions({
name: 'Foo',
//组件重命名
 inheritAttrs: false,
//...更多自定义属性
})
</script>
```

**computed 计算属性**

```javascript
<script setup >
import { computed, reactive } from "vue";

const author = reactive({
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? ' Yes' : "No"
})
</script>

<template>
  <div>
    {{ publishedBooksMessage }}
  </div>
</template>

<style  scoped>
</style>
```

**computed 传参**

```javascript
<script setup >
import { computed, reactive } from "vue";

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
const publishedBooksMessage = computed(() => {
  return function (value) {
    console.log(value)
    return author.books.length > 0 ? ' Yes' : "No"
  }
})
</script>

<template>
  <div>
    <p>Has published books:</p>
    {{ publishedBooksMessage(12) }}
  </div>
</template>

<style  scoped>
</style>
```

**watch 监听**

**默认开启深度监听**

```javascript
<script setup >
import { ref, watch } from "vue"

const count = ref(0)
const btnClick = () => {
  count.value++;
}
// ✅ 方法一，传递响应对象
watch(count, (newValue, oldValue) => {
  console.log(newValue, oldValue)
})
// ❌ 方法二：传递响应对象下的属性
watch(user.name, (value) => {
    console.log(value) // 监听失败，没输出
})
// ✅ 方法三：传递函数，函数返回响应对象属性
watch(() => user.name, (value) => {
    console.log(value); // 监听成功，输出 jake
})
</script>

<template>
  <div>
    <button @click="btnClick">点击</button>
    {{ count }}
  </div>
</template>

<style  scoped>
</style>
```

**watchEffect 的使用**

watchEffect 也是一个帧听器，是一个副作用函数。 它会监听引用数据类型的所有属性，不需要具体到某个属性，一旦运行就会立即监听，组件卸载的时候会停止监听。

```javascript
<script setup >
import { reactive, ref, watch, watchEffect } from "vue"

const count = reactive({ name: '112', data: ["你好"] })
const btnClick = () => {
  count.data[0] = '被改了'
}
watchEffect(() => {
  console.log(count.data[0]);
})
 watch([count,obj],() => {
      console.log('监听的多个数据改变了')
    })
</script>

<template>
  <div>
    <button @click="btnClick">点击</button>
    {{count.data[0]}}
  </div>
</template>

<style  scoped>
</style>
```

**stopWatchEffect 停止监听**

```javascript
const stop = watchEffect(() => {
  console.log("name:", obj.name);
});
const stopWatchEffect = () => {
  console.log("停止监听");
  stop();
};
```

onInvalidate 函数 解决执行顺序乱的问题
