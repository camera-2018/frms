<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import useUserStore from '../../../store/user'

const router = useRouter()
const userStore = useUserStore()
const { account, name, sex, phone, department, job_type, role, created_at, updated_at } = storeToRefs(userStore)

</script>

<template>
  <div class="flex flex-col justify-center items-center mt-[80px] gap-y-4">
    <div class="flex items-center justify-center gap-x-4">
      <a-descriptions size="large" label="User Info" :column="1">
        <a-descriptions-item label="用户账号">
          {{ account }}
        </a-descriptions-item>
        <a-descriptions-item label="姓名">
          {{ name }}
        </a-descriptions-item>
        <a-descriptions-item label="性别">
          {{ sex }}
        </a-descriptions-item>
        <a-descriptions-item label="联系电话">
          {{ phone }}
        </a-descriptions-item>
        <a-descriptions-item label="部门" v-if="role === 'user'">
          {{ department }}
        </a-descriptions-item>
        <a-descriptions-item label="工种" v-if="role === 'worker'">
          {{ job_type }}
        </a-descriptions-item>
        <a-descriptions-item label="角色">
          {{ role }}
        </a-descriptions-item>
        <a-descriptions-item label="创建日期">
          {{ created_at }}
        </a-descriptions-item>
        <a-descriptions-item label="修改日期">
          {{ updated_at }}
        </a-descriptions-item>

      </a-descriptions>
      <a-image width="200" src="/img/head.png" />
    </div>
    <a-button class="ml-7" @click="router.push('/user/modify')">
      修改信息
    </a-button>
  </div>
</template>
