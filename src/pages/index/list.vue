<script setup lang="ts">
import { ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { base_url } from '../../utils/config'
import useUserStore from '../../store/user'
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { Repair } from '../../schema/repair';

const router = useRouter()
const userStore = useUserStore()

const repair_list = ref<Array<Repair>>([])

const color = {
  待提交: '#000000',
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

function pushto(id: any) {
  if (userStore.role === 'worker') {
    router.push(`/order/${id}`)
  }
  else {
    router.push(`/detail/${id}`)
  }

}

onMounted(async () => {
  const resp = await fetch(`${base_url}/repairs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
  })
  const payload = await resp.json()
  repair_list.value = payload.data.repair_list.filter((repair: Repair) => repair.status !== '待提交')
})
</script>

<template>
  <a-list :hoverable="true">
    <a-list-item class="list_title">
      <a-list-item-meta title="故障详情" description="报修时间 报修地点" />
      <template #actions>
        <div :style="{ color: '#7C7D80' }">
          报修状态
        </div>
      </template>
    </a-list-item>
    <a-list-item v-for="element in repair_list" :key="element._id" class="list_item" @click="pushto(element._id)">
      <a-list-item-meta :title="element.detail"
        :description="`${useDateFormat(element.updated_at, 'YYYY-MM-DD HH:mm:ss').value}\t${element.place}`" />
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

.list_item:hover {
  background-color: rgb(243 244 246)
}

.list_title {
  background-color: rgb(186 230 253);
}

.list_title:hover {
  background-color: rgb(186 230 253);
}
</style>
