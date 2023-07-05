<script setup>
const router = useRouter()
const res = [
  {
    title: '厕所灯泡不亮',
    description: '2022-04-01 杭州电子科技大学下沙生活区11号楼北517 202109060550',
    status: '已分配',
    id: 1,
  },
  {
    title: '厕所喷头掉落',
    description: '2022-04-01 杭州电子科技大学下沙生活区11号楼北517 202102348440',
    status: '未分配',
    id: 2,
  },
]
const color = {
  已分配: '#3ADC4A',
  未分配: '#FF0E0E',
}

function detail(id) {
  router.push(`/detail/${id}`)
}
</script>

<template>
  <a-list>
    <a-list-item>
      <a-list-item-meta
        title="故障详情"
        description="报修时间 报修地点 报修单号"
      />
      <template #actions>
        <div :style="{ color: '#7C7D80' }">
          报修状态
        </div>
      </template>
    </a-list-item>
    <a-list-item v-for="element in res" :key="element.title" class="list_item" @click="detail(element.id)">
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

<style scoped>
.list_item {
  @apply cursor-pointer;
}
</style>
