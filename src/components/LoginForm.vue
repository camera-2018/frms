<script setup lang="ts">
import type { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import { IconLock, IconUser } from '@arco-design/web-vue/es/icon'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { LoginForm } from '../schema/user'
import useAppStore from '../store/app'
import useUserStore from '../store/user'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const errorMessage = ref('')

const { loading } = storeToRefs(appStore)
const { setLoading } = appStore

const loginConfig = ref({
  rememberPassword: true,
  account: 'sakuya',
  password: 'ssr@129631',
})
const loginForm = reactive<LoginForm>({
  account: loginConfig.value.account,
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

  if (errors)
    return

  setLoading(true)
  try {
    const { rememberPassword } = loginConfig.value
    const {
      account,
      password,
    } = values
    loginConfig.value.account = rememberPassword ? account : ''
    loginConfig.value.password = rememberPassword ? password : ''
    await userStore.login(values as LoginForm)
    await router.push('/')
  }
  catch (err) {
    errorMessage.value = (err as Error).message
  }
  finally {
    setLoading(false)
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
    <a-form :model="loginForm" class="login-form" layout="vertical" @submit="handleSubmit">
      <a-form-item field="account" :rules="[{ required: true, message: '请输入用户名' }]" :validate-trigger="['change', 'blur']"
        hide-label>
        <a-input v-model="loginForm.account" placeholder="用户名">
          <template #prefix>
            <IconUser />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="password" :rules="[{ required: true, message: '请输入密码' }]" :validate-trigger="['change', 'blur']"
        hide-label>
        <a-input-password v-model="loginForm.password" placeholder="密码" allow-clear>
          <template #prefix>
            <IconLock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox checked="rememberPassword" :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any">
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
