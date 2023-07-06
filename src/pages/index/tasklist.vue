<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useDateFormat, useStorage } from '@vueuse/core'
import { base_url } from '../../utils/config'
import useUserStore from '../../store/user';
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useUserStore()
const worker_id = ref('')
async function res() {
  const response = await fetch(`${base_url}/repairs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
  })
  const data = (await response.json()).data
  return data
}

async function res_worker() {
  const response = await fetch(`${base_url}/workers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
  })
  const data = (await response.json()).data
  return data
}

let repair_list = reactive([])
repair_list = (await res()).repair_list

const workers = reactive(await res_worker()).worker_list

const assign_id = ref('')
const pick_up_modal = ref(false)
const checkedValue = ref()

const color = {
  待接单: '#D8B024',
  待协商: '#D8B024',
  维修中: '#D8B024',
  待验收: '#D8B024',
  待支付: '#D8B024',
  待评价: '#D8B024',
  已完成: '#3ADC4A',
  待派单: '#FF0E0E',
}

function pushto(id) {
  router.push(`/detail/${id}`)
}

function assign(id) {
  assign_id.value = id
  pick_up_modal.value = true
}

async function assign_it() {
  const response = await fetch(`${base_url}/assign/${assign_id.value}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useStorage('token').value}`,
    },
    body: JSON.stringify({
      worker_id: worker_id.value,
    }),
  })
  const data = (await response.json()).data
  return data
}

const check = ref()

function assign_confirm() {
  if (worker_id.value === '')
    return

  assign_it()
  pick_up_modal.value = false
  worker_id.value = ''
}
</script>

<template>
  <a-list>
    <a-list-item>
      <a-list-item-meta
        title="故障详情"
        description="报修单号 报修时间 报修地点"
      />
      <template #actions>
        <div :style="{ color: '#7C7D80' }">
          报修状态
        </div>
        <div :style="{ color: '#7C7D80' }">
          安排维修人员
        </div>
        <div :style="{ color: '#7C7D80' }">
          查看流程
        </div>
      </template>
    </a-list-item>
    <a-list-item v-for="element in repair_list" :key="element.__id" class="list_item" hoverable>
      <a-list-item-meta
        :title="element.detail"
        :description="`${element._id}   ${useDateFormat(element.updated_at, 'YYYY-MM-DD HH:mm:ss').value}    ${element.place}`"
      />
      <template #actions>
        <div :style="{ color: color[element.status] }" class="items-center">
          {{ element.status }}
        </div>
        <div>
          <a-button type="primary" @click="assign(element._id)">
            安排
          </a-button>
        </div>
        <div>
          <a-button @click="pushto(element._id)">
            查看
          </a-button>
        </div>
      </template>
    </a-list-item>
  </a-list>
  <a-modal :visible="pick_up_modal" @cancel="pick_up_modal = false">
    <template #title>
      <div class="flex flex-grow text-base font-semibold">
        <div>分配维修人员</div>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-x-2 flex-grow justify-end">
        <a-button type="secondary" @click="pick_up_modal = false">
          取消
        </a-button>
        <a-button type="primary" @click="assign_confirm">
          确认
        </a-button>
      </div>
    </template>
    <div>
      <a-radio-group v-model="worker_id">
        <a-radio v-for="worker in workers" :value="worker._id">
          <div>
            {{ `${worker.job_type}-${worker._id}-${worker.name}` }}
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
</style>
