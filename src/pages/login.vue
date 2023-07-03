<script setup lang="ts">
import LoginBanner from '../components/LoginBanner.vue'
import LoginForm from '../components/LoginForm.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
  <div class="container">
    <div class="logo">
      <svg class="m-logo" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="m18.66 8.286l.368-.368c.342-.343.514-.514.617-.692a1.562 1.562 0 0 0 0-1.562c-.103-.178-.275-.35-.617-.692c-.342-.342-.514-.514-.692-.616a1.562 1.562 0 0 0-1.562 0c-.178.102-.35.274-.692.616l-.368.368m-4.419 10.31l-5.523 5.524c-.343.343-.514.514-.692.617a1.562 1.562 0 0 1-1.562 0c-.179-.103-.35-.274-.692-.617c-.343-.342-.514-.514-.617-.692a1.562 1.562 0 0 1 0-1.562c.103-.178.274-.35.617-.692l5.523-5.523M18 17.75c-.898.827-1.542 1.24-2.286 1.24c-1.079 0-1.947-.868-3.682-2.604l-4.42-4.419C5.878 10.233 5.01 9.365 5.01 8.286c0-1.078.868-1.946 2.604-3.682C9.349 2.868 10.217 2 11.295 2c1.079 0 1.947.868 3.682 2.604l4.42 4.419C21.131 10.758 22 11.626 22 12.705c0 .747-.416 1.392-1.248 2.295" /></svg>
      <div class="logo-text">
        设施报修管理系统
      </div>
    </div>
    <LoginBanner />
    <div class="content">
      <div class="content-inner">
        <LoginForm />
      </div>
      <div class="footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.container .banner {
  width: 550px;
  background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
}

.container .content {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: 40px;
}

.container .footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
}

.logo {
  position: fixed;
  top: 24px;
  left: 22px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
}

.logo-text {
  margin-right: 4px;
  margin-left: 4px;
  color: var(--color-fill-1);
  font-size: 20px;
}

@media (max-width: 1024px) {
  .container .banner {
    width: 25%;
  }
}

.m-logo {
  @apply px-1;
}
</style>
