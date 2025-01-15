---
title: Vue3的provide和inject源码
date: 2024-12-27 12:32:10
tags: Vue3
categories: Vue3
---

`provide`和`inject`函数是如何实现数据多级传递的。

## 看个demo

代码如下：

```html
<template>
  <ChildDemo />
</template>

<script setup>
import ChildDemo from "./child.vue";
import { ref, provide } from "vue";
// 提供响应式的值
const count = ref(0);
provide("count", count);
</script>

```

在父组件中使用`provide`为后代组件注入一个`count`响应式变量。

再来看看子组件`child.vue`代码如下：

```html
<script setup>
import { inject } from "vue";

// 注入响应式的值
const count = inject("count");
console.log("inject count is:", count);
</script>
```

从上面的代码可以看到在孙子组件中使用`inject`函数拿到了父组件中注入的`count`响应式变量。

## `provide`函数

```js
function provide(key, value) {
  if (!currentInstance) {
    if (!!(process.env.NODE_ENV !== "production")) {
      warn$1(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
```

首先判断`currentInstance`是否有值，如果没有就说明当前没有vue实例，也就是说当前调用provide函数的地方是不在setup函数中执行的，然后给出警告provide只能在setup中使用。

然后走进else逻辑中，首先从当前vue实例中取出存的`provides`属性对象。并且通过`currentInstance.parent.provides`拿到父组件vue实例中的`provides`属性对象。

这里为什么需要判断`if (parentProvides === provides)`呢？

因为在创建子组件时会默认使用父组件的`provides`属性对象作为父组件的`provides`属性对象。代码如下：

```js
const instance: ComponentInternalInstance = {
  uid: uid++,
  vnode,
  type,
  parent,
  provides: parent ? parent.provides : Object.create(appContext.provides),
  // ...省略
}	
```

从上面的代码可以看到如果有父组件，那么创建子组件实例的时候就直接使用父组件的`provides`属性对象。

所以这里在provide函数中需要判断`if (parentProvides === provides)`，如果相等说明当前父组件和子组件是共用的同一个`provides`属性对象。此时如果子组件调用了provide函数，说明子组件需要创建自己的`provides`属性对象。

并且新的属性对象还需要能够访问到父组件中注入的内容，所以这里以父组件的`provides`属性对象为原型去创建一个新的子组件的，这样在子组件中不仅能够访问到原型链中注入的`provides`属性对象，也能够访问到自己注入进去的`provides`属性对象。

最后就是执行`provides[key] = value`将当前注入的内容存到`provides`属性对象中。

## inject函数

```js
export function inject(
  key: InjectionKey<any> | string,
  defaultValue?: unknown,
  treatDefaultAsFactory = false,
) {
  // fallback to `currentRenderingInstance` so that this can be called in
  // a functional component
  const instance = currentInstance || currentRenderingInstance

  // also support looking up from app-level provides w/ `app.runWithContext()`
  if (instance || currentApp) {
    const provides = currentApp
      ? currentApp._context.provides
      : instance
        ? instance.parent == null
          ? instance.vnode.appContext && instance.vnode.appContext.provides
          : instance.parent.provides
        : undefined

    if (provides && key in provides) {
      return provides[key]
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue)
        ? defaultValue.call(instance && instance.proxy)
        : defaultValue
    } else if (__DEV__) {
      warn(`injection "${String(key)}" not found.`)
    }
  } else if (__DEV__) {
    warn(`inject() can only be used inside setup() or functional components.`)
  }
}
```

首先拿到当前渲染的vue实例赋值给本地变量`instance`。接着使用`if (instance || currentApp)`判断当前是否有vue实例，如果没有看看有没有使用`app.runWithContext`手动注入了上下文，如果注入了那么`currentApp`就有值。

接着就是一串三元表达式，如果使用`app.runWithContext`手动注入了上下文，那么就优先从注入的上下文中取出`provides`属性对象。

如果没有那么就看当前组件是否满足`instance.parent == null`，也就是说当前组件是否是根节点。如果是根节点就取app中注入的`provides`属性对象。

如果上面的都不满足就去取父组件中注入的`provides`属性对象，前面我们讲过了在inject函数阶段，如果子组件内没有使用inject函数，那么就会直接使用父组件的`provides`属性对象。如果子组件中使用了inject函数，那么就以父组件的`provides`属性对象为原型去创建一个新的子组件的`provides`属性对象，从而形成一条原型链。

所以这里的孙子节点的`provides`属性对象中当然就能够拿到父组件中注入的`count`响应式变量，那么`if (provides && key in provides)`就满足条件，最后会走到`return provides[key]`中将父组件中注入的响应式变量`count`原封不动的返回。

还有就是如果我们inject一个没有使用provide存入的key，并且传入了第二个参数`defaultValue`，此时`else if (arguments.length > 1)`就满足条件了。

在里面会去判断是否传入第三个参数`treatDefaultAsFactory`，如果这个参数的值为true，说明第二个参数`defaultValue`可能是一个工厂函数。那么就执行`defaultValue.call(instance && instance.proxy)`将`defaultValue`的当中工厂函数的执行结果进行返回。

如果第三个参数`treatDefaultAsFactory`的值不为true，那么就直接将第二个参数`defaultValue`当做默认值返回。

## 总结

在创建vue组件实例时，子组件的`provides`属性对象会直接使用父组件的`provides`属性对象。如果在子组件中使用了`provide`函数，那么会以父组件的`provides`属性对象为原型创建一个新的`provides`属性对象，并且将`provide`函数中注入的内容塞到新的`provides`属性对象中，从而形成了原型链。

在孙子组件中，他的parent就是子组件。前面我们讲过了如果没有在组件内使用`provide`注入东西（很明显这里的子组件确实没有注入任何东西），那么就会直接使用他的父组件的`provides`属性对象，所以这里的子组件是直接使用的是父组件中的`provides`属性对象。所以在孙子组件中可以直接使用`inject`函数拿到父组件中注入的内容。
