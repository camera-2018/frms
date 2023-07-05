<script setup>
import { useRoute } from 'vue-router'
import { reactive, ref } from 'vue'

const data = {
  report_info: {
    repair_id: '3',
    updated_at: '1688348336',
    created_at: '1688348336',
    comment: '条明构那入更家内地点图子人北列大。',
    score: '5.36039',
    result: '半委解化社装手加根做矿至价然效参式例。明北导所克飞水员进院步育空相适准。至主程象很边众矿合达深水利完已你层动。',
    finish_time: '1688348336',
    address: '从解出品太即至强劳之因干原上。',
    request_time: '1688348336',
    is_urgent: 'false',
    worker_id: '4',
    worker_name: '李明',
    admin_id: '5',
    user_id: '6',
    detail: '局石易增细军力但据格民教场。',
    type: '玻璃类',
    assign_time: '1688348336',
    status: '已下单',
    id: '7',
    account: 'Larry',
    name: '韩杰',
    sex: '女',
    phone: '18191821238',
    worker_phone: '18191821238',
    department: '己',
    role: 'admin',
    estimated_cost: '0.0',
    actual_cost: '0.0',
    work_info: '已维修',
  },
  actual_info: 'cillum ut in',
  estimate_info: 'dolore sint dolore',
  assign_info: {
    talkover: false,
    acceptance: false,
    evaluation: false,
  },
  comment_info: 'officia exercitation Ut sunt ea',
  status: 'esse laboris cillum ea sunt',
  created_at: '2015-01-13 07:41:26',
  updated_at: '2020-04-29 13:30:05',
}

const timing_rate = ref(0)
const quality_rate = ref(0)
const attitude_rate = ref(0)

const consult = ref(false)

const status = reactive({
  checked: data.assign_info.talkover ? '已核对' : '未核对',
  acceptance: data.assign_info.acceptance ? '已验收' : '未验收',
  evaluation: data.assign_info.evaluation ? '已评价' : '未评价',
  consult: consult.value ? '协商完成' : '协商中',
})

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

const res = label_order.map((element) => {
  return {
    label: element.label,
    value: data.report_info[element.value],
  }
})

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
  status.consult = '协商中'
}

const id = useRoute().params.id

function print() {
  if (consult.value)
    status.consult = '协商完成'
  else status.consult = '协商中'
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
      <div v-if="status.consult === '协商中' && status.checked === '未核对'" :style="{ color: color[(status.consult)] }" class="title">
        {{ status.consult }}
      </div>
      <div v-else-if="status.consult === '协商完成' || status.checked === '已核对'" :style="{ color: color[(status.checked)] }" class="title">
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
        <div v-if="status.consult === '协商中' && status.acceptance === '未验收'" :style="{ color: color[(status.consult)] }" class="title">
          {{ status.consult }}
        </div>
        <div v-else-if="status.consult === '协商完成' || status.acceptance === '已验收'" :style="{ color: color[(status.acceptance)] }" class="title">
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
