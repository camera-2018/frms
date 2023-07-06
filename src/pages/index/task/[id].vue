<script setup>
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { base_url } from '../../../utils/config'

const key = ref('')
const value = ref('')
const estimate_receipt = reactive([])
const estimate_cost = ref(0)
const result = ref()
const is_free = ref(false)
const repair_id = useRoute('/order/[id]').params.id
const router = useRouter()
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
</script>

<template>
  <div v-if="data.step === 1">
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
        <div class="flex gap-x-3 justify-center">
          <a-button type="primary" @click="delegate">
            派单
          </a-button>
        </div>
      </a-card>
    </a-space>
  </div>
</template>

<style scoped>
.list_item {
  @apply cursor-pointer;
}
</style>
