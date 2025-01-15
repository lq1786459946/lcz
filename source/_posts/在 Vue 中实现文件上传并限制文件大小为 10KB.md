---
title: 在 Vue 中实现20MB图片上传压缩到10KB
date: 2024-11-01 14:02:00
tags: Vue
categories: Vue
---

在现代 Web 应用中，文件上传是一个常见的功能，尤其是在用户需要上传图片时。然而，上传的文件往往会占用较大的存储空间，影响性能和用户体验。因此，限制文件大小是一个重要的需求。在这篇文章中，我们将介绍如何在 Vue.js 应用中实现文件上传，并将上传压缩到 10KB

#### 创建文件上传组件

我们首先需要创建一个简单的文件上传组件，用户可以通过这个组件选择图片文件。以下是基本的组件结构：

```html
<template>
  <div>
    <input type="file" @change="handleFileUpload" accept="image/*" />
    <img v-if="imageSrc" :src="imageSrc" alt="Preview" />
  </div>
</template>
```

这个模板包含一个文件输入框和一个用于显示图片预览的 img 标签。

#### 处理文件上传

接下来，我们需要在组件中定义文件上传的逻辑。我们将使用 FileReader API 来读取文件，并通过 canvas 进行图片的压缩处理。

```js
<script>
export default {
  data() {
    return {
      imageSrc: null,
    };
  },
  methods: {
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const compressedFile = await this.compressImage(file);
        console.log(compressedFile);
      }
    },
```

handleFileUpload 方法会在用户选择文件后被调用。我们首先检查用户是否选择了文件，如果选择了，则调用 compressImage 方法进行压缩处理。

#### 压缩图片

压缩图片的核心逻辑在于 compressImage 方法。该方法会创建一个新的 canvas 元素，并根据最大宽高对图片进行缩放，然后将其压缩到 10KB 以内。

```js
      compressImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const MAX_WIDTH = 100; // 最大宽度
            const MAX_HEIGHT = 100; // 最大高度
            let width = img.width;
            let height = img.height;

            // 计算新的宽高
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // 压缩为 10KB
            canvas.toBlob((blob) => {
              if (blob.size > 10 * 1024) { // 10KB
                reject(new Error('Compressed file exceeds 10KB.'));
              } else {
                resolve(blob);
                this.imageSrc = URL.createObjectURL(blob); // 显示预览
              }
            }, 'image/jpeg', 0.7); // 设定压缩质量
          };
        };
        reader.readAsDataURL(file);
      });
    },
  },
};
</script>

```

在这个方法中，我们首先读取文件并创建一个图像对象。在图像加载完成后，我们创建一个 canvas，设置其大小，并将图像绘制到画布上。接下来，我们使用 canvas.toBlob 方法将画布内容转换为 Blob 对象，并检查其大小是否小于 10KB。如果压缩成功，我们将 Blob 对象转换为 URL 以供预览。

#### 预览与用户反馈

在处理完文件上传和压缩后，我们可以通过绑定 imageSrc 来显示上传后的图片预览。这样用户就可以实时查看他们上传的文件。

```html
<img v-if="imageSrc" :src="imageSrc" alt="Preview" />
```

#### 总结

通过以上步骤，我们成功创建了一个简单的文件上传组件，能够有效地限制上传文件的大小为 10KB。这种处理方式不仅能保证上传的文件符合大小要求，同时也能在一定程度上保证上传的速度和用户体验。

如果你需要支持其他类型的文件或者扩展更多功能，可以根据实际需求对代码进行相应的修改。这种方法也可以作为其他文件处理功能的基础，帮助你在 Vue 应用中实现更复杂的文件上传逻辑。
