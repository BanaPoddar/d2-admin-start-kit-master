<template>
  <d2-container type="full" class="page">
    <d2-grid-layout
      v-bind="layout">
      <d2-grid-item
        v-for="(item, index) in layout.layout"
        :key="index"
        v-bind="item">
        <el-card shadow="never" class="page_card">
          <template v-if="item.i === '0'">
            <el-tag size="mini" type="info" slot="header">{{ Number(item.i) + 1 }}.摄像头画面</el-tag>
            <div style="text-align: center;">
              <!--图像居中,设置最大宽度为100px-->
              <img :src="videoFeedUrl" style="max-width: 80%; height: auto;" />
            </div>
          </template>
          <template v-if="item.i === '1'">
            <!--标签“使得{{item.i}}的值+1”-->
            <el-tag size="mini" type="info" slot="header">{{ Number(item.i) + 1 }}.日志区</el-tag>
            <div class="log-container" style=" border: 1px solid #ccc; padding: 10px; height: 300px; overflow-y: auto;">
              <div v-for="log in logs" :key="log.id" style="margin-bottom: 10px;">
                时间戳: {{ log.timestamp }}, 操作: {{ log.action }}, 物品: {{ log.item }}, 颜色: {{ log.color }}, 状态: {{ log.status }}
              </div>
            </div>
          </template>
          <template v-if="item.i === '2'" style ="display: flex;flex-direction: column;overflow-y: auto;height: 100%;">
            <el-tag size="mini" type="info" slot="header">{{ Number(item.i) + 1 }}.待抓取物品列表 </el-tag>
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
                  <el-button type="primary" @click="graspItem(item.class)" style="margin-left:300px;">抓取</el-button>
                </div>
              </el-card>
            </div>
          </template>
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
    <div>
      <beautiful-chat
        :participants="participants"
        :titleImageUrl="titleImageUrl"
        :onMessageWasSent="onMessageWasSent"
        :messageList="messageList"
        :newMessagesCount="newMessagesCount"
        :isOpen="isChatOpen"
        :close="closeChat"
        :icons="icons"
        :open="openChat"
        :showEmoji="true"
        :showFile="true"
        :showEdition="true"
        :showDeletion="true"
        :showTypingIndicator="showTypingIndicator"
        :showLauncher="true"
        :showCloseButton="true"
        :colors="colors"
        :showHeader="false"
        :alwaysScrollToBottom="alwaysScrollToBottom"
        :disableUserListToggle="false"
        :messageStyling="messageStyling"
        @onType="handleOnType"
        @edit="editMessage" />
    </div>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import { register } from 'vue-advanced-chat'
import { GridLayout, GridItem } from 'vue-grid-layout'
import axios from 'axios'
Vue.component('d2-grid-layout', GridLayout)
Vue.component('d2-grid-item', GridItem)
register()
export default {
  name: 'chatControl',
  data () {
    return {
      itemList: [],
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
      videoFeedUrl: 'api/camera/depth',
      logs: [],
      shouldPlaceAfterGrasp: false, // 默认值为 false，表示不需要在抓取后放置
      defaultChose: 'blue' // 默认值为空字符串，表示没有默认的放置位置
    }
  },
  mounted () {
    // 加载完成后显示提示
    this.showInfo()
    this.fetchItems()
  },
  created () {
    this.fetchLog()
    // setInterval(this.fetchLog, 1000)
  },
  methods: {
    fetchLog () {
      // 使用axios或其他方法从后台获取数据
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
          console.log('Logs:', logs)
          // 手动强制触发界面更新
          this.$forceUpdate()
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    },
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
        message: '欢迎进入抓取界面!右下角功能区可以选择是否抓完后放到框中！'
      })
    },
    sendMessage (text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({ author: 'support', type: 'text', data: { text } })
      }
    },
    onMessageWasSent (message) {
      // called when the user sends a message
      this.messageList = [...this.messageList, message]
    },
    openChat () {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    },
    handleScrollToTop () {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType () {
      console.log('Emit typing event')
    },
    editMessage (message) {
      const m = this.messageList.find(m => m.id === message.id)
      m.isEdited = true
      m.data.text = message.data.text
    },
    grasp (index, row) {
      console.log(index, row)
    },
    fetchMessages ({ options = {} }) {
      setTimeout(() => {
        if (options.reset) {
          this.messages = this.addMessages(true)
        } else {
          this.messages = [...this.addMessages(), ...this.messages]
          this.messagesLoaded = true
        }
        // this.addNewMessage()
      })
    },
    addMessages (reset) {
      const messages = []
      messages.push({ id: '1', content: '欢迎使用智慧语音助手！', senderId: '1', username: 'ROBOT-e5', date: new Date().toDateString(), timestamp: new Date().toString().substring(16, 21) })
      return messages
    },
    adcanced_sendMessage (message) {
      this.messages = [
        ...this.messages,
        {
          _id: this.messages.length,
          content: message.content,
          senderId: this.currentUserId,
          timestamp: new Date().toString().substring(16, 21),
          date: new Date().toDateString()
        }
      ]
      // 将消息通过axios发送给后端
      axios.post('/api/chat/startchat', {
        commandStr: message.content
      }).then(response => {
        console.log(response.data)
        const reply = response.data.reply
        reply.forEach(element => {
          this.messages = [
            ...this.messages,
            {
              _id: this.messages.length + 1, // 确保ID是唯一的
              content: element, // 回复的消息内容
              senderId: '1', // 这里应该是机器人或者服务器的ID
              timestamp: new Date().toString().substring(16, 21),
              date: new Date().toDateString()
            }
          ]
        })
      }).catch(error => {
        console.log(error)
      })
      if (message.content === '你好') {
        this.messages = [
          ...this.messages,
          {
            _id: this.messages.length + 1, // 确保ID是唯一的
            content: '你好', // 回复的消息内容
            senderId: '1', // 这里应该是机器人或者服务器的ID
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString()
          }
        ]
      }
    },
    addNewMessage () {
      setTimeout(() => {
        this.messages = [
          ...this.messages,
          {
            _id: this.messages.length,
            content: 'NEW MESSAGE',
            senderId: '1234',
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString()
          }
        ]
      }, 2000)
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

</style>
