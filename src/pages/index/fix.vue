<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDateFormat, useNow } from '@vueuse/core'

const router = useRouter()

const current = ref(1)

const isCommit = ref(false)

const form = reactive({
  type: '',
  radio: '否',
  detail: '',
  workplace: '',
  time: useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss').value,
})

function handleSubmit({ values, errors }) {
  console.log(values.value, errors)
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
  form.radio = '否'
  form.detail = ''
  form.workplace = ''
}

function onPost() {
  router.push('/list')
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
        <a-form ref="formRef" size="large" :model="form" :style="{ width: '600px' }" @submit="handleSubmit">
          <a-form-item field="radio" label="是否加急" :rules="[{ required: true, message: '必须选择是否加急' }]">
            <a-radio-group v-model="form.radio">
              <a-radio value="是">
                是
              </a-radio>
              <a-radio value="否">
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
          <a-form-item field="workplace" label="维修地点" :rules="[{ required: true, message: '必须输入维修地点' }]">
            <a-input v-model="form.workplace" placeholder="请输入维修地点..." />
          </a-form-item>
          <a-form-item field="img" label="图片">
            <a-upload draggable action="/" list-type="picture" image-preview :limit="5" tip="可以上传PNG、JPG等格式的图片，最大限制5张50M" />
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
          <a-descriptions style="margin-top: 20px" :data="data" size="large" title="保修单" :column="1">
            <a-descriptions-item label="姓名">
              ibbbb
            </a-descriptions-item>
            <a-descriptions-item label="所属部门">
              杭州电子科技大学下沙校区
            </a-descriptions-item>
            <a-descriptions-item label="联系电话">
              15167901584
            </a-descriptions-item>
            <a-descriptions-item label="故障类型">
              {{ form.type }}
            </a-descriptions-item>
            <a-descriptions-item label="故障详情">
              {{ form.detail }}
            </a-descriptions-item>
            <a-descriptions-item label="是否加急">
              {{ form.radio }}
            </a-descriptions-item>
            <a-descriptions-item label="维修地点">
              {{ form.workplace }}
            </a-descriptions-item>
            <a-descriptions-item label="保修时间">
              {{ form.time }}
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
