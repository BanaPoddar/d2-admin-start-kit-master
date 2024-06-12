<template>
  <div class="container">
    <div class="sidebar" v-if="isSidebarOpen">
      <button @click="emergencyStop">急停</button>
      <button @click="returnToInitialPosition">回到初始位置</button>
      <button @click="releaseGripper">松开夹爪</button>
    </div>
    <button class="toggle-sidebar" @mouseover="isSidebarOpen = true" @mouseout="isSidebarOpen = false">
      <i class="arrow-icon"></i>
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isSidebarOpen: false
    }
  },
  methods: {
    emergencyStop () {
      // 实现急停功能的代码
    },
    returnToInitialPosition () {
      // 实现回到初始位置功能的代码
    },
    releaseGripper () {
      // 实现松开夹爪功能的代码
    }
  }
}
</script>

<style scoped>
.container {
  position: relative;
}

.sidebar {
  position: absolute;
  right: 0;
  top: 0;
  width: 200px;
  background-color: #f9f9f9;
  transition: transform 0.3s ease-in-out;
}

.toggle-sidebar {
  position: absolute;
  right: 0;
  top: 0;
}

.arrow-icon {
  /* 使用 CSS 来创建一个向左的箭头图标 */
}
.arrow-icon:before {
  content: "";
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 10px solid black;
  transform: rotate(180deg);
}
</style>
