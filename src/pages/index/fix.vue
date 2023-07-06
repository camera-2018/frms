<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { base_url } from '../../utils/config'

const router = useRouter()

const current = ref(1)

const form = reactive({
  type: '',
  is_urgent: false,
  detail: '',
  place: '',
  attachment: [],
})
async function res() {
  const response = await fetch(`${base_url}/repairs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${useStorage('token').value}`,
    },
  })
  const data = (await response.json()).data
  return data
}
const repair_id = reactive((await res()).repair_info._id)

async function res1() {
  const response = await fetch(`${base_url}/request/${repair_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useStorage('token').value}`,
    },
    body: JSON.stringify(form),
  })
  const data = (await response.json()).data
  return data
}

const isCommit = ref(false)

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

async function handleSubmit({ values, errors }) {
  await res1()
  if (!errors)
    current.value = 2
  else
    current.value = 1
}

function onPret() {
  current.value = Math.max(1, current.value - 1)
}

function setCurrent(new_current) {
  current.value = new_current
}

function onReset() {
  form.type = ''
  form.is_urgent = false
  form.detail = ''
  form.place = ''
}

function onPost() {
  router.push('/list')
}

function onsuccess(fileItem) {
  form.attachment.push(fileItem.response.data.url)
}
</script>

<template>
  <div class="process">
    <div>
      <a-steps changeable :current="current" type="arrow" @change="setCurrent">
        <a-step description="在这里填写维修基本信息">
          维修基本信息
        </a-step>
        <a-step description="确认委派" :disabled="!isCommit.value">
          确认委派信息
        </a-step>
      </a-steps>
    </div>
    <div class="m-form">
      <div v-if="current === 1">
        <a-form size="large" :model="form" :style="{ width: '600px' }" @submit="handleSubmit">
          <a-form-item field="is_urgent" label="是否加急" :rules="[{ required: true, message: '必须选择是否加急' }]">
            <a-radio-group v-model="form.is_urgent">
              <a-radio :value="true">
                是
              </a-radio>
              <a-radio :value="false">
                否
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="type" label="故障类型" :rules="[{ required: true, message: '必须输入故障类型' }]">
            <a-select v-model="form.type" placeholder="请选择故障类型 ..." allow-clear>
              <a-option value="water">
                水工
              </a-option>
              <a-option value="electron">
                电器
              </a-option>
              <a-option value="other">
                其他
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="detail" label="故障详情" :rules="[{ required: true, message: '必须输入故障详情' }]">
            <a-input v-model="form.detail" placeholder="请输入故障详情..." />
          </a-form-item>
          <a-form-item field="place" label="维修地点" :rules="[{ required: true, message: '必须输入维修地点' }]">
            <a-input v-model="form.place" placeholder="请输入维修地点..." />
          </a-form-item>
          <a-form-item field="attachment" label="图片">
            <a-upload draggable :action="`${base_url}/upload`" list-type="picture" image-preview :limit="5" tip="可以上传PNG、JPG等格式的图片，最大限制5张50M" @success="onsuccess" />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button html-type="submit" type="primary">
                下一步
              </a-button>
              <a-button @click="onReset">
                重置
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
      <div v-if="current === 2">
        <div>
          <a-descriptions style="margin-top: 20px" :data="data" size="large" title="报修单" :column="1">
            <a-descriptions-item label="姓名">
              {{ user_data.name }}
            </a-descriptions-item>
            <a-descriptions-item label="所属部门">
              {{ user_data.department }}
            </a-descriptions-item>
            <a-descriptions-item label="联系电话">
              {{ user_data.phone }}
            </a-descriptions-item>
            <a-descriptions-item label="故障类型">
              {{ form.type }}
            </a-descriptions-item>
            <a-descriptions-item label="故障详情">
              {{ form.detail }}
            </a-descriptions-item>
            <a-descriptions-item label="是否加急">
              {{ form.is_urgent }}
            </a-descriptions-item>
            <a-descriptions-item label="维修地点">
              {{ form.place }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-space>
            <a-button @click="onPret">
              返回
            </a-button>
            <a-button type="primary" @click="onPost">
              提交
            </a-button>
          </a-space>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.process{
  @apply h-full flex flex-col;
}
.next{
  padding: 5px;
}
.m-form {
  @apply flex justify-center py-[7rem];
}

.button{
  display: flex;
  justify-content: center;
}
</style>
