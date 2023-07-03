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

<template >
  <div class="process">
    <div>
      <a-steps changeable :current="current" type="arrow" @change="setCurrent">
        <a-step description="在这里填写维修基本信息">
          维修基本信息
        </a-step>
        <a-step description="成功委派">
          成功委派
        </a-step>
      </a-steps>
    </div>
    <div class="content1">
      <div v-if="current === 1">
        <a-form ref="formRef" size="large" :model="form" :style="{ width: '600px' }" @submit="handleSubmit">
          <a-form-item field="radio" label="是否加急" :rules="[{ required: true, message: '必须选择是否加急' }]">
            <a-radio-group v-model="form.radio">
              <a-radio value="danwei">
                是
              </a-radio>
              <a-radio value="geren">
                否
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="section" label="故障类型" :rules="[{ required: true, message: '必须输入故障类型' }]">
            <a-select v-model="form.section" placeholder="请选择故障类型 ..." allow-clear>
              <a-option value="xingzheng">
                水工
              </a-option>
              <a-option value="yuanshen">
                电器
              </a-option>
              <a-option value="geren">
                其他
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="input" label="故障详情" :rules="[{ required: true, message: '必须输入故障详情' }]">
            <a-input placeholder="请输入故障详情..." />
          </a-form-item>
          <a-form-item field="input" label="维修地点" :rules="[{ required: true, message: '必须输入维修地点' }]">
            <a-input placeholder="请输入维修地点..." />
          </a-form-item>
          <a-form-item >
            <a-space>
              <a-button html-type="submit" type="primary">
                下一步
              </a-button>
              <a-button @click="$refs.formRef.resetFields()">
                重置
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
      <div v-if="current === 2">

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

</style>
