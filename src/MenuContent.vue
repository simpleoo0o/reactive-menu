<template>
  <template v-if="getIcon(data)">
    <template v-if="isSVGPathStr(getIcon(data))">
      <svg
        class="reactive-menu-item-svg reactive-menu-item-icon"
        width="18"
        height="18"
        :viewBox="getViewBox(data)"
      >
        <path :d="getSVGPath(data)" />
      </svg>
    </template>
    <img
      v-else-if="isImageUrl(getIcon(data))"
      :src="getImgSrc(data)"
      :alt="data.name"
      class="reactive-menu-item-img reactive-menu-item-icon"
    />
    <i v-else :class="getIcon(data)" class="reactive-menu-item-icon"></i>
  </template>
  <span class="reactive-menu-item-text">{{ data.name }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ReactiveMenuItemVO } from './useReactiveMenu'

const props = defineProps<{
  menuData: ReactiveMenuItemVO
}>()

const data = computed<ReactiveMenuItemVO>(() => {
  return props.menuData as ReactiveMenuItemVO
})

function getIcon(data: ReactiveMenuItemVO): string {
  return data.config?.icon || ''
}

function getViewBox(data: ReactiveMenuItemVO): string {
  return data.config?.viewBox || '0 0 24 24'
}

function getSVGPath(data: ReactiveMenuItemVO): string {
  return getIcon(data).replace(/^path:\/\//, '')
}

function getImgSrc(data: ReactiveMenuItemVO): string {
  return getIcon(data).replace(/^image:\/\//, '')
}

function isSVGPathStr(icon: string): boolean {
  return /^path:\/\/.+$/.test(icon)
}

function isImageUrl(icon: string): boolean {
  return /^image:\/\/.+$/.test(icon)
}
</script>

<style lang="scss" scoped>
.reactive-menu-item-icon {
  margin-right: 5px;
  width: var(--el-menu-icon-width);
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}

img.reactive-menu-item-icon {
  vertical-align: -2px;
}

svg.reactive-menu-item-icon {
  height: 18px;
  line-height: 18px;
  fill: currentColor;
}
</style>
