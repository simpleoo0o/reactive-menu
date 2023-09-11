<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ElContainer, ElHeader, ElAside, ElMain, ElMenu } from 'element-plus'
import { useReactiveMenu } from '../useReactiveMenu'
import menus from '../menus'
import ReactiveMenuItem from '../ReactiveMenuItem.vue'
import { computed } from 'vue'

const calcMock = computed(() => {
  return {
    kgName: 'k_g_n_a_m_e',
    apk: 'k_p_a'
  }
})
const config = {
  autoIndex: true,
  selfJump: true,
  resetId: true
}
const reactiveMenuData = useReactiveMenu(menus, {
  mock: calcMock,
  config
});
(window as any).reactiveMenuData = reactiveMenuData

function goHome() {
  reactiveMenuData.methods.goDefault()
}

function handleClick(arg: any) {
  console.log(arg)
}
</script>

<template>
  <el-container>
    <el-header>
      <div class="logo" @click="goHome">LOGO</div>
      <el-menu
        :default-active="reactiveMenuData.topActiveIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
      >
        <reactive-menu-item
          v-for="item of reactiveMenuData.menus"
          :key="item.id"
          :data="item"
          @on-click="handleClick"
        />
      </el-menu>
    </el-header>
    <el-container class="body">
      <el-aside v-show="!!reactiveMenuData.secondMenus?.length" width="200px">
        <el-menu
          :default-active="reactiveMenuData.activeIndex"
          class="el-menu-demo"
          mode="vertical"
          :ellipsis="false"
        >
          <reactive-menu-item
            v-for="item of reactiveMenuData.secondMenus"
            :key="item.id"
            :data="item"
          >
            <!--                        <template #menu-item="{data}">-->
            <!--                            {{data.name}}={{data.id}}-->
            <!--                        </template>-->
            <!--                        <template #menu-item-group="{data}">-->
            <!--                            {{data.name}}==={{data.id}}-->
            <!--                        </template>-->
          </reactive-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.el-container {
  height: 100%;

  .el-header {
    background: #eee;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
      flex: none;
      font-size: 32px;
      background: #aaa;
      width: 200px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .el-menu {
      flex: none;
    }
  }

  .body {
    height: calc(100% - 60px);
  }

  .el-aside {
    background: #eee;
  }
}
</style>
