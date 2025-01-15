---
title: setTimeout不准时?
date: 2025-01-03 13:52:50
tags: JS
categories: JS
---

## 演示

使用一个计数器来记录每次 `setTimeout` 的调用。设定的间隔时间乘以计数次数，理想情况下应等于预期的延迟。通过以下示例，可以检查我们计时器的准确性。

```js
function time() {
  var speed = 50, // 间隔
    count = 1; // 计数
  start = new Date().getTime();

  function instance() {
    var ideal = count * speed,
      real = new Date().getTime() - start;

    count++;
    console.log(count + "理想值------------------------：", ideal); // 记录理想值
    console.log(count + "真实值------------------------：", real); // 记录理想值

    var diff = real - ideal;
    console.log(count + "差值------------------------：", diff); // 差值

    // 小于5执行
    if (count < 5) {
      window.setTimeout(function () {
        instance();
      }, speed);
    }
  }

  window.setTimeout(function () {
    instance();
  }, speed);
}
```

#### 打印 1

2 理想值------------------------： 50
2 真实值------------------------： 59
2 差值------------------------： 9
3 理想值------------------------： 100
3 真实值------------------------： 126
3 差值------------------------： 26
4 理想值------------------------： 150
4 真实值------------------------： 180
4 差值------------------------： 30
5 理想值------------------------： 200
5 真实值------------------------： 232
5 差值------------------------： 32

我们可以在 `setTimeout` 执行之前加入额外的代码逻辑，然后再观察这个差值。

```js
...
window.setTimeout(function(){
    instance();
}, speed);
for(var a = 1, i = 0; i < 10000000; i++) {
    a *= (i + 1);
};
...

```

2 理想值------------------------： 50
2 真实值------------------------： 62
2 差值------------------------： 12
3 理想值------------------------： 100
3 真实值------------------------： 122
3 差值------------------------： 22
4 理想值------------------------： 150
4 真实值------------------------： 174
4 差值------------------------： 24
5 理想值------------------------： 200
5 真实值------------------------： 228
5 差值------------------------： 28

## setTimeout 系统时间补偿

当每一次定时器执行时后，都去获取系统的时间来进行修正，虽然每次运行可能会有误差，但是通过系统时间对每次运行的修复，能够让后面每一次时间都得到一个补偿。

```js
function time() {
  var speed = 50, // 间隔
    count = 1; // 计数
  start = new Date().getTime();

  function instance() {
    var ideal = count * speed,
      real = new Date().getTime() - start;

    count++;
    console.log(count + "理想值------------------------：", ideal); // 记录理想值
    console.log(count + "真实值------------------------：", real); // 记录理想值

    var diff = real - ideal;
    console.log(count + "差值------------------------：", diff); // 差值

    // 5次后不再执行
    if (count < 5) {
      window.setTimeout(function () {
        instance();
      }, speed - diff);
    }
  }

  window.setTimeout(function () {
    instance();
  }, speed);
}
```
