<script setup>
import { useRoute } from 'vue-router'
import { reactive, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { base_url } from '../../../utils/config'

const timing_rate = ref(0)
const quality_rate = ref(0)
const attitude_rate = ref(0)
const repair_id = useRoute('/detail/[id]').params.id
async function res() {
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
const data = reactive((await res()).repair_info)
console.log(data)
const consult = ref(false)

const { is_accept, is_assign, is_confirm, is_consult, is_pay, is_rate, is_repair, is_request } = data.repair_info.flags

const label_order = [
  {
    label: '报修人姓名',
    value: 'name',
  },
  {
    label: '报修人电话',
    value: 'phone',
  },
  {
    label: '报修人部门',
    value: 'department',
  },
  {
    label: '报修地址',
    value: 'address',
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
    label: '管理员ID',
    value: 'admin_id',
  },
  {
    label: '联系电话',
    value: 'worker_phone',
  },
  {
    label: '维修人',
    value: 'worker_name',
  },
  {
    label: '工号',
    value: 'worker_id',
  },
  {
    label: '费用预估',
    value: 'estimated_cost',
  },
]

const label_accept = [
  {
    label: '支付方式',
    value: '线上支付',
  },
  {
    label: '完工人员',
    value: 'worker_name',
  },
  {
    label: '工号',
    value: 'worker_id',
  },
  {
    label: '完工说明',
    value: 'work_info',
  },
  {
    label: '实际费用',
    value: 'actual_cost',
  },
]

// const res = label_order.map((element) => {
//   return {
//     label: element.label,
//     value: data.report_info[element.value],
//   }
// })

const talkover = label_talkover.map((element) => {
  return {
    label: element.label,
    value: data.report_info[element.value],
  }
})

const accept = label_accept.map((element) => {
  return {
    label: element.label,
    value: data.report_info[element.value],
  }
})

const color = {
  已评价: '#3ADC4A',
  未评价: '#D8B024',
  已下单: '#7C7D80',
  未验收: '#FF0E0E',
  已验收: '#3ADC4A',
  未核对: '#FF0E0E',
  已核对: '#3ADC4A',
  协商中: '#D8B024',
}

function verify() {
  status.checked = '已核对'
}

function acceptance() {
  status.acceptance = '已验收'
}

function evaluation() {
  if (timing_rate.value > 0 && quality_rate.value > 0 && attitude_rate.value > 0)
    status.evaluation = '已评价'
}

function consultation() {
  consult.value = false
  status.is_consult = '协商中'
}

const id = useRoute().params.id

function print() {
  if (consult.value)
    status.is_consult = '协商完成'
  else status.is_consult = '协商中'
}
</script>

<template>
  <div class="text-black">
    是否完成协商
    <a-switch v-model="consult" @click="print" />
  </div>
  <a-space direction="vertical" size="large" class="px-2" :style="{ marginBottom: '15px' }">
    <a-card>
      <div :style="{ color: color[data.report_info.status] }" class="title">
        {{ data.report_info.status }}
      </div>
      <a-descriptions :data="res" layout="inline-vertical" table-layout="fixed" column="4" align="left" />
    </a-card>
  </a-space>
  <a-space direction="vertical" :style="{ marginBottom: '15px' }" size="large" class="px-2">
    <a-card>
      <div v-if="status.is_consult === '协商中' && status.checked === '未核对'" :style="{ color: color[(status.is_consult)] }" class="title">
        {{ status.is_consult }}
      </div>
      <div v-else-if="status.is_consult === '协商完成' || status.checked === '已核对'" :style="{ color: color[(status.checked)] }" class="title">
        {{ status.checked }}
      </div>
      <a-descriptions :data="talkover" layout="inline-vertical" table-layout="fixed" column="4" align="left" />
    </a-card>
  </a-space>
  <div :style="{ marginBottom: '15px' }" class="px-2">
    <div v-if="status.checked === '未核对' " class="flex gap-x-3 justify-end">
      <a-button type="primary" :disabled="!consult" @click="verify">
        确认
      </a-button>
      <a-button type="secondary" :disabled="!consult" @click="consultation">
        拒绝
      </a-button>
    </div>
    <a-space v-else>
      <a-card>
        <div v-if="status.is_consult === '协商中' && status.acceptance === '未验收'" :style="{ color: color[(status.is_consult)] }" class="title">
          {{ status.is_consult }}
        </div>
        <div v-else-if="status.is_consult === '协商完成' || status.acceptance === '已验收'" :style="{ color: color[(status.acceptance)] }" class="title">
          {{ status.acceptance }}
        </div>
        <a-descriptions :data="accept" layout="inline-vertical" table-layout="fixed" column="4" align="left" />
      </a-card>
    </a-space>
  </div>
  <div v-if="status.checked === '已核对'" :style="{ marginBottom: '15px' }" class="px-2">
    <div v-if="status.acceptance === '未验收'" class="flex gap-x-3 justify-end">
      <a-button type="primary" :disabled="!consult" @click="acceptance">
        确认并支付
      </a-button>
      <a-button type="secondary" :disabled="!consult" @click="consultation">
        拒绝
      </a-button>
    </div>
    <div v-else>
      <a-card>
        <div :style="{ color: color[(status.evaluation)] }" class="title">
          {{ status.evaluation }}
        </div>
        <div class="title flex">
          <div class="flex items-center gap-x-1 flex-1">
            <div>响应时间</div>
            <div><a-rate v-model="timing_rate" allow-half @change="evaluation" /></div>
          </div>
          <div class="flex items-center gap-x-1 flex-1">
            <div>维修质量</div>
            <a-rate v-model="quality_rate" allow-half @change="evaluation" />
          </div>
          <div class="flex items-center gap-x-1 flex-1">
            <div>服务态度</div>
            <a-rate v-model="attitude_rate" allow-half @change="evaluation" />
          </div>
        </div>
      </a-card>
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
