<script setup>
const props = defineProps({
  articles: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <VRow v-if="props.articles.length">
    <VCol
      v-for="article in props.articles"
      :key="article.title"
      cols="12"
      md="4"
    >
      <VCard
        flat
        border
      >
        <VCardText class="text-center">
          <img
            :src="article.img"
            alt="svg"
            height="58"
            width="58"
          >

          <h5 class="text-h5 my-3">
            {{ article.title }}
          </h5>
          <p class="clamp-text text-body-1 mb-3 mx-auto">
            {{ article.subtitle }}
          </p>

          <VBtn
            variant="outlined"
            :to="{
              name: 'front-pages-help-center-article-title',
              params: {
                title: 'how-to-add-product-in-cart',
              },

            }"
          >
            Read More
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
