<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const current = ref(1)

const form = reactive({
  type: '',
  radio: '否',
  detail: '',
  workplace: '',
})

function convertDate({
  time_str = null,
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  inputTimezone = null,
  outputTimezone = null,
  timestamp = false,
  format = 'YYYY-MM-DD hh:mm:ss',
}) {
  // 解析时区偏移量
  const parseTimezoneOffset = (timezone) => {
    const sign = timezone.charAt(3) === '-' ? -1 : 1
    const hours = Number.parseInt(timezone.substr(4, 2), 10)
    const minutes = Number.parseInt(timezone.substr(7, 2), 10)
    const offset = sign * (hours * 60 + minutes)
    return offset
  }

  // 应用时区偏移量到日期时间
  const applyTimezoneOffset = (date, offset) => {
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000
    const localTime = utcTime + offset * 60000
    return new Date(localTime)
  }

  // 如果 time_str 为空，则使用当前系统时间
  let baseTime = time_str ? new Date(time_str) : new Date()

  // 解析输入时区偏移量并修正时间
  if (inputTimezone !== null) {
    const inputOffset = parseTimezoneOffset(inputTimezone)
    baseTime = applyTimezoneOffset(baseTime, inputOffset)
  }

  // 设置偏移量
  baseTime.setFullYear(baseTime.getFullYear() + years)
  baseTime.setMonth(baseTime.getMonth() + months)
  baseTime.setDate(baseTime.getDate() + days)
  baseTime.setHours(baseTime.getHours() + hours)
  baseTime.setMinutes(baseTime.getMinutes() + minutes)
  baseTime.setSeconds(baseTime.getSeconds() + seconds)

  // 修正输出时区
  if (outputTimezone !== null) {
    const outputOffset = parseTimezoneOffset(outputTimezone)
    baseTime = applyTimezoneOffset(baseTime, outputOffset)
  }

  // 输出时间戳
  if (timestamp)
    return baseTime.getTime()

  // 格式化输出
  if (format) {
    const year = baseTime.getFullYear()
    const month = String(baseTime.getMonth() + 1).padStart(2, '0')
    const day = String(baseTime.getDate()).padStart(2, '0')
    const hour = String(baseTime.getHours()).padStart(2, '0')
    const minute = String(baseTime.getMinutes()).padStart(2, '0')
    const second = String(baseTime.getSeconds()).padStart(2, '0')

    const formattedDate = format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('hh', hour)
      .replace('mm', minute)
      .replace('ss', second)

    return formattedDate
  }

  return baseTime
}

function handleSubmit({ values, errors }) {
  console.log('values:', values, '\nerrors:', errors)
  if (!errors)
    current.value = 2
}

function onPret() {
  current.value = Math.max(1, current.value - 1)
}

function onNext() {
  current.value = Math.min(2, current.value + 1)
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
        <a-step description="确认委派">
          确认委派信息
        </a-step>
      </a-steps>
    </div>
    <div class="content1">
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
              {{ convertDate({}) }}
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
  margin: 30px;
}

.button{
  display: flex;
  justify-content: center;
}
</style>
