<template>
  <d2-container type="full" class="page">
    <d2-grid-layout
      v-bind="layout"
      @layout-updated="layoutUpdatedHandler">
      <d2-grid-item
        v-for="(item, index) in layout.layout"
        :key="index"
        v-bind="item"
        @resize="resizeHandler"
        @move="moveHandler"
        @resized="resizedHandler"
        @moved="movedHandler">
        <el-card shadow="never" class="page_card">
          <template v-if="item.i === '0'">
            <div class="center-bold">机械臂位置(m)</div>
            <div class="data-display-container">
              <home-robot-data value="0" label="X" style="width: 33%" />
              <home-robot-data value="0" label="Y" style="width: 33%"/>
              <home-robot-data value="0" label="Z" style="width: 33%"/>
            </div>
          </template>
          <template v-if="item.i === '1'">
            <div class="center-bold">机械臂姿态(deg)</div>
            <div class="data-display-container">
              <home-robot-data value="0" label="DX" style="width: 33%" />
              <home-robot-data value="0" label="DY" style="width: 33%"/>
              <home-robot-data value="0" label="DZ" style="width: 33%"/>
            </div>
          </template>
          <template v-if="item.i === '2'">
              <div class="box-content">
                  <div class="slider-block">
                    <div class="slider-item">
                      <p class="demonstration">关节1</p>
                      <el-slider v-model="joint1" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '1', 'y')" />
                    </div>
                    <div class="slider-item">
                      <p class="demonstration">关节2</p>
                      <el-slider v-model="joint2" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '2', 'x')" />
                    </div>
                    <div class="slider-item">
                      <p class="demonstration">关节3</p>
                      <el-slider v-model="joint3" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '3', 'x')" />
                    </div>

                    <div class="slider-item">
                      <p class="demonstration">关节4</p>
                      <el-slider v-model="joint4" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '4', 'x')" />
                    </div>
                    <div class="slider-item">
                      <p class="demonstration">关节5</p>
                      <el-slider v-model="joint5" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '5', 'y')" />
                    </div>
                    <div class="slider-item">
                      <p class="demonstration">关节6</p>
                      <el-slider v-model="joint6" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event, '6', 'x')" />
                    </div>
                  </div>
              </div>
          </template>
          <template v-if="item.i === '3'">
            <div class="box-content">
              <!-- three.js -->
            </div>
          </template>
          <template v-if="item.i === '4'">
            <div class="box-content">
              <!-- 关节4-6数据 -->
              <div>关节4 数据</div>
              <div>关节5 数据</div>
              <div>关节6 数据</div>
            </div>
          </template>
          <template v-if="item.i === '5'">
            <div class="box-content">
              <!-- Echart 图表展示 -->
              <div>Echart 图表</div>
            </div>
          </template>
        </el-card>
      </d2-grid-item>
    </d2-grid-layout>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import { GridLayout, GridItem } from 'vue-grid-layout'
import HomeRobotData from '@/components/HomeRobotData.vue'
Vue.component('d2-grid-layout', GridLayout)
Vue.component('d2-grid-item', GridItem)
export default {
  name: 'PageDemoPage1',
  components: {
    HomeRobotData
  },
  data () {
    return {
      myValue: 3.21,
      layout: {
        layout: [
          { x: 0, y: 0, w: 6, h: 4, i: '0' },
          { x: 6, y: 0, w: 6, h: 4, i: '1' },
          { x: 0, y: 4, w: 3, h: 15, i: '2', isDraggable: false },
          { x: 3, y: 4, w: 6, h: 15, i: '3' },
          { x: 9, y: 4, w: 3, h: 15, i: '4' },
          { x: 0, y: 16, w: 12, h: 9, i: '5' }
        ],
        colNum: 12,
        rowHeight: 30,
        isDraggable: true,
        isResizable: true,
        isMirrored: false,
        verticalCompact: true,
        margin: [10, 10],
        useCssTransforms: true
      },
      machineArmPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      machineArmPose: {
        dx: 0.123123,
        dy: 0.123123,
        dz: 0.123123
      }
    }
  },
  mounted () {
    // 加载完成后显示提示
    this.showInfo()
  },
  methods: {
    log (arg1 = 'log', ...logs) {
      if (logs.length === 0) {
        console.log(arg1)
      } else {
        console.group(arg1)
        logs.forEach(e => {
          console.log(e)
        })
        console.groupEnd()
      }
    },
    // 显示提示
    showInfo () {
      this.$notify({
        title: '提示',
        message: '你可以按住卡片拖拽改变位置；或者在每个卡片的右下角拖动，调整卡片大小'
      })
    },
    // 测试代码
    layoutUpdatedHandler (newLayout) {
      console.group('layoutUpdatedHandler')
      newLayout.forEach(e => {
        console.log(`{'x': ${e.x}, 'y': ${e.y}, 'w': ${e.w}, 'h': ${e.h}, 'i': '${e.i}'},`)
      })
      console.groupEnd()
    },
    resizeHandler (i, newH, newW) {
      this.log('resizeHandler', `i: ${i}, newH: ${newH}, newW: ${newW}`)
    },
    moveHandler (i, newX, newY) {
      this.log('moveHandler', `i: ${i}, newX: ${newX}, newY: ${newY}`)
    },
    resizedHandler (i, newH, newW, newHPx, newWPx) {
      this.log('resizedHandler', `i: ${i}, newH: ${newH}, newW: ${newW}, newHPx: ${newHPx}, newWPx: ${newWPx}`)
    },
    movedHandler (i, newX, newY) {
      this.log('movedHandler', `i: ${i}, newX: ${newX}, newY: ${newY}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  .vue-grid-layout {
    background-color: $color-bg;
    border-radius: 4px;
    margin: -10px;
    .page_card {
      height: 100%;
      @extend %unable-select;
      display: flex;
      flex-direction: column;
      overflow-y: auto; /* 启用垂直方向上的滚动条 */
      .data-display-container {
        display: flex;
      }
      .data-display {
        flex: 1;
      }
      .JointAngle {
        display: flex;
        flex: 1;
      }
      .center-bold {
        text-align: center;
        font-weight: bold;
        font-size: 20px; /* 你可以根据需要调整这个值 */
      }
      .demonstration {
        /* 向右移动40px */
        margin-LEFT: 100px;
        font-size: 16px;
      }
    }
    .vue-resizable-handle {
      opacity: .3;
      &:hover{
        opacity: 1;
      }
    }
  }
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-display {
  flex-grow: 1;
  overflow-y: auto;
}

.input-area {
  display: flex;
  align-items: center;
  padding: 10px;
}

.input-area textarea {
  flex-grow: 1;
  margin-right: 10px;
}
</style>
