<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { base_url } from '../../../utils/config'
import useUserStore from '../../../store/user';

const repair_id = useRoute('/detail/[id]').params.id
const router = useRouter()
const userStore = useUserStore()
async function res_list() {
  const response = await fetch(`${base_url}/repairs/${repair_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
  })
  const data = (await response.json()).data
  return data
}
const data = reactive((await res_list()).repair_info)

const { is_accept, is_assign, is_confirm, is_consult, is_pay, is_rate, is_repair, is_request } = data.flags

async function res_user() {
  const response = await fetch(`${base_url}/user/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
  })
  const data = (await response.json()).data
  return data
}
const user_data = reactive((await res_user()).user_info)

data.name = user_data.name
data.phone = user_data.phone
data.department = user_data.department
data.is_urgent = data.is_urgent ? '是' : '否'
data.is_free = data.is_free ? '是' : '否'
const rate = ref(data.rate)
const comment = ref(data.comment)
const transformedArray_estimate = data.estimate_receipt.map(item => `${item.key}-${item.value}`)
const transformedArray_actual = data.actual_receipt.map(item => `${item.key}-${item.value}`)

async function consult() {
  const response = await fetch(`${base_url}/consult/${repair_id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${useStorage('token').value}`,
    },
  })
  const data = (await response.json()).data
  await router.back()
  return data
}
async function last_consult() {
  const response = await fetch(`${base_url}/confirm/${repair_id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${useStorage('token').value}`,
    },
  })
  const data = (await response.json()).data
  await router.back()
  return data
}

async function pay() {
  const response = await fetch(`${base_url}/pay/${repair_id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${useStorage('token').value}`,
    },
  })
  const data = (await response.json()).data
  await router.back()
  return data
}

async function rate_comment() {
  const response = await fetch(`${base_url}/rate/${repair_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useStorage('token').value}`,
    },
    body: JSON.stringify({
      rate: rate.value,
      comment: comment.value,
    }),
  })
  const data = (await response.json()).data
  await router.back()
  return data
}

function confirm() {
  consult()
}

function last_confirm() {
  last_consult()
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
    label: '管理员ID',
    value: 'admin_id',
  },
  {
    label: '工作人员ID',
    value: 'worker_id',
  },
  {
    label: '费用预估',
    value: 'estimate_cost',
  },
]

const label_accept = [
  {
    label: '完工人员',
    value: 'worker_id',
  },
  {
    label: '完工时间',
    value: 'finish_at',
  },
  {
    label: '是否免费',
    value: 'is_free',
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
</script>

<template>
  <a-space direction="vertical" size="large" class="px-2 mb-[15px] mt-2">
    <a-card>
      <div v-if="data.step <= 2" :style="{ color: color[data.status] }" class="title">
        {{ data.status }}
      </div>
      <div v-else-if="data.step > 2" :style="{ color: color['已下单'] }" class="title">
        已下单
      </div>
      <a-descriptions :data="order" layout="inline-vertical" table-layout="fixed" column="4" align="left" />
      <br>
      <a-space v-if="data.attachment.length !== 0" class="px-5">
        <div>报修图片</div>
        <a-image-preview-group infinite>
          <a-image v-for="i in data.attachment" :key="i" width="200" :src="i[0] === 'u' ? `${base_url}/${i}` : i" />
        </a-image-preview-group>
      </a-space>
    </a-card>
  </a-space>
  <a-space v-if="data.step > 2" direction="vertical" :style="{ marginBottom: '15px' }" size="large" class="px-2">
    <a-card>
      <div v-if="data.step === 3 || data.step === 4" :style="{ color: color[(data.status)] }" class="title">
        {{ data.status }}
      </div>
      <div v-else-if="data.step > 4" :style="{ color: color['已协商'] }" class="title">
        已协商
      </div>
      <a-descriptions v-if="data.step >= 4" :data="talkover" layout="inline-vertical" table-layout="fixed" column="4"
        align="left" />
      <br>
      <a-space v-if="data.attachment.length !== 0" class="px-5">
        <div>报修图片</div>
        <a-image-preview-group infinite>
          <a-image v-for="i in data.attachment" :key="i" width="200" :src="i[0] === 'u' ? `${base_url}/${i}` : i" />
        </a-image-preview-group>
      </a-space>
      <div class="flex flex-col px-5 mt-2 gap-y-2">
        预期耗材
        <a-input-tag v-model="transformedArray_estimate" placeholder="耗材详情" allow-clear readonly />
      </div>
    </a-card>
  </a-space>
  <div :style="{ marginBottom: '15px' }" class="px-2">
    <div v-if="data.step === 4" class="flex gap-x-3 justify-end">
      <a-button type="primary" @click="confirm()">
        确认
      </a-button>
    </div>
    <a-space v-else-if="data.step > 4">
      <a-card>
        <div v-if="data.step === 5 || data.step === 6 || data.step === 7" :style="{ color: color[(data.status)] }"
          class="title">
          {{ data.status }}
        </div>
        <div v-if="data.step > 7" :style="{ color: color['已支付'] }" class="title">
          已支付
        </div>
        <a-descriptions v-if="data.step >= 6" :data="accept" layout="inline-vertical" table-layout="fixed" column="4"
          align="left" />
        <a-descriptions layout="inline-vertical">
          <a-descriptions-item label="完工说明">
            {{ data.comment }}
          </a-descriptions-item>
        </a-descriptions>
        <br>
        <a-space v-if="data.attachment.length !== 0" class="px-5">
          <div>报修图片</div>
          <a-image-preview-group infinite>
            <a-image v-for="i in data.attachment" :key="i" width="200" :src="i[0] === 'u' ? `${base_url}/${i}` : i" />
          </a-image-preview-group>
        </a-space>
        <div class="flex flex-col px-5 mt-2 gap-y-2">
          实际耗材
          <a-input-tag v-model="transformedArray_actual" placeholder="耗材详情" allow-clear readonly />
        </div>
      </a-card>
    </a-space>
  </div>
  <div :style="{ marginBottom: '15px' }" class="px-2">
    <div v-if="data.step === 6" class="flex gap-x-3 justify-end">
      <a-button type="primary" @click="last_confirm()">
        确认
      </a-button>
    </div>
    <div v-if="data.step === 7" class="flex gap-x-3 justify-end">
      <a-button type="primary" @click="pay">
        支付
      </a-button>
    </div>
    <div v-if="data.step > 7">
      <a-card>
        <div :style="{ color: color[(data.status)] }" class="title">
          {{ data.status }}
        </div>
        <div class="title flex">
          <div class="flex items-begin gap-y-3 flex-1 flex-col">
            <div class="flex items-center gap-x-5">
              <div>满意程度</div>
              <a-rate v-model="rate" allow-half default-value="2.5" />
            </div>
            <div class="gap-y-2 flex flex-col">
              <div>评论</div>
              <a-input v-model="comment" placeholder="发表评论" allow-clear />
            </div>
          </div>
        </div>
        <div v-if="data.step === 8" class="flex gap-x-3 justify-end">
          <a-button type="primary" @click="rate_comment">
            提交
          </a-button>
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

.title {
  @apply text-[16px];
  padding-bottom: 10px;
  padding-left: 20px;
  font-weight: bold;
}
</style>
