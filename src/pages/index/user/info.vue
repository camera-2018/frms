<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const size = ref('large')

const data = [
  {
    label: '用户编号',
    value: '34567890876543',
    name: 'userID',
  },
  {
    label: '用户登录账号',
    value: 'Saomi',
    name: 'ACCT',
  },
  {
    label: '姓名',
    value: '李华',
    name: 'name',
  },
  {
    label: '性别',
    value: '男',
    name: 'sex',
  },
  {
    label: '联系电话',
    value: '19550982374',
    name: 'phone',
  },
  {
    label: '邮箱',
    value: '2538729374@qq.com',
    name: 'email',
  },
  {
    label: '所属部门',
    value: '计算机学院',
    name: 'depart',
  },
  {
    label: '创建日期',
    value: '2022-07-02',
    name: 'create',
  },
  {
    label: '修改日期',
    value: '2022-07-04',
    name: 'modify',
  }]
function onPost() {
  router.push('/user/modify')
}
</script>

<template>
  <div class="flex flex-col justify-center mt-[80px]">
    <a-space class="place-content-center mb-3">
      <a-descriptions :data="data" :size="size" label="User Info" :column="1" />
      <a-image
        width="200"
        src="/img/head.png"
      />
    </a-space>
    <a-space class="place-content-center mb-3">
      <a-button type="primary" class="mr-8">
        确认
      </a-button>
      <a-button class="ml-8" @click="onPost">
        修改
      </a-button>
    </a-space>
  </div>
</template>
