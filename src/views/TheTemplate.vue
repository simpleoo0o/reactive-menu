<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, inject } from 'vue'
import { ReactiveMenuVO, ReactiveMenuItemVO } from '../useReactiveMenu.ts'

const reactiveMenuData = inject('reactiveMenuData') as ReactiveMenuVO
const route = useRoute()
const currentMenuStr = computed(() => {
  return JSON.stringify(reactiveMenuData.currentMenu || {}, null, 2)
})
const currentConfigStr = computed(() => {
  return JSON.stringify(reactiveMenuData.currentMenuWithParents?.at(-1) || {}, null, 2)
})
const childrenWithRoute = computed(() => {
  return reactiveMenuData.currentMenuWithParents?.at(-1)?.children?.filter((o) => {
    return !!o.config.route
  })
})

function jump(item: ReactiveMenuItemVO) {
  reactiveMenuData.methods.jump(item)
}
</script>

<template>
  <RouterView />
  routerName: {{ route.name }}
  <br />
  query: {{ route.query }}
  <br />
  params: {{ route.params }}
  <br />
  <br />
  <hr />
  <tamplate v-if="childrenWithRoute?.length">
    <br />
    <button @click="jump(item)" v-for="item of childrenWithRoute" :key="item.id">
      {{ item.name }}
    </button>
    <br />
    <br />
    <hr />
  </tamplate>
  <br />
  <h4>当前匹配菜单配置：</h4>
  <pre>{{ currentConfigStr }}</pre>
  <br />
  <hr />
  <br />
  <h4>当前高亮菜单配置：</h4>
  <pre>{{ currentMenuStr }}</pre>
</template>

<style scoped></style>
