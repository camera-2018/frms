<script setup>
import {
  IconApps,
  IconBug,
  IconBulb,
} from '@arco-design/web-vue/es/icon'
import { defineComponent } from 'vue'

defineComponent({
  name: 'Menumain',
  setup() {
    const onCollapse = (collapsed) => {
      console.log(collapsed)
    }

    return {
      onCollapse,
    }
  },
})
</script>

<template>
  <div class="menu-demo">
    <a-menu
      :style="{ width: '200px', height: '100%' }"
      :default-open-keys="['0']"
      :default-selected-keys="['0_2']"
      show-collapse-button
      breakpoint="xl"
      @collapse="onCollapse"
    >
      <a-sub-menu key="0">
        <template #icon>
          <IconApps />
        </template>
        <template #title>
          Navigation 1
        </template>
        <a-menu-item key="0_0">
          Menu 1
        </a-menu-item>
        <a-menu-item key="0_1">
          Menu 2
        </a-menu-item>
        <a-menu-item key="0_2">
          Menu 3
        </a-menu-item>
        <a-menu-item key="0_3">
          Menu 4
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="1">
        <template #icon>
          <IconBug />
        </template>
        <template #title>
          Navigation 2
        </template>
        <a-menu-item key="1_0">
          Menu 1
        </a-menu-item>
        <a-menu-item key="1_1">
          Menu 2
        </a-menu-item>
        <a-menu-item key="1_2">
          Menu 3
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="2">
        <template #icon>
          <IconBulb />
        </template>
        <template #title>
          Navigation 3
        </template>
        <a-menu-item key="2_0">
          Menu 1
        </a-menu-item>
        <a-menu-item key="2_1">
          Menu 2
        </a-menu-item>
        <a-sub-menu key="2_2" title="Navigation 4">
          <a-menu-item key="2_2_0">
            Menu 1
          </a-menu-item>
          <a-menu-item key="2_2_1">
            Menu 2
          </a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<style scoped>
.menu-demo {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 40px;
  background-color: var(--color-neutral-2);
}
</style>
