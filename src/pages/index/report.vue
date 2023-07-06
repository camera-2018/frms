<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { base_url } from '../../utils/config'
import useUserStore from '../../store/user'
import { FileItem } from '@arco-design/web-vue';
import { ReportForm } from '../../schema/repair';

const router = useRouter()
const userStore = useUserStore()
const current = ref(1)

const form = reactive<ReportForm>({
  type: '',
  is_urgent: false,
  detail: '',
  place: '',
  attachment: [],
})

function handleReset() {
  form.type = ''
  form.is_urgent = false
  form.detail = ''
  form.place = ''
  form.attachment = []
}

function onSuccess(fileItem: FileItem) {
  form.attachment.push(fileItem.response.data.url)
}

async function handleSubmit() {
  const  resp = await fetch(`${base_url}/repairs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  })
  const payload = await resp.json()
  const repair_id = payload.data.repair_info._id
  console.log(repair_id)

 await fetch(`${base_url}/request/${repair_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userStore.token}`,
    },
    body: JSON.stringify(form),
  })

  await router.push('list')
}

const repair_type = ['锁匠', '集中供热', '寝室洗衣机', '水工类', '玻璃类', '塑钢类', '木工类', '电工类', '泥工类', '其他']
</script>

<template>
  <div class="h-full flex flex-col">
    <div>
      <a-steps :current="current" type="arrow">
        <a-step description="在这里填写维修基本信息">
          维修基本信息
        </a-step>
        <a-step description="确认委派">
          确认委派信息
        </a-step>
      </a-steps>
    </div>
    <div class="flex justify-center mt-16">
      <div v-if="current === 1">
        <a-form size="large" :model="form" :style="{ width: '600px' }" @submit-success="current = 2">
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
              <a-option v-for="item in repair_type" :key="item">
                {{ item }}
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="detail" label="故障详情" :rules="[{ required: true, message: '必须输入故障详情' }]">
            <a-textarea v-model="form.detail" placeholder="请输入故障详情..." />
          </a-form-item>
          <a-form-item field="place" label="维修地点" :rules="[{ required: true, message: '必须输入维修地点' }]">
            <a-input v-model="form.place" placeholder="请输入维修地点..." />
          </a-form-item>
          <a-form-item field="attachment" label="图片">
            <a-upload draggable :action="`${base_url}/upload`" list-type="picture" image-preview :limit="5"
              tip="可以上传PNG、JPG等格式的图片，最大限制5张50M" @success="onSuccess" />
          </a-form-item>
          <a-form-item>
            <div class="mt-2 flex gap-x-4 items-center justify-center">
              <a-button html-type="submit" type="primary">
                下一步
              </a-button>
              <a-button @click="handleReset">
                清空输入
              </a-button>
            </div>
          </a-form-item>
        </a-form>
      </div>
      <div v-if="current === 2">
        <div>
          <a-descriptions style="margin-top: 20px" size="large" title="报修单" :column="1">
            <a-descriptions-item label="姓名">
              {{ userStore.name }}
            </a-descriptions-item>
            <a-descriptions-item label="所属部门">
              {{ userStore.department }}
            </a-descriptions-item>
            <a-descriptions-item label="联系电话">
              {{ userStore.phone }}
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
            <a-button @click="current = Math.max(1, current - 1)">
              返回
            </a-button>
            <a-button type="primary" @click="handleSubmit">
              提交
            </a-button>
          </a-space>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
