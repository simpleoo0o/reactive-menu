<template>
    <template v-if="getIcon(data)">
        <template v-if="isSVGPathStr(getIcon(data))">
            <svg class="reactive-menu-item-icon" width="18" height="18" :viewBox="getViewBox(data)">
                <path :d="getSVGPath(data)"/>
            </svg>
        </template>
        <img
                v-else-if="isImageUrl(getIcon(data))"
                :src="getImgSrc(data)"
                :alt="data.name"
                class="reactive-menu-item-icon"/>
        <i v-else :class="getIcon(data)" class="reactive-menu-item-icon"></i>
    </template>
    <span class="reactive-menu-item-text">{{ data.name }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    menuData: Object
})

const data = computed(() => {
    return props.menuData
})

function getIcon (data) {
    return data.config?.icon
}
function getViewBox (data) {
    return data.config?.viewBox || '0 0 24 24'
}

function getSVGPath (data) {
    return getIcon(data).replace(/^path:\/\//, '')
}
function getImgSrc (data) {
    return getIcon(data).replace(/^image:\/\//, '')
}

function isSVGPathStr (icon) {
    return /^path:\/\/.+$/.test(icon)
}

function isImageUrl (icon) {
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
