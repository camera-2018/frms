<script setup>
import { reactive, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useDateFormat, useStorage } from '@vueuse/core'
import { base_url } from '../../../utils/config'
import useUserStore from '../../../store/user'

const router = useRouter()
const size = ref('large')

async function res() {
  const response = await fetch(`${base_url}/user/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useStorage('token').value}`,
    },
  })
  const data = (await response.json()).data
  data.user_info.created_at = useDateFormat(data.user_info.created_at, 'YYYY-MM-DD HH:mm:ss')
  data.user_info.updated_at = useDateFormat(data.user_info.updated_at, 'YYYY-MM-DD HH:mm:ss')
  return data
}

const resp = reactive({
  account: '',
  name: '',
  sex: '',
  phone: '',
  department: '',
  job_type: '',
  role: '',
  created_at: '',
  updated_at: '',
})

const worker_data = reactive([
  {
    label: '用户账号',
    value: '',
    name: 'account',
  },
  {
    label: '姓名',
    value: '',
    name: 'name',
  },
  {
    label: '性别',
    value: '',
    name: 'sex',
  },
  {
    label: '联系电话',
    value: '',
    name: 'phone',
  },
  {
    label: '工种',
    value: '',
    name: 'job_type',
  },
  {
    label: '角色',
    value: '',
    name: 'role',
  },
  {
    label: '创建日期',
    value: '',
    name: 'created_at',
  },
  {
    label: '修改日期',
    value: '',
    name: 'updated_at',
  },
].map(item => reactive(item)))

const user_data = reactive([
  {
    label: '用户账号',
    value: '',
    name: 'account',
  },
  {
    label: '姓名',
    value: '',
    name: 'name',
  },
  {
    label: '性别',
    value: '',
    name: 'sex',
  },
  {
    label: '联系电话',
    value: '',
    name: 'phone',
  },
  {
    label: '所属部门',
    value: '',
    name: 'department',
  },
  {
    label: '角色',
    value: '',
    name: 'role',
  },
  {
    label: '创建日期',
    value: '',
    name: 'created_at',
  },
  {
    label: '修改日期',
    value: '',
    name: 'updated_at',
  },
].map(item => reactive(item)))

const admin_data = reactive([
  {
    label: '用户账号',
    value: '',
    name: 'account',
  },
  {
    label: '姓名',
    value: '',
    name: 'name',
  },
  {
    label: '性别',
    value: '',
    name: 'sex',
  },
  {
    label: '联系电话',
    value: '',
    name: 'phone',
  },
  {
    label: '所属部门',
    value: '',
    name: 'department',
  },
  {
    label: '角色',
    value: '',
    name: 'role',
  },
  {
    label: '创建日期',
    value: '',
    name: 'created_at',
  },
  {
    label: '修改日期',
    value: '',
    name: 'updated_at',
  },
].map(item => reactive(item)))

function choose_data() {
  if (useUserStore().role === 'admin')
    return admin_data
  if (useUserStore().role === 'user')
    return user_data
  if (useUserStore().role === 'worker')
    return worker_data
  else
    return user_data
}
const data = choose_data()

watchEffect(async () => {
  const dataFromRes = (await res()).user_info
  Object.assign(resp, dataFromRes)
  Object.keys(dataFromRes).forEach((key) => {
    const item = data.find(item => item.name === key)
    if (item)
      item.value = dataFromRes[key]
  })
})

function onPost() {
  router.push('/user/modify')
}
</script>

<template>
  <div class="flex flex-col justify-center mt-[80px]">
    <a-space class="place-content-center mb-3" size="large">
      <a-descriptions :data="data" :size="size" label="User Info" :column="1" />
      <a-image
        width="200"
        src="/img/head.png"
      />
    </a-space>
    <a-space class="place-content-center">
      <a-button class="ml-7" @click="onPost">
        修改
      </a-button>
    </a-space>
  </div>
</template>
