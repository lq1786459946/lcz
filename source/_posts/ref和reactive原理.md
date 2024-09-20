---
title: ref和reactive原理
date: 2024-08-27 16:30:20
tags: Vue3
categories: Vue3
---

## ref

ref 的处理上就是先将基本类型转换成对象类型，然后在里面加入一个 this.\_v_isRef 的布尔类型的值，来判断它是不是被 ref 处理了，然后将上面写的 track 和 trigger 函数写入 get 和 set 函数里面，如果你要处理的是一个对象，那么 vue3 就会把它改成 reactive 的处理方式。所以说，ref 可以处理基本类型和引用类型，而 reactive 处理的是引用类型，二者的区别不是很大。

## reactive

- 首先我们取一个对象{a: 1}

- 然后调用封装好的 reactive 函数 const state = reactive({a: 1})

- 这个时候就会进入代码片段 1.1 里面的 reactive 函数，在进入 createReactiveObject 函数

- 然后就会对我们要代理的对象进行判断，如果是对象的话就继续下去

- 在判断我们是不是已经代理过这个对象（就是我们预先空出一个位置，将已经代理过的对象全部存储下来），代理过就返回代理后的值，没有的话就创建一个新的代理

- 再然后绑定上 proxy 函数里面的 get 和 set 回调函数（可以看到代码 1.2）
