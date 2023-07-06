<script setup>
import { reactive, ref } from 'vue'
import { useDateFormat, useStorage } from '@vueuse/core'
import { base_url } from '../../utils/config'

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
repair_list = (await res()).repair_list
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
  const response = await fetch(`${base_url}/assign/${repair_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useStorage('token').value}`,
    },
    body: JSON.stringify({
      worker_id: assign_id.value,
    }),
  })
  const data = (await response.json()).data
  return data
}

const workers = [
  {
    id: '1',
    name: '张三',
    type: '水电工',
  },
  {
    id: '2',
    name: '李四',
    type: '木工',
  },
]

const index = ref(0)

function assign_confirm() {
  // assign_it()
  pick_up_modal.value = false
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
      <a-radio-group v-model="checkedValue">
        <a-grid cols="2" col-gap="36">
          <a-grid-item v-for="worker in workers" :key="index">
            <a-radio v-model="index" :value="worker.id">
              <div class="flex">
                <div>
                  {{ `${worker.name}-${worker.type}-${worker.id}` }}
                </div>
              </div>
            </a-radio>
          </a-grid-item>
        </a-grid>
      </a-radio-group>
    </div>
  </a-modal>
</template>

<style scoped>
.list_item {
  @apply cursor-pointer;
}
</style>
