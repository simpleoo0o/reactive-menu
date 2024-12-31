# reactive-menu
提供一个 ReactiveMenuItemConfig[] 类型的菜单树，可根据url匹配到对应的菜单项，支持动态参数，可利用配置项生成导航，达到动态导航的目的

## demo
https://simpleoo0o.github.io/reactive-menu-demo

## 安装
```shell
npm i reactive-menu
```

## 使用
### 基础用法
```vue
<script setup>
    // import ReactiveMenuItem from 'reactive-menu/ReactiveMenuItem.vue'
    // import useReactiveMenu from 'reactive-menu/useReactiveMenu'
    import { ReactiveMenuItem, useReactiveMenu } from 'reactive-menu'

    import menus from '@/menus' // 导航数据，类型为ReactiveMenuItemConfig[]

    const reactiveMenu = useReactiveMenu(menus)
</script>

<template>
    <el-container>
        <el-header>
            <div class="logo">LOGO</div>
            <el-menu
              :default-active="reactiveMenu.topActiveIndex"
              mode="horizontal">
                <reactive-menu-item
                  v-for="item of reactiveMenu.menus"
                  :key="item.id"
                  :data="item"/>
            </el-menu>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu
                  :default-active="reactiveMenu.activeIndex"
                  mode="vertical">
                    <reactive-menu-item
                      v-for="item of reactiveMenu.secondMenus"
                      :key="item.id"
                      :data="item">
                    </reactive-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-main>
                    <RouterView/>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>
```

### 插槽
```vue

<template>
    <el-menu
      :default-active="reactiveMenu.activeIndex"
      mode="vertical">
        <reactive-menu-item v-for="item of reactiveMenu.secondMenus" :key="item.id" :data="item">
            <template #menu-item="{data}">
                {{data.name}}
            </template>
            <template #menu-item-group="{data}">
                {{data.name}}
            </template>
            <template #sub-menu="{data}">
                {{data.name}}
            </template>
        </reactive-menu-item>
    </el-menu>
</template>
```

### mock
ReactiveMenuItemConfig中动态数据的来源
```vue
<script setup>
    // import useReactiveMenu from 'reactive-menu/useReactiveMenu'
    import { useReactiveMenu } from 'reactive-menu'

    import menus from '@/menus'

    const reactiveMenu = useReactiveMenu(menus, {
        mock: {
            kgName: 'abc'
        }
    })
</script>
```
### 配置项
```vue
<script setup>
    // import useReactiveMenu from 'reactive-menu/useReactiveMenu'
    import { useReactiveMenu } from 'reactive-menu'

    import menus from '@/menus'

    const reactiveMenu = useReactiveMenu(menus, {
        config: {
            autoIndex: true, // 无匹配导航时是否重定向到首页，默认true
            selfJump: false // 点击当前导航时，是否跳转，默认false
        }
    })
</script>
```

### provide
```vue
<script setup>
    import { inject } from 'vue'
    const reactiveMenu = inject('reactiveMenu')
</script>
```
