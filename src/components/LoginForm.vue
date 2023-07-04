<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import type { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import { storeToRefs } from 'pinia'
import {
  IconLock,
  IconUser,
} from '@arco-design/web-vue/es/icon'
import useUserStore from '../store/user'
import useAppStore from '../store/app'

const router = useRouter()
const errorMessage = ref('')
const { loading } = storeToRefs(useAppStore())
const { setLoading } = useAppStore()

const loginConfig = ref({
  rememberPassword: true,
  username: 'admin', // 演示默认值
  password: 'admin', // demo default value
})
const userInfo = reactive({
  username: loginConfig.value.username,
  password: loginConfig.value.password,
})

async function handleSubmit({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined
  values: Record<string, any>
}) {
  if (loading.value)
    return
  if (!errors) {
    setLoading(true)
    try {
      useUserStore().setLogin(true)
      Message.success('成功')
      const { rememberPassword } = loginConfig.value
      const { username, password } = values
      loginConfig.value.username = rememberPassword ? username : ''
      loginConfig.value.password = rememberPassword ? password : ''
      router.push('/list')
    }
    catch (err) {
      errorMessage.value = (err as Error).message
    }
    finally {
      setLoading(false)
    }
  }
}
function setRememberPassword(value: boolean) {
  loginConfig.value.rememberPassword = value
}
</script>

<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">
      登录
    </div>
    <div class="login-form-sub-title">
      登录设施报修管理系统
    </div>
    <div class="login-form-error-msg">
      {{ errorMessage }}
    </div>
    <a-form
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="username"
        :rules="[{ required: true, message: '错误' }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.username"
          placeholder="原神"
        >
          <template #prefix>
            <IconUser />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: '错误' }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          placeholder="密码"
          allow-clear
        >
          <template #prefix>
            <IconLock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any"
          >
            {{ '记住密码' }}
          </a-checkbox>
          <a-link>{{ '忘记密码' }}</a-link>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          登录
        </a-button>
        <a-button type="text" long class="login-form-register-btn">
          注册
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<style scoped>
  .login-form-wrapper {
  width: 320px;
}

.login-form-title {
  color: var(--color-text-1);
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
}

.login-form-sub-title {
  color: var(--color-text-3);
  font-size: 16px;
  line-height: 24px;
}

.login-form-error-msg {
  height: 32px;
  color: rgb(var(--red-6));
  line-height: 32px;
}

.login-form-password-actions {
  display: flex;
  justify-content: space-between;
}

.login-form-register-btn {
  color: var(--color-text-3) !important;
}
</style>
