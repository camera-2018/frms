<script setup>
const res = [
  {
    title: '厕所灯泡不亮',
    description: '2022-04-01 杭州电子科技大学下沙生活区11号楼北517',
    status: '已评价',
  },
  {
    title: '厕所喷头掉落',
    description: '2022-04-01 杭州电子科技大学下沙生活区11号楼北517',
    status: '未评价',
  },
  {
    title: '空调制冷出问题',
    description: '2022-04-01 杭州电子科技大学下沙生活区11号楼北517',
    status: '未验收',
  },
  {
    title: '厕所门把手脱落',
    description: '2022-04-01 杭州电子科技大学下沙生活区11号楼北517',
    status: '未验收',
  },
  {
    title: '寝室门锁损坏',
    description: '2022-04-01 杭州电子科技大学下沙生活区11号楼北517',
    status: '未核对',
  },
  {
    title: '救救孩子，黑龙五猫',
    description: '2022-07-02 杭州电子科技大学下沙生活区11号楼北602',
    status: '已下单',
  },
]
const color = {
  已评价: '#3ADC4A',
  未评价: '#D8B024',
  已下单: '#7C7D80',
  未验收: '#FF0E0E',
  未核对: '#D8B024',
}
</script>

<template>
  <a-list>
    <a-list-item>
      <a-list-item-meta
        title="故障详情"
        description="报修时间 报修地点"
      />
      <template #actions>
        <div :style="{ color: '#7C7D80' }">
          报修状态
        </div>
      </template>
    </a-list-item>
    <a-list-item v-for="element in res" :key="element.title">
      <a-list-item-meta
        :title="element.title"
        :description="element.description"
      />
      <template #actions>
        <div :style="{ color: color[element.status] }">
          {{ element.status }}
        </div>
      </template>
    </a-list-item>
  </a-list>
</template>