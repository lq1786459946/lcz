---
title: Vue3源码——h函数
date: 2024-10-12 14:57:10
tags: Vue3
categories: Vue3
---

Vue和React这类框架比起远古时期的jQuery，最大的改变就是采用了`MVVM架构`。

而MVVM架构的核心，则是`虚拟DOM`。

## 基本概念

### 虚拟DOM

说到虚拟DOM，先得说起**真实DOM**。真实的DOM就是一颗**HTML树**，里面包含了`节点`、`属性`（**class**、**id**、**style**等）、`子节点`信息。

例如这样的DOM节点

```html
<div id="app" class="test">hello world</div>
```

虚拟的DOM也要包括和真实DOM一样的信息。区别在于，它用**JS对象**来表示

例如刚才的DOM节点，用JS可以这样表示

```js
const vnode = {
    type: "div",
    props: {
        id: "app",
        class: "test"
    },
    children: "hello world"
}
```

可以看出，这个vnode对象，用了`type`、`props`和`children`分别表示了这个真实DOM节点的`类型`（div）、`属性`（id为app，class为test）以及`子节点`（字符串hello world）。看着这样格式的JS对象，我们也可以很容易地推理得到一个真实的DOM节点。我们把这样的一个对象称之为**虚拟DOM**。

### h函数

在Vue源码中，虚拟DOM是由`h函数`生成的。生成时同样可以传入`节点类型`、`属性`以及`子节点信息`。

```js
h("div", { id: "app", class: "test" }, "hello world")
```

尝试打印这个h函数生成的vnode，内部信息比较丰富，用注释标注了一些核心的属性

```js
{
        // 是否是VNode对象
        "__v_isVNode": true,
        "__v_skip": true,
        // 节点类型
        "type": "div",
        // 节点属性
        "props": { "class": "test", "id": "app" },
        "key": null,
        "ref": null,
        "scopeId": null,
        "slotScopeIds": null,
        // 子节点
        "children": "hello world",
        "component": null,
        "suspense": null,
        "ssContent": null,
        "ssFallback": null,
        "dirs": null,
        "transition": null,
        "el": null,
        "anchor": null,
        "target": null,
        "targetAnchor": null,
        "staticCount": 0,
        "shapeFlag": 9,
        "patchFlag": 0,
        "dynamicProps": null,
        "dynamicChildren": null,
        "appContext": null
}

```

## h函数框架

### 基本框架

对于h函数，我们知道应该包括三个参数

- 节点类型type
- 属性props（可选）
- 子节点children（可选）

考虑到属性和子节点都是**可选参数**，因此要针对入参数量和类型做一些判断，大概的规则如下

```js
export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const l = arguments.length;

  // 两个参数，不知道是props没传还是children没传
  if (l == 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }

      return createVNode(type, propsOrChildren, []);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    // 三个及以上的参数，肯定是props和children都有
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }

    return createVNode(type, propsOrChildren, children);
  }
}
```

至于**是否为vnode**的判断，直接根据`__v_isVNode属性`就可得知

```js
export function isVNode(value: any): value is VNode {
  return value ? value.__v_isVNode === true : false;
}
```

整体框架出来了，接下来vnode的生成，主要就是`createVNode`这个方法了

### vnode的类型

关于DOM节点，我们大概可以分成这样一些类别

- 标准节点：div、h1等常规标签
- 注释节点
- Fragment节点
- 组件
- ……

那么，相对的，vnode也会区分一些节点类型。

查看Vue源码可以得知，里面包含了**文本节点**`Text`、**片段节点**`Fragment`、**DOM节点**`Element`、**组件节点**`Component`、**注释节点**`Comment`等等。

此外，对于`children`来说，可能是**一个**，也可能是**数组**，甚至是**对象**、**函数**等等多种不同类型。

源码中，为了区分不同的节点，使用了`shapeFlag`，而且这个值还用二进制位进行计算。

```js
export const enum ShapeFlags {
  /**
   * type = Element
   */
  ELEMENT = 1,
  /**
   * 函数组件
   */
  FUNCTIONAL_COMPONENT = 1 << 1,
  /**
   * 有状态（响应数据）组件
   */
  STATEFUL_COMPONENT = 1 << 2,
  /**
   * children = Text
   */
  TEXT_CHILDREN = 1 << 3,
  /**
   * children = Array
   */
  ARRAY_CHILDREN = 1 << 4,
  /**
   * children = slot
   */
  SLOTS_CHILDREN = 1 << 5,
  /**
   * 组件：有状态（响应数据）组件 | 函数组件
   */
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
```

## h函数实现

### element节点+文本children

h函数最简单的用法是创建一个有tag名称的节点，子节点是文本。

```ts
const vnode = h("div", "hello world");
```

为了实现`VNode`的构建，需要先构建`createVNode`方法，接收`type`、`props`、`children`这三个参数。

```js
export interface VNode {
  __v_isVNode: true
  type: any
  props: any
  children: any
  shapeFlag: number
}

export function createVNode(type, props, children): VNode {
  // 这里先处理文本类型，其他的shapeFlag先不处理
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;
  
  return createBaseVNode(type, props, children, shapeFlag);
}

```

生成了`shapeFlag`后，要先创建VNode的一些基本属性，源码中用的就是`createBaseVNode`方法，并且在这之后使用`normalizeChildren`标准化children的类型（即使用**位或运算**得到一个shapeFlag值）

```js
// 创建基础vnode
function createBaseVNode(type, props, children, shapeFlag) {
  const vnode = {
    __v_isVNode: true,
    type,
    props,
    shapeFlag,
  } as VNode;

  normalizeChildren(vnode, children);

  return vnode;
}

function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0;

  if (children === null) {
    children = null;
  } else if (isArray(children)) {
    // TODO: 数组类型children处理
  } else if (typeof children === "object") {
    // TODO: 对象类型的children处理
  } else if (isFunction(children)) {
    // TODO: 函数类型的children处理
  } else {
    children = String(children);
    type = ShapeFlags.TEXT_CHILDREN;
  }

  vnode.children = children;
  vnode.shapeFlag |= type;
}
```

此时我们可以通过`h函数`拿到`tag`为`string`（例如`div`、`p`等），且`children`内容是`text`的vnode值了，和源码的核心内容是一致的

```js
const vnode = h("div", "hello world");

console.log(vnode); // shapeFlag是9，children是hello world
```

### element节点+数组children

相比于上一个节点类型，这个的区别就是children不再是一个节点，而是**多个**

```ts
const vnode = h("div", [h("p", "p1"), h("p", "p2"), h("p", "p3")]);
```

其中每一个节点的解析就是刚才`element+text`这种组合，而且这几个节点会先被处理成`VNode`，唯一的区别是整体`div`这个节点

查看源码可以知道，我们只需要在最后生成`div`的`VNode`的时候提供一个`type`数值就行

```ts
function normalizeChildren(vnode: VNode, children: unknown) {
  ......

  else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN;
  }
  
  ......
}
```

这时候这个`VNode`的打印结果就和源码核心一致了

```ts
const vnode = h("div", [h("p", "p1"), h("p", "p2"), h("p", "p3")]);

console.log(vnode); // shapeFlag是17，children也是vnode节点，shapeFlag都是9
```

从这里不难发现，VNode中一个很关键的属性是`shapeFlag`，正如名字一样，它描述了**虚拟DOM节点的形状**，而这个形状包括了**父节点类型**和**子节点类型/形状**，其中：

- createBaseVNode：提供了父节点的类型
- normalizeChildren：提供了子节点的类型和形状

### 组件Component

首先要明确一个问题：在Vue中，组件的本质是**对象/函数**

所以实际上在Vue中写的组件，如果需要渲染的话，要用**对象**包裹，其中包含一个`render`方法

```ts
const component = {
  render() {
    const vnode1 = h("div", "this is component");
    return vnode1;
  },
};

const vnode2 = h(component);

render(vnode2, document.querySelector('#app'));
```

按照之前的h函数实现和理解，其实我们可以在component的`render`中直接返回一个`VNode对象`，`render方法`直接给一个VNode对象，也能达到一样的效果，主要的注意点就是`shapeFlag值`要保持和源码一致

```ts
const component = {
  render() {
    return {
      v__is_vnode: true,
      type: "div",
      children: "this is component",
      shapeFlag: 9
    }
  }
}

render({
  v__is_vnode: true,
  type: component,
  shapeFlag: 4
}, document.querySelector('#app'));
```

所以只需要注意处理一下`type`和`shapeFlag`值，就可以完成组件component的h函数了，只要在`createVNode`中修改一行即可

```ts
function createVNode(type, props, children): VNode {
  ......
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0;

  ......
}
```

按照之前的代码，最后生成的VNode里的children会变成"undefined"，其实是`normalizeChildren`里面的判断条件过于严苛了，把`===`改成`==`即可

```ts
function normalizeChildren(vnode: VNode, children: unknown) {
  ......
  if (children == null) {
    children = null;
  }
  ......
}
```

### 其他一些简单节点

这里的简单节点包括：

- 纯文本`Text`
- 注释`Comment`
- 片段`Fragment`

查看源码可以发现，用h函数构建的这些节点的`type`都是`Symbol类型`，`shapeFlag`都是8

```ts
const vnodeText = h(Text, "this is text");

const vnodeComment = h(Comment, "this is comment");

const vnodeFragment = h(Fragment, "this is fragment");
```

相比于之前的代码，我们只需要考虑`type`的问题，这里直接创建几个常量处理即可

```ts
export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");
export const Comment = Symbol("Comment");
```

处理完之后，h函数对这些简单节点的输出就和源码核心保持一致了

## class和style的增强处理

Vue中对`class`和`style`，支持使用**数组/对象**，动态绑定值

```ts
const vnode = h('div', {
  class: {
    'red': true
  }
}, 'improve class');
```

按照上面的代码，可以拿到一个带有class为red的div

阅读源码得知，这个增强处理需要添加一个`normalizeClass方法`，方法本质上也是对class对象做一个**遍历**，针对`string`/`array`/`object`做不同的处理方式，最后拼接成`string`

```ts
function normalizeClass(value: unknown): string {
  let res = "";

  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value as object) {
      if ((value as object)[name]) {
        res += name + " ";
      }
    }
  }

  return res.trim();
}

function createVNode(type, props, children): VNode {
  if (props) {
    let { class: klass, style } = props;

    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
  }
  ......
}
```

style的处理逻辑上和class一致

