<script setup lang="ts">
import { useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Message } from '@arco-design/web-vue'
import { IconDelete, IconPlus } from '@arco-design/web-vue/es/icon'

import type { Repair, } from '../../../schema/repair'
import type { User, Worker } from '../../../schema/user'
import { base_url } from '../../../utils/config'
import useUserStore from '../../../store/user'

const route = useRoute()
const repair_id = route.params.id as string
const userStore = useUserStore()
const worker_list = ref<Array<Worker>>([])
const worker_id = ref<string>('')
const { role } = storeToRefs(userStore)
const repair = ref<Repair | null>()
const user = ref<User | null>()
const worker = ref<User | null>()
const admin = ref<User | null>()
const modalVis = ref(false)

const estimateKey = ref('')
const estimateValue = ref(0)
const estimate_receipt = reactive<Array<{
  key: string
  value: number
}>>([])
const estimate_cost = ref(0)

const actualKey = ref('')
const actualValue = ref(0)
const actual_receipt = reactive<Array<{
  key: string
  value: number
}>>([])
const actual_cost = ref(0)
const result = ref("")
const is_free = ref(false)
const rate = ref(5)
const comment = ref('')

function getColor(status: string | undefined) {
  return color[status || '未分配']
}

const color: Record<string, string> = {
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
  await fetchInfo()
})

async function fetchInfo() {
  const resp = await fetch(`${base_url}/repairs/${repair_id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  })
  const payload = await resp.json()

  repair.value = payload.data.repair_info
  user.value = payload.data.user_info
  worker.value = payload.data.worker_info
  admin.value = payload.data.admin_info

  Object.assign(estimate_receipt, payload.data.repair_info.estimate_receipt)
  estimate_cost.value = payload.data.repair_info.estimate_cost
  Object.assign(actual_receipt, payload.data.repair_info.actual_receipt)
  actual_cost.value = payload.data.repair_info.actual_cost
  result.value = payload.data.repair_info.result
  is_free.value = payload.data.repair_info.is_free
  rate.value = payload.data.repair_info.rate
  comment.value = payload.data.repair_info.comment
}

async function showAssignModal() {
  const resp = await fetch(`${base_url}/workers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
  })
  const payload = await resp.json()
  worker_list.value = payload.data.worker_list
  worker_id.value = ''
  modalVis.value = true
}

async function assignWorker() {
  if (worker_id.value === '') {
    Message.info('请选择维修人员')
    return
  }
  await fetch(`${base_url}/assign/${repair_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
    body: JSON.stringify({
      worker_id: worker_id.value,
    }),
  })

  await fetchInfo()
  Message.success('分配成功')
  modalVis.value = false
}

async function acceptTask() {
  await fetch(`${base_url}/accept/${repair_id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${userStore.token}`,
    },
  })

  await fetchInfo()
  Message.success('接单成功')
}

function addItemEstimate() {
  if (estimateKey.value === '') {
    Message.info('请填写完整')
    return
  }

  estimate_receipt.push({
    key: estimateKey.value,
    value: estimateValue.value,
  })

  estimate_cost.value = estimate_receipt.reduce((acc, cur) => acc + cur.value, 0)
  estimateKey.value = ''
  estimateValue.value = 0
}

function removeItemEstimate(index: number) {
  estimate_receipt.splice(index, 1)
  estimate_cost.value = estimate_receipt.reduce((acc, cur) => acc + cur.value, 0)
}

function addItemActual() {
  if (actualKey.value === '') {
    Message.info('请填写完整')
    return
  }

  actual_receipt.push({
    key: actualKey.value,
    value: actualValue.value,
  })

  actual_cost.value = actual_receipt.reduce((acc, cur) => acc + cur.value, 0)
  actualKey.value = ''
  actualValue.value = 0
}

function removeItemActual(index: number) {
  actual_receipt.splice(index, 1)
  actual_cost.value = actual_receipt.reduce((acc, cur) => acc + cur.value, 0)
}

async function saveEstimateReceipt() {
  await fetch(`${base_url}/consult/${repair_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
    body: JSON.stringify({
      estimate_receipt,
      estimate_cost: estimate_cost.value,
    }),
  })

  await fetchInfo()
  Message.success('保存成功')
}

async function acceptEstimateReceipt() {
  await fetch(`${base_url}/consult/${repair_id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  })

  await fetchInfo()
  Message.success('确认成功')
}

async function saveActualReceipt() {
  await fetch(`${base_url}/confirm/${repair_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
    body: JSON.stringify({
      actual_cost: actual_cost.value,
      actual_receipt: actual_receipt,
      is_free: is_free.value,
      result: result.value,
    }),
  })

  await fetchInfo()
  Message.success('保存成功')
}

async function acceptActualReceipt() {
  await fetch(`${base_url}/confirm/${repair_id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  })

  await fetchInfo()
  Message.success('确认成功')
}

async function pay() {
  await fetch(`${base_url}/pay/${repair_id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  })

  await fetchInfo()
  Message.success('支付成功')
}

async function handleRate() {
  await fetch(`${base_url}/rate/${repair_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
    body: JSON.stringify({
      rate: rate.value,
      comment: comment.value,
    }),
  })

  await fetchInfo()
  Message.success('评价完成')
}
</script>

<template>
  <div class="flex flex-col gap-y-4 bg-gray-100">
    <a-card v-if="repair?.step && repair?.step > 0">
      <template #title>
        报修申请单
      </template>
      <template #extra>
        <div class="flex gap-x-4 items-center">
          <a-button type="primary" v-if="!repair?.flags.is_assign && role === 'admin'" @click="showAssignModal()">
            派单
          </a-button>
          <div :style="{ color: getColor(repair?.status) }" class="font-bold">{{ repair?.status }}</div>
        </div>
      </template>
      <div class="mb-2 text-lg font-bold text-black">报修信息</div>
      <a-descriptions layout="inline-vertical" table-layout="fixed" :column="4" align="left">
        <a-descriptions-item label="报修人ID">{{ user?._id }}</a-descriptions-item>
        <a-descriptions-item label="报修人姓名">{{ user?.name }}</a-descriptions-item>
        <a-descriptions-item label="联系方式">{{ user?.phone }}</a-descriptions-item>
        <a-descriptions-item label="报修时间">{{ repair?.request_at }}</a-descriptions-item>
        <a-descriptions-item label="设施地址">{{ repair?.place }}</a-descriptions-item>
        <a-descriptions-item label="报修项目">{{ repair?.type }}</a-descriptions-item>
        <a-descriptions-item label="报修详情">{{ repair?.detail }}</a-descriptions-item>
        <a-descriptions-item label="是否紧急">{{ repair?.is_urgent }}</a-descriptions-item>
      </a-descriptions>
      <div class="my-4 text-lg font-bold text-black">附件图片</div>
      <a-image-preview-group infinite>
        <div class="flex gap-2">
          <a-image v-for="img in repair?.attachment" :key="img" width="120" height="120" fit="cover"
            :src="`${base_url}/${img}`" />
        </div>
      </a-image-preview-group>
    </a-card>

    <a-card v-if="repair?.step && repair?.step > 1">
      <template #title>
        派单记录
      </template>
      <template #extra>
        <div class="flex gap-x-4 items-center">
          <a-button type="primary" v-if="!repair?.flags.is_accept && role === 'worker'" @click="acceptTask">接单</a-button>
          <div :style="{ color: getColor('已接单') }" class="font-bold" v-else>已接单</div>
        </div>
      </template>
      <div class="mb-2 text-lg font-bold text-black">派单人信息</div>
      <a-descriptions layout="inline-vertical" table-layout="fixed" :column="4" align="left">
        <a-descriptions-item label="管理员ID">{{ admin?._id }}</a-descriptions-item>
        <a-descriptions-item label="管理员姓名">{{ admin?.name }}</a-descriptions-item>
        <a-descriptions-item label="联系方式">{{ admin?.phone }}</a-descriptions-item>
        <a-descriptions-item label="派单时间">{{ repair?.assign_at }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card v-if="repair?.step && repair?.step > 2">
      <template #title>
        接单记录
      </template>
      <template #extra>
      </template>
      <div class="mb-2 text-lg font-bold text-black">维修人员信息</div>
      <a-descriptions layout="inline-vertical" table-layout="fixed" :column="4" align="left">
        <a-descriptions-item label="维修人员ID">{{ admin?._id }}</a-descriptions-item>
        <a-descriptions-item label="维修人员姓名">{{ admin?.name }}</a-descriptions-item>
        <a-descriptions-item label="联系方式">{{ admin?.phone }}</a-descriptions-item>
        <a-descriptions-item label="接单时间">{{ repair?.accept_at }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card v-if="repair?.step && repair?.step > 2 && role === 'worker'">
      <template #title>
        评估协商
      </template>
      <template #extra>
        <div class="flex gap-x-4 items-center">
          <a-button type="primary" v-if="!repair?.flags.is_consult && role === 'worker'"
            @click="saveEstimateReceipt">保存</a-button>
          <div :style="{ color: getColor('待协商') }" class="font-bold" v-if="!repair?.flags.is_consult">待协商</div>
          <div :style="{ color: getColor('已协商') }" class="font-bold" v-else>已协商</div>
        </div>
      </template>
      <div class="mb-4 text-lg font-bold text-black">预估费用表</div>
      <div class="font-bold mb-2">总价: {{ estimate_cost }} 元</div>
      <div v-for="(item, index) in estimate_receipt" :key="item.key" class="mb-2">
        <div class="flex gap-x-4">
          <a-input v-model="item.key" readonly :style="{ width: '480px' }" />
          <a-input-number v-model='item.value' readonly hide-button :style="{ width: '160px' }" />
          <a-button type="primary" @click="removeItemEstimate(index)">
            <template #icon>
              <IconDelete />
            </template>
          </a-button>
        </div>
      </div>
      <div class="mb-2 flex gap-x-4">
        <a-input v-model="estimateKey" placeholder="请输入耗材名" allow-clear :style="{ width: '480px' }" />
        <a-input-number v-model="estimateValue" placeholder="请输入(元)" :style="{ width: '160px' }" />
        <a-button type="primary" @click="addItemEstimate">
          <template #icon>
            <IconPlus />
          </template>
        </a-button>
      </div>
    </a-card>

    <a-card v-if="repair?.step && repair?.step > 3 && role === 'user'">
      <template #title>
        评估协商
      </template>
      <template #extra>
        <div class="flex gap-x-4 items-center">
          <a-button type="primary" v-if="!repair?.flags.is_consult && role === 'user'"
            @click="acceptEstimateReceipt">同意</a-button>
          <div :style="{ color: getColor('待协商') }" class="font-bold" v-if="!repair?.flags.is_consult">待协商</div>
          <div :style="{ color: getColor('已协商') }" class="font-bold" v-else>已协商</div>
        </div>
      </template>
      <div class="mb-4 text-lg font-bold text-black">预估费用表</div>
      <div class="font-bold mb-2">总价: {{ repair?.estimate_cost }} 元</div>
      <div v-for="item in repair?.estimate_receipt" :key="item.key" class="mb-2">
        <div class="flex gap-x-4">
          <a-input v-model="item.key" readonly :style="{ width: '480px' }" />
          <a-input-number v-model='item.value' readonly hide-button :style="{ width: '160px' }" />
        </div>
      </div>
    </a-card>

    <a-card v-if="repair?.step && repair?.step > 4 && role === 'worker'">
      <template #title>
        结果确认
      </template>
      <template #extra>
        <div class="flex gap-x-4 items-center">
          <a-button type="primary" v-if="!repair?.flags.is_confirm && role === 'worker'"
            @click="saveActualReceipt">保存</a-button>
          <div :style="{ color: getColor('待协商') }" class="font-bold" v-if="!repair?.flags.is_confirm">待验收</div>
          <div :style="{ color: getColor('已验收') }" class="font-bold" v-else>已验收</div>
        </div>
      </template>
      <div class="mb-4 text-lg font-bold text-black">最终费用表</div>
      <div class="font-bold mb-2">总价: {{ actual_cost }} 元</div>
      <div class="font-bold mb-2">
        <span>是否免费:</span>
        &nbsp;
        <a-switch v-model="is_free" />
      </div>
      <div v-for="(item, index) in actual_receipt" :key="item.key" class="mb-2">
        <div class="flex gap-x-4">
          <a-input v-model="item.key" readonly :style="{ width: '480px' }" />
          <a-input-number v-model='item.value' readonly hide-button :style="{ width: '160px' }" />
          <a-button type="primary" @click="removeItemActual(index)">
            <template #icon>
              <IconDelete />
            </template>
          </a-button>
        </div>
      </div>
      <div class="mb-2 flex gap-x-4">
        <a-input v-model="actualKey" placeholder="请输入耗材名" allow-clear :style="{ width: '480px' }" />
        <a-input-number v-model="actualValue" placeholder="请输入(元)" :style="{ width: '160px' }" />
        <a-button type="primary" @click="addItemActual">
          <template #icon>
            <IconPlus />
          </template>
        </a-button>
      </div>
      <div class="mb-4 text-lg font-bold text-black">维修结果</div>
      <div class="w-[480px]">
        <a-textarea v-model="result" />
      </div>
    </a-card>

    <a-card v-if="repair?.step && repair?.step > 5 && role === 'user'">
      <template #title>
        结果确认
      </template>
      <template #extra>
        <div class="flex gap-x-4 items-center">
          <a-button type="primary" v-if="!repair?.flags.is_confirm && role === 'user'"
            @click="acceptActualReceipt">同意</a-button>
          <div :style="{ color: getColor('待协商') }" class="font-bold" v-if="!repair?.flags.is_confirm">待验收</div>
          <div :style="{ color: getColor('已验收') }" class="font-bold" v-else>已验收</div>
        </div>
      </template>
      <div class="mb-4 text-lg font-bold text-black">最终费用表</div>
      <div class="font-bold mb-2">总价: {{ repair?.actual_cost }} 元</div>
      <div class="font-bold mb-2">是否免费: {{ repair?.is_free ? "是" : "否" }} </div>
      <div v-for="item in repair?.actual_receipt" :key="item.key" class="mb-2">
        <div class="flex gap-x-4">
          <a-input v-model="item.key" readonly :style="{ width: '480px' }" />
          <a-input-number v-model='item.value' readonly hide-button :style="{ width: '160px' }" />
        </div>
      </div>
      <div class="mb-4 text-lg font-bold text-black">维修结果</div>
      <div class="w-[480px] bg-gray-100 min-h-[64px] rounded py-1.5 px-3.5">
        {{ repair?.result }}
      </div>
    </a-card>

    <a-card v-if="repair?.step && repair?.step > 6">
      <template #title>
        账单支付
      </template>
      <template #extra>
        <div class="flex gap-x-4 items-center">
          <a-button type="primary" v-if="!repair?.flags.is_pay && role === 'user'" @click="pay">支付</a-button>
          <div :style="{ color: getColor('待支付') }" class="font-bold" v-if="!repair?.flags.is_pay">待支付</div>
          <div :style="{ color: getColor('已支付') }" class="font-bold" v-else>已支付</div>
        </div>
      </template>
      <div class="mb-4 text-lg font-bold text-black">需要支付: {{ repair?.is_free ? 0 : repair?.actual_cost }} 元</div>
    </a-card>

    <a-card v-if="repair?.step && repair?.step > 7">
      <template #title>
        服务评价
      </template>
      <template #extra>
        <div class="flex gap-x-4 items-center">
          <a-button type="primary" v-if="!repair?.flags.is_rate && role === 'user'" @click="handleRate">评价</a-button>
          <div :style="{ color: getColor('待评价') }" class="font-bold" v-if="!repair?.flags.is_rate">待评价</div>
          <div :style="{ color: getColor('已评价') }" class="font-bold" v-else>已评价</div>
        </div>
      </template>
      <div class="title flex">
        <div class="flex items-begin gap-y-3 flex-1 flex-col">
          <div class="flex items-center gap-x-5">
            <div>满意程度</div>
            <a-rate v-model="rate" allow-half :default-value="5" />
          </div>
          <div class="gap-y-2 flex flex-col">
            <div>评论</div>
            <a-input v-model="comment" placeholder="发表评论" allow-clear />
          </div>
        </div>
      </div>
    </a-card>

    <a-card v-if="repair?.step && repair?.step > 8">
      <template #title>
        服务评价
      </template>
      <template #extra>
        <div class="flex gap-x-4 items-center">
          <div :style="{ color: getColor('待评价') }" class="font-bold" v-if="!repair?.flags.is_rate">待评价</div>
          <div :style="{ color: getColor('已评价') }" class="font-bold" v-else>已评价</div>
        </div>
      </template>
      <div class="title flex">
        <div class="flex items-begin gap-y-3 flex-1 flex-col">
          <div class="flex items-center gap-x-5">
            <div>满意程度</div>
            <a-rate v-model="rate" allow-half readonly />
          </div>
          <div class="gap-y-2 flex flex-col">
            <div>评论</div>
            <a-input v-model="comment" placeholder="发表评论" readonly />
          </div>
        </div>
      </div>
    </a-card>
  </div>



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
.title {
  @apply text-xl font-bold;
}
</style>
