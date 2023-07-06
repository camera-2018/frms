<script setup>
import {
  IconApps,
  IconCaretLeft,
  IconCaretRight,
  IconFile,
  IconHome,
  IconUser,
} from '@arco-design/web-vue/es/icon'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { sendroute } from '../utils/sendroute'
import useUserStore from '../store/user'

const router = useRouter()
const route = useRoute()
function logout() {
  useUserStore().login = false
  useUserStore().role = ''
  useStorage('token').value = null
  router.push('/login')
}

function onClickMenuItem(key) {
  router.push(key)
}

const routeMenu = sendroute()
const showcheck = ref(true)
</script>

<template>
  <a-layout class="layout-demo">
    <a-layout-sider collapsible breakpoint="xl">
      <div class="logo">
        <svg class="m-logo" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="m18.66 8.286l.368-.368c.342-.343.514-.514.617-.692a1.562 1.562 0 0 0 0-1.562c-.103-.178-.275-.35-.617-.692c-.342-.342-.514-.514-.692-.616a1.562 1.562 0 0 0-1.562 0c-.178.102-.35.274-.692.616l-.368.368m-4.419 10.31l-5.523 5.524c-.343.343-.514.514-.692.617a1.562 1.562 0 0 1-1.562 0c-.179-.103-.35-.274-.692-.617c-.343-.342-.514-.514-.617-.692a1.562 1.562 0 0 1 0-1.562c.103-.178.274-.35.617-.692l5.523-5.523M18 17.75c-.898.827-1.542 1.24-2.286 1.24c-1.079 0-1.947-.868-3.682-2.604l-4.42-4.419C5.878 10.233 5.01 9.365 5.01 8.286c0-1.078.868-1.946 2.604-3.682C9.349 2.868 10.217 2 11.295 2c1.079 0 1.947.868 3.682 2.604l4.42 4.419C21.131 10.758 22 11.626 22 12.705c0 .747-.416 1.392-1.248 2.295" /></svg>
      </div>
      <a-menu
        :default-open-keys="['4']"
        :default-selected-keys="['0_1']"
        :style="{ width: '100%' }"
        @menu-item-click="onClickMenuItem"
      >
        <div v-for="element in routeMenu" :key="element.key">
          <a-menu-item v-if="element.sub.length === 0" :key="element.key">
            <IconApps v-if="element.title === '我的报修'" />
            <IconApps v-if="element.title === '我的维修'" />
            <IconApps v-if="element.title === '记录管理'" />
            <IconFile v-if="element.title === '我要报修'" />
            <IconFile v-if="element.title === '任务委派'" />
            <IconUser v-if="element.title === '我的信息'" />
            {{ element.title }}
          </a-menu-item>
          <a-sub-menu v-if="element.sub.length !== 0" :key="element.key">
            <template #title>
              <IconUser v-if="element.title === '我的信息'" />
              {{ element.title }}
            </template>
            <a-menu-item v-for="l in element.sub" :key="l.key">
              {{ l.title }}
            </a-menu-item>
          </a-sub-menu>
        </div>
      </a-menu>
      <template #trigger="{ collapsed }">
        <IconCaretRight v-if="collapsed" />
        <IconCaretLeft v-else />
      </template>
    </a-layout-sider>
    <a-layout>
      <a-layout-header>
        <a-page-header @back="router.back()">
          <template #title>
            <div class="text-[1rem]">
              设施报修管理系统
            </div>
          </template>
          <template #extra>
            <a-space size="medium" class="space">
              <a-button type="primary" @click="logout">
                退出登录
              </a-button>
              <a-avatar class="avatar">
                <img
                  alt="avatar"
                  src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                >
              </a-avatar>
            </a-space>
          </template>
        </a-page-header>
      </a-layout-header>
      <a-layout style="padding: 0 24px;">
        <a-breadcrumb :style="{ margin: '16px 0' }">
          <a-breadcrumb-item>
            <IconHome />
          </a-breadcrumb-item>
          <a-breadcrumb-item v-for="e in route.path.split('/').filter(item => item !== '')" :key="e">
            {{ e }}
          </a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content>
          <Suspense>
            <router-view />
          </Suspense>
          <div v-if="route.path === '/'" class="check_browser">
            <a-result :status="null" title="欢迎使用设施报修管理系统" subtitle="请点击左侧导航栏开始使用">
              <template #icon>
                <svg class="text-black" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="m18.66 8.286l.368-.368c.342-.343.514-.514.617-.692a1.562 1.562 0 0 0 0-1.562c-.103-.178-.275-.35-.617-.692c-.342-.342-.514-.514-.692-.616a1.562 1.562 0 0 0-1.562 0c-.178.102-.35.274-.692.616l-.368.368m-4.419 10.31l-5.523 5.524c-.343.343-.514.514-.692.617a1.562 1.562 0 0 1-1.562 0c-.179-.103-.35-.274-.692-.617c-.343-.342-.514-.514-.617-.692a1.562 1.562 0 0 1 0-1.562c.103-.178.274-.35.617-.692l5.523-5.523M18 17.75c-.898.827-1.542 1.24-2.286 1.24c-1.079 0-1.947-.868-3.682-2.604l-4.42-4.419C5.878 10.233 5.01 9.365 5.01 8.286c0-1.078.868-1.946 2.604-3.682C9.349 2.868 10.217 2 11.295 2c1.079 0 1.947.868 3.682 2.604l4.42 4.419C21.131 10.758 22 11.626 22 12.705c0 .747-.416 1.392-1.248 2.295" /></svg>
              </template>
              <template #extra>
                <a-space v-if="showcheck">
                  <a-popconfirm content="真的要停止检查吗？" position="bottom" @ok="showcheck = false">
                    <a-button type="outline">
                      <a-spin :size="14" />
                      我们正在检查您的浏览器
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-result>
          </div>
        </a-layout-content>
        <a-layout-footer>
          <div class="footer">
            Facility Repair Management System
          </div>
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.layout-demo {
  height: 100vh;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border);
}
.layout-demo :deep(.arco-layout-sider) .logo {
  height: 32px;
  margin: 12px 8px;
  display: flex;
  align-items: center;
}
.m-logo{
  height: 32px;
  margin-left: 4.5rem;
  color: black;
}
.layout-demo :deep(.arco-layout-header)  {
  height: 64px;
  line-height: 64px;
  background: var(--color-bg-3);
}
.layout-demo :deep(.arco-layout-footer) {
  height: 48px;
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  line-height: 48px;
}
.layout-demo :deep(.arco-layout-content) {
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  background: var(--color-bg-3);
}
.layout-demo :deep(.arco-layout-footer),
.layout-demo :deep(.arco-layout-content)  {
  display: flex;
  flex-direction: column;
  color: var(--color-white);
  font-size: 16px;
  font-stretch: condensed;
}

.avatar {
  height: 33px;
  width: 33px;
}

.footer{
  text-align: center;
  font-size: 12px;
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  line-height: 48px;
}

.check_browser{
  @apply mt-[10rem]
}
</style>
