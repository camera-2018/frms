<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { useStorage } from '@vueuse/core'
import { base_url } from '../../../utils/config'
import useUserStore from '../../../store/user'
import { UserInfoUpdateForm } from '../../../schema/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  name: userStore.name,
  sex: userStore.sex,
  phone: userStore.phone,
  avatar: userStore.avatar,
  department: userStore.department,
  job_type: userStore.job_type,
})

async function handleSubmit(values: Record<string, any>) {
  await fetch(`${base_url}/user/info`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userStore.token}`,
    },
    body: JSON.stringify(values, null, 4),
  })
  await userStore.info()
  router.push('/user/info')
}

const jobType = [
  '锁匠', '集中供热', '寝室洗衣机', '水工类', '玻璃类', '塑钢类', '木工类', '电工类', '泥工类', '其他', '未指定',
]

const file = ref()
function onChange(_, currentFile) {
  file.value = {
    ...currentFile,
    url: URL.createObjectURL(currentFile.file),
  }
}
function onProgress(currentFile) {
  file.value = currentFile
}
</script>

<template>
  <div class="self-center text-black my-20">
    <div class="text-xl text-center font-bold mb-8">修改个人信息</div>
    <a-form size="large" :model="form" :style="{ width: '500px' }" @submit-success="handleSubmit">
      <a-form-item field="name" label="姓名" :rules="[{ required: true, message: '必须输入姓名' }]">
        <a-input v-model="form.name" placeholder="请输入新的姓名" />
      </a-form-item>
      <a-form-item field="sex" label="性别" :rules="[{ required: true, message: '必须输入性别' }]">
        <a-select v-model="form.sex" placeholder="请选择性别" allow-clear>
          <a-option value="男">
            男
          </a-option>
          <a-option value="女">
            女
          </a-option>
          <a-option value="未指定">
            未指定
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="phone" label="联系电话" :rules="[{ required: true, message: '必须输入联系电话' }]">
        <a-input v-model="form.phone" placeholder="请输入联系电话" />
      </a-form-item>
      <a-form-item v-if="useUserStore().role !== 'worker'" field="department" label="部门"
        :rules="[{ required: true, message: '必须输入部门' }]">
        <a-input v-model="form.department" placeholder="请输入所在部门" />
      </a-form-item>
      <a-form-item v-if="useUserStore().role === 'worker'" field="job_type" label="工种"
        :rules="[{ required: true, message: '必须输入工种' }]">
        <a-select v-model="form.job_type" placeholder="请选择工种" allow-clear>
          <a-option v-for="t in jobType" :key="t" :value="t">
            {{ t }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="avatar" label="头像">
        <a-space direction="vertical" :style="{ width: '100%' }">
          <a-upload action="/" :file-list="file ? [file] : []" :show-file-list="false" @change="onChange"
            @progress="onProgress">
            <template #upload-button>
              <div :class="`arco-upload-list-item${file && file.status === 'error' ? ' arco-upload-list-item-error' : ''
                }`">
                <div v-if="file && file.url" class="arco-upload-list-picture custom-upload-avatar">
                  <img :src="file.url">
                  <div class="arco-upload-list-picture-mask">
                    <IconEdit />
                  </div>
                  <a-progress v-if="file.status === 'uploading' && file.percent < 100" :percent="file.percent"
                    type="circle" size="mini" :style="{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translateX(-50%) translateY(-50%)',
                    }" />
                </div>
                <div v-else class="arco-upload-picture-card">
                  <div class="arco-upload-picture-card-text">
                    <IconPlus />
                    <div style="margin-top: 10px; font-weight: 600">
                      Upload
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </a-upload>
        </a-space>
      </a-form-item>
      <a-form-item no-style class="block">
        <div class="mt-2 flex gap-x-4 items-center justify-center">
          <a-button @click="router.push('/user/info')">
            取消
          </a-button>
          <a-button html-type="submit" type="primary">
            保存修改
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.next {
  padding: 5px;
}

.button {
  display: flex;
  justify-content: center;
}
</style>
