<script setup>
import { useRoute } from 'vue-router'

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
  },
  actual_info: 'cillum ut in',
  estimate_info: 'dolore sint dolore',
  assign_info: {
    is_talkover: false,
    acceptance: false,
  },
  comment_info: 'officia exercitation Ut sunt ea',
  status: 'esse laboris cillum ea sunt',
  created_at: '2015-01-13 07:41:26',
  updated_at: '2020-04-29 13:30:05',
}

const status = {
  checked: data.assign_info.is_talkover ? '已核对' : '未核对',
  acceptance: data.assign_info.acceptance ? '已验收' : '未验收',
}

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

function get_status() {
  judgment_status = data.report_info.status
  return judgment_status
}

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

const color = {
  已评价: '#3ADC4A',
  未评价: '#D8B024',
  已下单: '#7C7D80',
  未验收: '#FF0E0E',
  已验收: '#3ADC4A',
  未核对: '#D8B024',
  已核对: '#3ADC4A',
}

function verify() {
  status.checked = '已核对'
}

const id = useRoute().params.id
</script>

<template>
  {{ id }}
  <a-space direction="vertical" size="large" class="px-2">
    <a-card>
      <div :style="{ color: color[data.report_info.status] }" class="title">
        {{ data.report_info.status }}
      </div>
      <a-descriptions :data="res" layout="inline-vertical" table-layout="fixed" column="4" align="left" />
    </a-card>
  </a-space>
  <a-space direction="vertical">
    <a-space direction="vertical" size="large" class="px-2">
      <a-card>
        <div :style="{ color: color[(status.checked)] }" class="title">
          {{ status.checked }}
        </div>
        <a-descriptions :data="talkover" layout="inline-vertical" table-layout="fixed" column="4" align="left" />
      </a-card>
    </a-space>
  </a-space>
  <a-space>
    <a-space v-if="status.checked === '未核对'">
      <a-button type="primary" @click="verify">
        确认
      </a-button>
    </a-space>
  </a-space>
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
