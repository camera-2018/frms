<script setup lang="ts">
import { ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { base_url } from '../../utils/config'
import useUserStore from '../../store/user'
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { Repair } from '../../schema/repair';
import { storeToRefs } from 'pinia';
import type { Worker } from '../../schema/user'
import { Message } from '@arco-design/web-vue';

const router = useRouter()
const userStore = useUserStore()
const { role } = storeToRefs(userStore)

const repair_list = ref<Array<Repair>>([])
const worker_list = ref<Array<Worker>>([])
const modalVis = ref(false)
const repair_id = ref()
const worker_id = ref('')


function pushto(id: any) {
  if (userStore.role === 'worker') {
    router.push(`/order/${id}`)
  }
  else {
    router.push(`/detail/${id}`)
  }

}

async function fetchList(){
  const resp = await fetch(`${base_url}/repairs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
  })
  const payload = await resp.json()
  repair_list.value = payload.data.repair_list.filter((repair: Repair) => repair.status !== '待提交')
}

async function showAssignModal(id: string) {
  const resp = await fetch(`${base_url}/workers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
  })
  const payload = await resp.json()
  worker_list.value = payload.data.worker_list

  repair_id.value = id
  worker_id.value = ''
  modalVis.value = true
}

async function assignWorker() {
  if (worker_id.value === '') {
    Message.info('请选择维修人员')
    return
  }
  await fetch(`${base_url}/assign/${repair_id.value}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
    body: JSON.stringify({
      worker_id: worker_id.value,
    }),
  })

  await fetchList()

  Message.success('分配成功')
  modalVis.value = false
}

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

onMounted(async () => {
  await fetchList()
})
</script>

<template>
  <a-list :hoverable="true">
    <template #header>
      <div class="flex items-center">
        <div class="flex-grow">
          <div>故障详情</div>
          <div class="text-sm text-gray-500 flex gap-x-2">
            <span>报修时间</span>
            <span>报修地点</span>
          </div>
        </div>
        <div class="flex gap-x-2">
          这里有什么编表头的必要吗？
        </div>
      </div>
    </template>
    <a-list-item v-for="element in repair_list" :key="element._id" class="list_item">
      <a-list-item-meta :title="element.detail"
        :description="`${useDateFormat(element.updated_at, 'YYYY-MM-DD HH:mm:ss').value}\t${element.place}`" />
      <template #actions>
        <div class="flex items-center gap-x-6">
          <a-tag :color="color[element.status]">
            {{ element.status }}
          </a-tag>
          <div class="flex items-center gap-x-2">
            <a-button type="primary" @click="showAssignModal(element._id)" v-if="role === 'admin'">
              派单
            </a-button>
            <a-button @click="pushto(element._id)">
              查看详情
            </a-button>
          </div>
        </div>
      </template>
    </a-list-item>
  </a-list>
  <a-modal :visible="modalVis" @cancel="modalVis = false">
    <template #title>
      <div class="flex items-center flex-grow gap-x-2">
        <span>分配维修人员</span>
        <span class="text-sm text-gray-400">报修单{{ repair_id }}</span>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-x-2 flex-grow justify-end">
        <a-button type="secondary" @click="modalVis = false">
          取消
        </a-button>
        <a-button type="primary" @click="assignWorker">
          确认
        </a-button>
      </div>
    </template>
    <div>
      <a-radio-group v-model="worker_id">
        <a-radio v-for="worker in worker_list" :value="worker._id">
          <div>
            <span>{{ worker.job_type }} {{ worker.name }}({{ worker.sex }})</span>
            &nbsp;
            <span class="text-xs text-gray-400">{{ worker._id }}</span>
          </div>
        </a-radio>
      </a-radio-group>
    </div>
  </a-modal>
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
