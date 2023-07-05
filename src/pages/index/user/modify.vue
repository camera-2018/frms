<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  type: '',
  radio: '否',
  account: '',
  workplace: '',
})

function onReset() {
  form.sex = ''
  form.radio = '否'
  form.account = ''
  form.phone = ''
  form.email = ''
  onPost()
}
function onPost() {
  router.push('/user/info')
}
</script>

<template>
  <div class="process">
    <div class="content1">
      <div>
        <a-form size="large" :model="form" :style="{ width: '600px' }" @submit="handleSubmit">
          <a-form-item field="account" label="账号" :rules="[{ required: true, message: '必须输入新的账号' }]">
            <a-input v-model="form.account" placeholder="请输入新的账号名称.." />
          </a-form-item>
          <a-form-item field="sex" label="性别" :rules="[{ required: true, message: '必须输入性别' }]">
            <a-select v-model="form.sex" placeholder="请选择性别 ..." allow-clear>
              <a-option value="man">
                男
              </a-option>
              <a-option value="woman">
                女
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="phone" label="联系电话" :rules="[{ required: true, message: '必须输入维修地点' }]">
            <a-input v-model="form.phone" placeholder="请输入联系电话..." />
          </a-form-item>
          <a-form-item field="email" label="邮箱" :rules="[{ required: true, message: '必须输入维修地点' }]">
            <a-input v-model="form.email" placeholder="请输入邮箱..." />
          </a-form-item>
          <a-form-item>
            <a-space class="mt-[20px]">
              <a-button html-type="submit" type="primary" class="ml-[80px] " @click="onPost">
                提交
              </a-button>
              <a-button class="ml-[100px]" @click="onReset">
                返回
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.process{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.next{
  padding: 5px;
}
.content1{
  display: flex;
  justify-content: center;
  margin: 80px;
}

.button{
  display: flex;
  justify-content: center;
}
</style>
