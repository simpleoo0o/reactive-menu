<template>
  <el-tree
    ref='reactiveMenuTree'
    class='reactive-menu-tree'
    node-key='id'
    highlight-current
    :allow-drop='allowDrop'
    :allow-drag='allowDrag'
    :draggable='props.isOpenDrag'
    :data='menus'
    @node-drag-end='handleDragEnd'>
    <template #default='{node}'>
      <div class='reactive-menu-tree-node'>
        <el-checkbox
          v-if='props.isOpenCheck'
          v-model='node.data.checked'
          @click.stop
          @change='handleCheckboxChange(node)' />
        <div class='reactive-menu-tree-node-name'>{{ node.data.name }}</div>
        <div class='reactive-menu-tree-node-tool'>
          <el-button
            v-if='props.isOpenRename'
            type='primary'
            link
            @click.stop='rename(node)'>
            重命名
          </el-button>
          <el-button
            v-if='!node.data.config.notBeDefault && props.isOpenDefault'
            :type="node.data.config.isDefault ? 'danger' : 'primary'"
            link
            @click.stop='setDefault(node)'>
            设为默认
          </el-button>
        </div>
      </div>
    </template>
  </el-tree>
</template>

<script setup>
import * as _ from 'lodash'
import { ElTree, ElCheckbox, ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  menuData: {
    type: Array,
    default: () => []
  },
  isOpenDrag: {
    type: Boolean,
    default: true
  },
  isOpenRename: {
    type: Boolean,
    default: true
  },
  isOpenDefault: {
    type: Boolean,
    default: true
  },
  isOpenCheck: {
    type: Boolean,
    default: true
  }
})

let menus = reactive([])
watch(props.menuData, () => {
  menus = reactive(menuOrderAndFilter(props.menuData))
}, {
  immediate: true
})

const reactiveMenuTree = ref(null)

function setDefault (node) {
  _.forEach(node.parent.childNodes, (childNode) => {
    childNode.data.config.isDefault = false
  })
  node.data.config.isDefault = true
}

function rename (node) {
  ElMessageBox.prompt('', '重命名', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputPattern: /.+/,
    inputValue: node.data.name,
    inputErrorMessage: '请输入名称'
  })
    .then(({ value }) => {
      node.data.name = value
      ElMessage({
        type: 'success',
        message: '重命名成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消重命名'
      })
    })
}

function handleCheckboxChange (node) {
  changeChildrenByParent(node)
  changeParentByNode(node)
}

function changeChildrenByParent (parent) {
  const children = parent.childNodes
  for (const child of children || []) {
    child.data.checked = parent.data.checked
    changeChildrenByParent(child)
  }
}

function changeParentByNode (node) {
  const parent = node.parent
  if (parent) {
    const flag = !!(_.find(parent.childNodes, 'data.checked'))
    if (flag !== parent.data.checked) {
      parent.data.checked = flag
      changeParentByNode(parent)
    }
  }
}

function allowDrag () {
  return true
}

function allowDrop (draggingNode, dropNode, type) {
  if (draggingNode.data.pid === dropNode.data.pid) {
    return type !== 'inner'
  }
  return false
}

function handleDragEnd (draggingNode) {
  const node = reactiveMenuTree.value.getNode(draggingNode.data)
  const children = node.parent?.data?.children || reactiveMenuTree.value.data
  _.forEach(children, (child, index) => {
    child.order = index
  })
}

function menuOrderAndFilter (menus) {
  for (const menu of _.cloneDeep(menus)) {
    menu.id = menu.id.toString ? menu.id.toString() : menu.id
    if (menu && menu.children && menu.children.length) {
      menu.children = menuOrderAndFilter(menu.children)
    }
  }
  return _.filter(_.orderBy(menus, ['order'], ['asc']), (o) => {
    return o.enable !== false
  })
}
</script>

<style scoped lang='scss'>
.reactive-menu-tree-node {
  width: 100%;
  display: flex;
  align-items: center;

  .el-checkbox {
    flex: none;
    margin-right: 4px;
  }

  .reactive-menu-tree-node-name {
    width: 1px;
    flex: auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .reactive-menu-tree-node-tool {
    margin-left: 16px;
    flex: none;
  }
}
</style>
