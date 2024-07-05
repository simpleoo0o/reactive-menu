<template>
  <reactive-menu-tree :menu-data="menus"/>
</template>

<script setup lang="ts">
import menus from '../menus'
import ReactiveMenuTree from '../ReactiveMenuTree.vue'
</script>
