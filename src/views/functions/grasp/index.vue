<template>
  <d2-container type="full" class="page">
    <d2-grid-layout
      v-bind="layout">
      <d2-grid-item
        v-for="(item, index) in layout.layout"
        :key="index"
        v-bind="item">
        <el-card shadow="never" class="page_card">
          <!--卡片1 抓取摄像头画面-->
          <template v-if="item.i === '0'">
            <el-tag size="mini" type="info" slot="header">{{ Number(item.i) + 1 }}.摄像头画面</el-tag>
            <div style="text-align: center;">
              <!--图像居中,设置最大宽度为100px-->
              <img :src="videoFeedUrl" style="max-width: 80%; height: auto;" />
            </div>
          </template>
          <!--卡片2 日志区-->
          <template v-if="item.i === '1'">
            <el-tag size="mini" type="info" slot="header">{{ Number(item.i) + 1 }}.日志区</el-tag>
            <div class="log-container" style=" border: 1px solid #ccc; padding: 10px; height: 300px; overflow-y: auto;">
              <div v-for="log in logs" :key="log.id" style="margin-bottom: 10px;">
                时间戳: {{ log.timestamp }}, 操作: {{ log.action }}, 物品: {{ log.item }}, 颜色: {{ log.color }}, 状态: {{ log.status }}
              </div>
            </div>
          </template>
          <!--卡片3 待抓取物品列表-->
          <template v-if="item.i === '2'">
            <el-tag size="mini" type="info" slot="header">{{ Number(item.i) + 1 }}.待抓取物品列表 </el-tag>
            <div class="item-list">
              <el-card v-for="item in itemList" :key="item.id" class="item-card">
                <div class="item-content">
                  <img :src="item.imageURL" class="item-image" />
                  <div class="item-details">
                    <p><strong>编号:</strong> {{ item.id }}</p>
                    <p><strong>物品名称:</strong> {{ item.class }}</p>
                    <p><strong>置信度:</strong> {{ item.confidence }}</p>
                    <p><strong>位置:</strong> {{ item.position }}</p>
                  </div>
                  <el-button type="primary" @click="graspItem(item.class)" style="margin-left:300px;">抓取</el-button>
                </div>
              </el-card>
            </div>
          </template>
          <!--卡片4 功能区(是否需要放置)-->
          <template v-if="item.i === '3'">
            <el-tag size="mini" type="info" slot="header"> {{ Number(item.i) + 1 }}.功能区</el-tag>
            <div style="display: flex; align-items: center; margin-left: 30px">
              <el-switch v-model="shouldPlaceAfterGrasp" active-text="需要抓取后放置" style="margin-right: 20px;"></el-switch>
              <el-radio-group v-if="shouldPlaceAfterGrasp" v-model="defaultChose">
                <el-radio label="blue" style="margin-right: 10px;">放到蓝色框</el-radio>
                <el-radio label="pink" style="margin-right: 10px;">放到粉色框</el-radio>
                <el-radio label="green">放到绿色框</el-radio>
              </el-radio-group>
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
import axios from 'axios'
Vue.component('d2-grid-layout', GridLayout)
Vue.component('d2-grid-item', GridItem)
export default {
  name: 'graspControl',
  data () {
    return {
      // 布局设置
      layout: {
        layout: [
          { x: 0, y: 0, w: 5, h: 10, i: '0' },
          { x: 0, y: 12, w: 5, h: 10, i: '1' },
          { x: 5, y: 0, w: 7, h: 16, i: '2' },
          { x: 5, y: 17, w: 7, h: 4, i: '3' }
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
      videoFeedUrl: 'api/camera/depth', // 摄像头画面的URL
      logs: [], // 抓取/放置日志数据
      itemList: [], // 待抓取物品列表数据
      shouldPlaceAfterGrasp: false, // 默认值为 false，表示不需要在抓取后放置
      defaultChose: 'blue' // 默认值为空字符串，表示没有默认的放置位置
    }
  },
  mounted () {
    // 加载完成后显示初始提示
    this.showWelcomeInfo()
    // 获取物品列表
    this.fetchItems()
  },
  created () {
    // 获取日志数据
    this.fetchLog()
    // setInterval(this.fetchLog, 1000)
  },
  methods: {
    // 显示提示
    showWelcomeInfo () {
      this.$notify({
        title: '提示',
        message: '欢迎进入抓取界面!右下角功能区可以选择是否抓完后放到框中！'
      })
    },
    // 获取日志数据
    fetchLog () {
      axios.get('/api/grasp/log') // 更新 API 地址
        .then(response => {
          const data = response.data
          // 对时间戳进行转换
          const logs = data.map(entry => ({
            timestamp: new Date(entry.timestamp).toLocaleString(), // 将时间戳转换为本地时间格式
            action: entry.action,
            item: entry.item,
            color: entry.color,
            status: entry.status
          }))
          this.logs = logs
          // 手动强制触发界面更新
          this.$forceUpdate()
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    },
    // 获取物品列表
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
    // 指定物品抓取/指定位置放置
    graspItem (name) {
      let place = 'none'
      if (this.shouldPlaceAfterGrasp) {
        place = this.defaultChose
      }
      try {
        console.log('抓取物品:', name, '放置位置:', place)
        const response = axios.post('/api/grasp/startItemGrasp', null, {
          params: {
            item: name,
            place: place
          }
        })
        // 处理后端返回的消息
        const msg = response.data.msg
        console.log('后端返回消息:', msg)
      } catch (error) {
        console.error('抓取物品失败:', error)
      }
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
    .vue-resizable-handle {
      opacity: .3;
      &:hover{
        opacity: 1;
      }
    }
  }
}

</style>
