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
            <div style="text-align: center;">
              <!--图像居中,设置最大宽度为100px-->
              <img :src="videoFeedUrl" style="max-width: 80%; height: auto;" />
            </div>
          </template>
          <template v-if="item.i === '1'">
          </template>
          <template v-if="item.i === '2'" style ="display: flex;flex-direction: column;overflow-y: auto;height: 100%;">
            <el-tag size="mini" type="info" slot="header">{{item.i}}待抓取物品列表 </el-tag>
            <div class="item-list" style="display: flex;flex-direction: column;overflow-y: auto;height: 100%;">
              <el-card v-for="item in itemList" :key="item.id" class="item-card">
                <div class="item-content">
                  <img :src="item.imageURL" class="item-image" />
                  <div class="item-details">
                    <p><strong>编号:</strong> {{ item.id }}</p>
                    <p><strong>物品名称:</strong> {{ item.class }}</p>
                    <p><strong>置信度:</strong> {{ item.confidence }}</p>
                    <p><strong>位置:</strong> {{ item.position }}</p>
                  </div>
                  <el-button type="primary" @click="graspItem(item.id)" style="margin-left: 20px">抓取</el-button>
                </div>
              </el-card>
            </div>
          </template>
          <template v-if="item.i === '3'">
          </template>
          <template v-if="item.i === '4'">
          </template>
          <template v-if="item.i === '5'">
          </template>
        </el-card>
      </d2-grid-item>
    </d2-grid-layout>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import { GridLayout, GridItem } from 'vue-grid-layout'
import axios from 'axios'
Vue.component('d2-grid-layout', GridLayout)
Vue.component('d2-grid-item', GridItem)
export default {
  name: 'PageDemoPage1',
  data () {
    return {
      itemList: [],
      layout: {
        layout: [
          { x: 0, y: 0, w: 6, h: 5, i: '0' },
          { x: 6, y: 0, w: 6, h: 5, i: '1' },
          { x: 0, y: 5, w: 3, h: 12, i: '2' },
          { x: 3, y: 5, w: 6, h: 12, i: '3' },
          { x: 9, y: 5, w: 3, h: 12, i: '4' },
          { x: 0, y: 17, w: 12, h: 9, i: '5' }
        ],
        colNum: 12,
        rowHeight: 30,
        isDraggable: true,
        isResizable: true,
        isMirrored: false,
        verticalCompact: true,
        margin: [10, 10],
        useCssTransforms: true,
        videoFeedUrl: 'api/camera/depth' // 后端Flask接口地址
      }
    }
  },
  mounted () {
    // 加载完成后显示提示
    this.showInfo()
    this.fetchItems()
  },
  methods: {
    fetchItems () {
      axios.get('/api/grasp/getRecognizedItems')
        .then(response => {
          // eslint-disable-next-line no-undef
          const responseData = JSON.parse(response.data.data)
          const items = Array.isArray(responseData) ? responseData : []
          // 更新 itemList
          this.itemList = items.map(item => ({
            id: item.id,
            class: item.class,
            color: item.color,
            position: item.position,
            confidence: item.confidence,
            imageURL: 'data:image/png;base64,' + item.image // 假设 "image" 包含 Base64 编码的图像数据
          }))
        })
        .catch(error => {
          console.error(error)
        })
    },
    graspItem (itemId) {
      // 处理抓取物品的逻辑
    },
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
  .item-list {
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* 启用垂直方向上的滚动条 */
    height: 100%; /* 占据父容器的所有可用高度 */
  }
  .item-card {
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }
  .item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .item-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-right: 10px;
  }
  .item-details {
    flex: 1;
  }
  .item-details p {
    margin: 5px 0;
  }
  .item-details p strong {
    font-weight: bold;
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
