<script setup>
import sectionTitleIcon from '@images/pages/section-title-icon.png'
import ListArrowIcon from '@images/svg/list-arrow-icon.svg'
import VectorIcon from '@images/svg/vector.svg'

const pricingPlans = [
  {
    title: 'Basic Plan',
    price: 20,
    features: [
      'Timeline',
      'Basic search',
      'Live chat widget',
      'Email marketing',
      'Custom Forms',
      'Traffic analytics',
    ],
    supportType: 'Basic',
    supportMedium: 'Only Email',
    respondTime: 'AVG. Time: 24h',
    current: false,
  },
  {
    title: 'Favourite Plan',
    price: 51,
    features: [
      'Everything in basic',
      'Timeline with database',
      'Advanced search',
      'Marketing automation',
      'Advanced chatbot',
      'Campaign management',
    ],
    supportType: 'Standard',
    supportMedium: 'Email & Chat',
    respondTime: 'AVG. Time: 6h',
    current: true,
  },
  {
    title: 'Standard Plan',
    price: 99,
    features: [
      'Campaign management',
      'Timeline with database',
      'Fuzzy search',
      'A/B testing sanbox',
      'Custom permissions',
      'Social media automation',
    ],
    supportType: 'Exclusive',
    supportMedium: 'Email, Chat & Google Meet',
    respondTime: 'Live Support',
    current: false,
  },
]
</script>

<template>
  <VContainer id="pricing-plan">
    <div class="pricing-plans d-flex flex-column gap-12">
      <!-- 👉 Headers  -->
      <div class="headers d-flex justify-center flex-column align-center">
        <div class="d-flex gap-x-3 mb-6">
          <img
            :src="sectionTitleIcon"
            alt="section title icon"
            height="24"
            width="25"
          >
          <div
            class="text-body-1 text-high-emphasis font-weight-medium"
            style="letter-spacing: 0.15px !important;"
          >
            PRICING PLANS
          </div>
        </div>

        <div class="mb-2 text-center">
          <span
            class="text-h4 d-inline-block font-weight-bold"
            style="line-height: 2rem;"
          >
            Tailored pricing plans
          </span> <span class="text-h5 d-inline-block">designed for you</span>
        </div>

        <p
          class="text-body-1 font-weight-medium text-center"
          style="letter-spacing: 0.15px !important;"
        >
          All plans include 40+ advanced tools and features to boost your product. <br>
          Choose the best plan to fit your needs.
        </p>
      </div>

      <div class="w-75 mx-auto">
        <VSlider
          max="999"
          model-value="458"
          color="primary"
          thumb-label="always"
          class="mt-12"
        />
      </div>

      <VRow>
        <VCol
          v-for="(plan, index) in pricingPlans"
          :key="index"
        >
          <VCard
            flat
            border
            :style="plan.current ? 'border:2px solid rgb(var(--v-theme-primary))' : ''"
          >
            <VCardText class="pa-lg-8 text-no-wrap">
              <div class="d-flex flex-column gap-y-8">
                <div class="d-flex flex-column  gap-y-3">
                  <h4 class="text-h4 text-center">
                    {{ plan.title }}
                  </h4>

                  <div class="d-flex align-center gap-x-3">
                    <div class="d-flex">
                      <h5
                        class="text-h5"
                        style="margin-block-start: 0.35rem;"
                      >
                        $
                      </h5>
                      <div class="plan-price-text">
                        {{ plan.price }}
                      </div>
                    </div>
                    <div>
                      <div class="text-body-1 font-weight-medium text-high-emphasis">
                        Per month
                      </div>
                      <div class="text-body-2">
                        10% off for yearly subscription
                      </div>
                    </div>
                  </div>

                  <VectorIcon />
                </div>

                <div class="d-flex flex-column">
                  <VList class="card-list">
                    <VListItem
                      v-for="(item, i) in plan.features"
                      :key="i"
                    >
                      <template #prepend>
                        <Component
                          :is="ListArrowIcon"
                          class="me-3 flip-in-rtl"
                        />
                      </template>
                      <h5 class="text-h5">
                        {{ item }}
                      </h5>
                    </VListItem>
                  </VList>

                  <VDivider class="my-4" />

                  <div class="d-flex align-center justify-space-between flex-wrap gap-2">
                    <div>
                      <div class="text-body-1 font-weight-medium text-high-emphasis mb-1">
                        {{ plan.supportType }} Support
                      </div>
                      <div class="text-body-2">
                        {{ plan.supportMedium }}
                      </div>
                    </div>

                    <VChip
                      variant="tonal"
                      color="primary"
                      density="comfortable"
                      class="font-weight-medium"
                    >
                      {{ plan.respondTime }}
                    </VChip>
                  </div>
                </div>

                <VBtn
                  block
                  :variant="plan.current ? 'elevated' : 'outlined'"
                  :to="{ name: 'front-pages-payment' }"
                >
                  Get Started
                </VBtn>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<style lang="scss">
.card-list {
  --v-card-list-gap: 12px;
}

.pricing-plans {
  margin-block: 5.25rem;
}
</style>

<style lang="scss" scoped>
.plan-price-text {
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  font-size: 48px;
  font-weight: 700;
  line-height: 56px;
}
</style>
