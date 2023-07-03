<script lang="ts" setup>
import { computed } from 'vue'

const carouselItem = computed(() => [
  {
    slogan: '原神',
    subSlogan: '启动',
    image: '../public/login-banner.png',
  },
  {
    slogan: '原神',
    subSlogan: '启动',
    image: '../public/login-banner.png',
  },
  {
    slogan: '原神',
    subSlogan: '启动',
    image: '../public/login-banner.png',
  },
])
</script>

<template>
  <div class="banner">
    <div class="banner-inner">
      <a-carousel class="carousel" animation-name="fade">
        <a-carousel-item v-for="item in carouselItem" :key="item.slogan">
          <div :key="item.slogan" class="carousel-item">
            <div class="carousel-title">
              {{ item.slogan }}
            </div>
            <div class="carousel-sub-title">
              {{ item.subSlogan }}
            </div>
            <img class="carousel-image" :src="item.image">
          </div>
        </a-carousel-item>
      </a-carousel>
    </div>
  </div>
</template>

<style scoped>
  .banner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-inner {
  flex: 1;
  height: 100%;
}

.carousel {
  height: 100%;
}

.carousel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.carousel-title {
  color: var(--color-fill-1);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}

.carousel-sub-title {
  margin-top: 8px;
  color: var(--color-text-3);
  font-size: 14px;
  line-height: 22px;
}

.carousel-image {
  width: 320px;
  margin-top: 30px;
}
</style>
