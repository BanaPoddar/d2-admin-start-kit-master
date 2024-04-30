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
            <el-tag size="mini" type="info" slot="header"> {{item.i}}智慧语音助手</el-tag>
            <div>
              <ve-line :data="chartData"></ve-line>
            </div>
          </template>
          <template v-if="item.i === '1'">
            <el-tag size="mini" type="info" slot="header">{{item.i}}待抓取物品列表 </el-tag>
          </template>
          <template v-if="item.i === '2'">
            <el-tag size="mini" type="info" slot="header">{{item.i}}物品摄像头画面</el-tag>
            <d2-icon name="github" style="font-size: 100px;"/>
          </template>
        </el-card>
      </d2-grid-item>
    </d2-grid-layout>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import { GridLayout, GridItem } from 'vue-grid-layout'
import VeLine from 'v-charts/lib/line.common'
Vue.component('d2-grid-layout', GridLayout)
Vue.component('d2-grid-item', GridItem)
export default {
  name: 'PageDemoPage1',
  components: {
    VeLine
  },
  data () {
    return {
      layout: {
        layout: [
          { x: 0, y: 0, w: 7, h: 18, i: '0' },
          { x: 7, y: 0, w: 5, h: 9, i: '1' },
          { x: 7, y: 10, w: 5, h: 9, i: '2' }
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
      chartData: {
        columns: ['date', 'PV'],
        rows: [
          { date: '01-01', PV: 1231 },
          { date: '01-02', PV: 1223 },
          { date: '01-03', PV: 2123 },
          { date: '01-04', PV: 4123 },
          { date: '01-05', PV: 3123 },
          { date: '01-06', PV: 7123 }
        ]
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
