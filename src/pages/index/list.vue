<script setup>
import { reactive } from 'vue'
import { useDateFormat, useStorage } from '@vueuse/core'
import { base_url } from '../../utils/config'
import useUserStore from '../../store/user'

const router = useRouter()
async function res() {
  const response = await fetch(`${base_url}/repairs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useStorage('token').value}`,
    },
  })
  const data = (await response.json()).data
  return data
}

let repair_list = reactive([])

repair_list = (await res()).repair_list.filter(repair => repair.status !== '待提交')

const color = {
  已评价: '#3ADC4A',
  未评价: '#D8B024',
  已下单: '#7C7D80',
  未验收: '#FF0E0E',
  未核对: '#D8B024',
  已完成: '#000000',
  待派单: '#7C7D80',
  待接单: '#7C7D80',
  待协商: '#FF9800',
  维修中: '#2196F3',
  待验收: '#FF0E0E',
  待支付: '#9C27B0',
  待评价: '#D8B024',
  已分配: '#3ADC4A',
  未分配: '#FF0E0E',
}

function is_worker() {
  return useUserStore().role === 'worker'
}

function pushto(id) {
  if (!is_worker())
    router.push(`/detail/${id}`)
  else
    router.push(`/order/${id}`)
}
</script>

<template>
  <a-list hoverable="true">
    <a-list-item class="list_title">
      <a-list-item-meta
        title="故障详情"
        description="报修时间 报修地点"
      />
      <template #actions>
        <div :style="{ color: '#7C7D80' }">
          报修状态
        </div>
      </template>
    </a-list-item>
    <a-list-item
      v-for="element in repair_list"
      :key="element._id"
      class="list_item"
      @click="pushto(element._id)"
    >
      <a-list-item-meta
        :title="element.detail"
        :description="`${useDateFormat(element.updated_at, 'YYYY-MM-DD HH:mm:ss').value}    ${element.place}`"
      />
      <template #actions>
        <div :style="{ color: color[element.status] }">
          {{ element.status }}
        </div>
      </template>
    </a-list-item>
  </a-list>
</template>

<style scoped>
.list_item {
  @apply cursor-pointer;
}
.list_title {
  @apply bg-blue-100 hover:bg-blue-100
}
</style>
