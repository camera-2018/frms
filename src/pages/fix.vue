<script>
import { reactive } from 'vue'

export default {
  setup() {
    const handleSubmit = ({ values, errors }) => {
      console.log('values:', values, '\nerrors:', errors)
    }

    const form = reactive({
      size: 'medium',
      name: '',
      age: undefined,
      section: '',
      province: 'xiasha',
      options: [],
      date: '',
      time: '',
      radio: 'radio one',
      slider: 5,
      score: 5,
      switch: false,
      multiSelect: ['section one'],
      treeSelect: '',
    })
    const options = [
      {
        value: 'beijing',
        label: 'Beijing',
        children: [
          {
            value: 'chaoyang',
            label: 'ChaoYang',
            children: [
              {
                value: 'datunli',
                label: 'Datunli',
              },
            ],
          },
          {
            value: 'haidian',
            label: 'Haidian',
          },
          {
            value: 'dongcheng',
            label: 'Dongcheng',
          },
          {
            value: 'xicheng',
            label: 'XiCheng',
          },
        ],
      },
      {
        value: 'shanghai',
        label: 'Shanghai',
        children: [
          {
            value: 'shanghaishi',
            label: 'Shanghai',
            children: [
              {
                value: 'huangpu',
                label: 'Huangpu',
              },
            ],
          },
        ],
      },
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
          {
            value: 'xiasha',
            label: 'XiaSha',
          },
        ],
      },
    ]
    const treeData = [
      {
        key: 'node1',
        title: 'Node1',
        children: [
          {
            key: 'node2',
            title: 'Node2',
          },
        ],
      },
      {
        key: 'node3',
        title: 'Node3',
        children: [
          {
            key: 'node4',
            title: 'Node4',
          },
          {
            key: 'node5',
            title: 'Node5',
          },
        ],
      },
    ]

    return {
      form,
      options,
      treeData,
      handleSubmit,
    }
  },
  data() {
    return {
      current: 1,
    }
  },
  methods: {
    onPrev() {
      this.current = Math.max(1, this.current - 1)
    },

    onNext() {
      this.current = Math.min(3, this.current + 1)
    },

    setCurrent(current) {
      this.current = current
    },
  },
}
</script>

<template>
  <div class="process">
    <a-steps changeable :current="current" type="arrow" @change="setCurrent">
      <a-step description="在这里填写维修基本信息">
        维修基本信息
      </a-step>
      <a-step description="这里填写派单选项">
        派单选项
      </a-step>
      <a-step description="成功委派">
        成功委派
      </a-step>
    </a-steps>
    <div class="content1">
      <div v-if="current === 1">
        <a-form ref="formRef" size="large" :model="form" :style="{ width: '600px' }" @submit="handleSubmit">
          <a-form-item field="radio" label="客户类型">
            <a-radio-group v-model="form.radio">
              <a-radio value="danwei">
                单位用户
              </a-radio>
              <a-radio value="geren">
                个人用户
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            field="name" label="单位名称"
            :rules="[{ required: true, message: '必须输入名称' }]"
            :validate-trigger="['change', 'input']"
          >
            <a-input v-model="form.name" placeholder="请输入单位名称..." />
          </a-form-item>
          <a-form-item field="section" label="所属部门" :rules="[{ required: true, message: '必须输入部门' }]">
            <a-select v-model="form.section" placeholder="请选择部门 ..." allow-clear>
              <a-option value="xingzheng">
                行政部
              </a-option>
              <a-option value="yuanshen">
                原神部
              </a-option>
              <a-option value="geren">
                个人用户
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="province" label="地点" :rules="[{ required: true, message: '必须需要地点' }]">
            <a-cascader v-model="form.province" :options="options" placeholder="请选择地点 ..." allow-clear />
          </a-form-item>
          <a-form-item
            field="options" label="Options"
            :rules="[{ type: 'array', minLength: 2, message: 'must select greater than two options' }]"
          >
            <a-checkbox-group v-model="form.options">
              <a-checkbox value="option one">
                Section One
              </a-checkbox>
              <a-checkbox value="option two">
                Option Two
              </a-checkbox>
              <a-checkbox value="option three">
                Option Three
              </a-checkbox>
              <a-checkbox value="option four">
                Option Four
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item field="date" label="Date">
            <a-date-picker v-model="form.date" placeholder="Please select ..." />
          </a-form-item>
          <a-form-item field="time" label="Time">
            <a-time-picker v-model="form.time" placeholder="Please select ..." />
          </a-form-item>
          <a-form-item field="radio" label="Radio" :rules="[{ match: /one/, message: 'must select one' }]">
            <a-radio-group v-model="form.radio">
              <a-radio value="radio one">
                Radio One
              </a-radio>
              <a-radio value="radio two">
                Radio Two
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="slider" label="Slider" :rules="[{ type: 'number', min: 5, message: 'slider is min than 5' }]">
            <a-slider v-model="form.slider" :max="10" />
          </a-form-item>
          <a-form-item field="score" label="Score">
            <a-rate v-model="form.score" allow-clear />
          </a-form-item>
          <a-form-item field="switch" label="Switch" :rules="[{ type: 'boolean', true: true, message: 'must be true' }]">
            <a-switch v-model="form.switch" />
          </a-form-item>
          <a-form-item field="multiSelect" label="Multiple Select">
            <a-select v-model="form.multiSelect" placeholder="Please select ..." multiple>
              <a-option value="section one">
                Section One
              </a-option>
              <a-option value="section two">
                Section Two
              </a-option>
              <a-option value="section three">
                Section Three
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="treeSelect" label="Tree Select">
            <a-tree-select v-model="form.treeSelect" :data="treeData" placeholder="Please select ..." />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button html-type="submit">
                Submit
              </a-button>
              <a-button @click="$refs.formRef.resetFields()">
                Reset
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
      <div v-if="current === 2">
        <a-button />
      </div>
      <div v-if="current === 3">
        <a-button />
      </div>
    </div>
  </div>
</template>

<style scoped>
.process{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.next{
  padding: 5px;
}
.content1{
  display: flex;
  justify-content: center;
  margin: 30px;
}
</style>
