<script setup>
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { IconDelete, IconPlus } from '@arco-design/web-vue/es/icon'
import { base_url } from '../../../utils/config'

const repair_id = useRoute('/order/[id]').params.id
const router = useRouter()
async function res_list() {
  const response = await fetch(`${base_url}/repairs/${repair_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useStorage('token').value}`,
    },
  })
  const data = (await response.json()).data
  return data
}
const data = reactive((await res_list()).repair_info)

async function user() {
  const response = await fetch(`${base_url}/user/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useStorage('token').value}`,
    },
  })
  const data = (await response.json()).data
  return data
}
const user_data = reactive((await user()).user_info)

data.name = user_data.name
data.phone = user_data.phone
data.is_urgent = data.is_urgent ? '是' : '否'

const key = ref('')
const value = ref('')
const estimate_receipt = reactive([])
const estimate_cost = ref(0)
const result = ref()
const is_free = ref(false)

async function acceptance() {
  const response = await fetch(`${base_url}/accept/${repair_id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${useStorage('token').value}`,
    },
  })
  const data = (await response.json()).data
  await router.back()
  return data
}

async function estimate() {
  const response = await fetch(`${base_url}/consult/${repair_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useStorage('token').value}`,
    },
    body: JSON.stringify({
      estimate_cost: estimate_cost.value,
      estimate_receipt,
    }),
  })
  const data = (await response.json()).data
  await router.back()
  return data
}

async function actual() {
  const response = await fetch(`${base_url}/confirm/${repair_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useStorage('token').value}`,
    },
    body: JSON.stringify({
      actual_cost: estimate_cost.value,
      actual_receipt: estimate_receipt,
      is_free: is_free.value,
      result: result.value,
    }),
  })
  const data = (await response.json()).data
  await router.back()
  return data
}

const label_order = [
  {
    label: '报修人ID',
    value: 'user_id',
  },
  {
    label: '报修地址',
    value: 'place',
  },
  {
    label: '报修项目',
    value: 'type',
  },
  {
    label: '是否紧急',
    value: 'is_urgent',
  },
  {
    label: '报修详情',
    value: 'detail',
  },
]

const label_talkover = [
  {
    label: '工作人员',
    value: 'name',
  },
  {
    label: '联系电话',
    value: 'phone',
  },
  {
    label: '报修地址',
    value: 'place',
  },
  {
    label: '报修项目',
    value: 'type',
  },
  {
    label: '是否紧急',
    value: 'is_urgent',
  },
  {
    label: '报修详情',
    value: 'detail',
  },
  {
    label: '工号',
    value: 'worker_id',
  },
]

const label_accept = [
  {
    label: '报修人',
    value: 'user_id',
  },
  {
    label: '报修内容',
    value: 'detail',
  },
  {
    label: '报修地址',
    value: 'place',
  },
  {
    label: '负责人',
    value: 'admin_id',
  },
  {
    label: '完工人员',
    value: 'worker_id',
  },
  {
    label: '完工时间',
    value: 'finish_at',
  },
  {
    label: '预计费用',
    value: 'estimate_cost',
  },
  {
    label: '实际费用',
    value: 'actual_cost',
  },
]

const order = label_order.map((element) => {
  return {
    label: element.label,
    value: data[element.value],
  }
})

const talkover = label_talkover.map((element) => {
  return {
    label: element.label,
    value: data[element.value],
  }
})

const accept = label_accept.map((element) => {
  return {
    label: element.label,
    value: data[element.value],
  }
})
const index = ref()

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

function addmaterial() {
  if (key.value === '' || value.value === '')
    return
  estimate_receipt.push({
    key: key.value,
    value: value.value,
  })
  estimate_cost.value += Number(value.value)
  key.value = ''
  value.value = ''
}

function deletematerial(index) {
  estimate_receipt.splice(index, 1)
  estimate_cost.value -= Number(estimate_receipt[index].value)
}
</script>

<template>
  <div class="mt-2">
    <div v-if="data.step === 2">
      <a-space direction="vertical" size="large" class="px-2" :style="{ marginBottom: '15px' }">
        <a-card>
          <div :style="{ color: color[data.status] }" class="title">
            {{ data.status }}
          </div>
          <a-descriptions :data="order" layout="inline-vertical" table-layout="fixed" column="4" align="left" />
          <br>
          <a-space v-if="data.attachment.length !== 0" class="px-6">
            <div>报修图片</div>
            <a-image-preview-group infinite>
              <a-image
                v-for="i in data.attachment"
                :key="i"
                width="200"
                :src="i[0] === 'u' ? `${base_url}/${i}` : i"
              />
            </a-image-preview-group>
          </a-space>
        </a-card>
      </a-space>
      <div class="flex gap-x-3 justify-center">
        <a-button type="primary" @click="acceptance">
          确认出勤
        </a-button>
      </div>
    </div>
    <div v-if="data.step === 3">
      <a-space direction="vertical" size="large" class="px-2" :style="{ marginBottom: '15px' }">
        <a-card>
          <div :style="{ color: color[data.status] }" class="title">
            {{ data.status }}
          </div>
          <a-descriptions :data="talkover" layout="inline-vertical" table-layout="fixed" column="4" align="left" />
          <br>
          <a-space v-if="data.attachment.length !== 0" class="px-6">
            <div>报修图片</div>
            <a-image-preview-group infinite>
              <a-image
                v-for="i in data.attachment"
                :key="i"
                width="200"
                :src="i[0] === 'u' ? `${base_url}/${i}` : i"
              />
            </a-image-preview-group>
          </a-space>
          <div class="flex gap-x-20 px-5 ">
            <div class="flex flex-col flex-1">
              耗材详情
            </div>
            <div class="flex  flex-col flex-1 translate-x-60">
              耗材费用
            </div>
          </div>
          <div v-for="item in estimate_receipt" :key="item" class="flex gap-x-20 px-5 mt-2">
            <div class="flex flex-col  flex-1">
              <a-input :placeholder="item.key" allow-clear readonly />
            </div>
            <div class="flex  flex-col ">
              <a-input-number :placeholder="item.value" class="input-demo" readonly />
            </div>
            <div class="flex items-center gap-x-1 ">
              <a-button type="primary" @click="deletematerial(index)">
                <template #icon>
                  <IconDelete />
                </template>
              </a-button>
            </div>
          </div>
          <div class="flex gap-x-20 px-5 mt-2">
            <div class="flex flex-col  flex-1">
              <a-input v-model="key" placeholder="请输入耗材名" allow-clear />
            </div>
            <div class="flex  flex-col ">
              <a-input-number v-model="value" placeholder="请输入(元)" class="input-demo" />
            </div>
            <div class="flex items-center gap-x-1">
              <a-button type="primary" @click="addmaterial">
                <template #icon>
                  <IconPlus />
                </template>
              </a-button>
            </div>
          </div>
        </a-card>
      </a-space>
      <div class="flex gap-x-3 justify-center">
        <a-button type="primary" @click="estimate">
          提交
        </a-button>
      </div>
    </div>
    <div v-if="data.step === 4">
      <a-space direction="vertical" size="large" class="px-2" :style="{ marginBottom: '15px' }">
        <a-card>
          <div :style="{ color: color[data.status] }" class="title">
            {{ data.status }}
          </div>
          <a-descriptions :data="order" layout="inline-vertical" table-layout="fixed" column="4" align="left" />
          <br>
          <a-space v-if="data.attachment.length !== 0" class="px-6">
            <div>报修图片</div>
            <a-image-preview-group infinite>
              <a-image
                v-for="i in data.attachment"
                :key="i"
                width="200"
                :src="i[0] === 'u' ? `${base_url}/${i}` : i"
              />
            </a-image-preview-group>
          </a-space>
        </a-card>
      </a-space>
    </div>
    <div v-if="data.step === 5">
      <a-space direction="vertical" size="large" class="px-2" :style="{ marginBottom: '15px' }">
        <a-card>
          <div :style="{ color: color[data.status] }" class="title">
            {{ data.status }}
          </div>
          <a-descriptions :data="talkover" layout="inline-vertical" table-layout="fixed" column="4" align="left" />
          <br>
          <a-space v-if="data.attachment.length !== 0" class="px-6">
            <div>报修图片</div>
            <a-image-preview-group infinite>
              <a-image
                v-for="i in data.attachment"
                :key="i"
                width="200"
                :src="i[0] === 'u' ? `${base_url}/${i}` : i"
              />
            </a-image-preview-group>
          </a-space>
          <div class="px-5 mt-2 mb-2 flex gap-x-10">
            <div class="flex flex-col ">
              是否免费
              <a-switch v-model="is_free" />
            </div>
            <div class="flex flex-col flex-1">
              维修结果
              <a-input v-model="result" placeholder="请输入维修结果" allow-clear />
            </div>
          </div>
          <div class="flex gap-x-20 px-5 ">
            <div class="flex flex-col flex-1">
              耗材详情
            </div>
            <div class="flex  flex-col flex-1 translate-x-60">
              耗材费用
            </div>
          </div>
          <div v-for="item in estimate_receipt" :key="item" class="flex gap-x-20 px-5 mt-2">
            <div class="flex flex-col  flex-1">
              <a-input :placeholder="item.key" allow-clear readonly />
            </div>
            <div class="flex  flex-col ">
              <a-input-number :placeholder="item.value" class="input-demo" readonly />
            </div>
            <div class="flex items-center gap-x-1 ">
              <a-button type="primary" @click="deletematerial(index)">
                <template #icon>
                  <IconDelete />
                </template>
              </a-button>
            </div>
          </div>
          <div class="flex gap-x-20 px-5 mt-2">
            <div class="flex flex-col  flex-1">
              <a-input v-model="key" placeholder="请输入耗材名" allow-clear />
            </div>
            <div class="flex  flex-col ">
              <a-input-number v-model="value" placeholder="请输入(元)" class="input-demo" />
            </div>
            <div class="flex items-center gap-x-1">
              <a-button type="primary" @click="addmaterial">
                <template #icon>
                  <IconPlus />
                </template>
              </a-button>
            </div>
          </div>
        </a-card>
      </a-space>
      <div class="flex gap-x-3 justify-center">
        <a-button type="primary" @click="actual">
          提交
        </a-button>
      </div>
    </div>
    <div v-if="data.step > 5">
      <a-space direction="vertical" size="large" class="px-2" :style="{ marginBottom: '15px' }">
        <a-card>
          <div :style="{ color: color[data.status] }" class="title">
            {{ data.status }}
          </div>
          <a-descriptions :data="accept" layout="inline-vertical" table-layout="fixed" column="4" align="left" />
          <br>
          <a-space v-if="data.attachment.length !== 0" class="px-6">
            <div>报修图片</div>
            <a-image-preview-group infinite>
              <a-image
                v-for="i in data.attachment"
                :key="i"
                width="200"
                :src="i[0] === 'u' ? `${base_url}/${i}` : i"
              />
            </a-image-preview-group>
          </a-space>
          <div v-if="data.step > 8" class="title flex flex-col gap-y-3 mt-3">
            <div class="flex items-center gap-x-5 ">
              <div>用户满意程度</div>
              <a-rate v-model="data.rate" allow-half readonly />
            </div>
            <div class="gap-y-3 flex-col items-center">
              <div class="mb-3">
                用户评论
              </div>
              <a-input v-model="data.comment" placeholder="发表评论" readonly />
            </div>
          </div>
        </a-card>
      </a-space>
    </div>
  </div>
</template>

<style>
.arco-descriptions-title {
  @apply text-[16px];
}

.arco-descriptions {
  @apply px-[20px];
}

.title{
  @apply text-[16px];
  padding-bottom: 10px;
  padding-left: 20px;
  font-weight: bold;
}
</style>
