<template>
  <d2-container type="full" class="page">
    <d2-grid-layout
      v-bind="layout">
      <d2-grid-item
        v-for="(item, index) in layout.layout"
        :key="index"
        v-bind="item">
        <el-card shadow="never" class="page_card">
          <!--卡片1 智慧语音助手(聊天对话框)-->
          <template v-if="item.i === '0'">
            <el-tag size="mini" type="info" slot="header"> {{item.i}}智慧语音助手</el-tag>
            <div>
              <vue-advanced-chat
                height="calc(100vh - 240px)"
                :current-user-id="currentUserId"
                :rooms="JSON.stringify(rooms)"
                :rooms-loaded="true"
                :messages="JSON.stringify(messages)"
                :messages-loaded="messagesLoaded"
                :show-files="false"
                :textarea-action-enabled="true"
                :room-actions="JSON.stringify(roomsActions)"
                :templates-text="JSON.stringify(templatesText)"
                :text-messages="JSON.stringify(textMessages)"
                @send-message="adcanced_sendMessage($event.detail[0])"
                @fetch-messages="fetchMessages($event.detail[0])"
                @textarea-action-handler="voiceText($event.detail[0])"
                @menu-action-handler="menuActionHandler($event.detail[0])"
              />
            </div>
          </template>
          <!--卡片2 待抓取物品列表-->
          <template v-if="item.i === '1'">
            <el-tag size="mini" type="info" slot="header">{{item.i}}待抓取物品列表 </el-tag>
            <div class="item-list" >
              <el-card v-for="item in itemList" :key="item.id" class="item-card">
                <div class="item-content">
                  <img :src="item.imageURL" class="item-image" />
                  <div class="item-details">
                    <p><strong>编号:</strong> {{ item.id }}</p>
                    <p><strong>物品名称:</strong> {{ item.class }}</p>
                    <p><strong>置信度:</strong> {{ item.confidence }}</p>
                    <p><strong>位置:</strong> {{ item.position }}</p>
                  </div>
                  <el-button type="primary" @click="graspItem(item.class)" style="margin-left: 20px">抓取</el-button>
                </div>
              </el-card>
            </div>
          </template>
          <!--卡片3 抓取摄像头画面-->
          <template v-if="item.i === '2'">
            <el-tag size="mini" type="info" slot="header">{{item.i}}物品摄像头画面</el-tag>
            <div style="text-align: center;">
              <img :src="videoFeedUrl" style="max-width: 80%; height: auto;" />
            </div>
          </template>
        </el-card>
      </d2-grid-item>
    </d2-grid-layout>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import { register } from 'vue-advanced-chat'
import robotIamge from '@/assets/images/robot.png'
import { GridLayout, GridItem } from 'vue-grid-layout'
import axios from 'axios'
Vue.component('d2-grid-layout', GridLayout)
Vue.component('d2-grid-item', GridItem)
register()
export default {
  name: 'chatControl',
  data () {
    return {
      // 布局设置
      layout: {
        layout: [
          { x: 0, y: 0, w: 7, h: 20, i: '0', isDraggable: false },
          { x: 7, y: 0, w: 5, h: 9, i: '2' },
          { x: 7, y: 10, w: 5, h: 11, i: '1' }
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
      // vue-advanced-chat
      currentUserId: '2', // 当前用户ID
      rooms: [
        {
          roomId: '1',
          roomName: 'Aubo_e5',
          avatar: robotIamge,
          users: [
            { _id: '2', username: 'me' },
            { _id: '1', username: 'AuboE5Robot' }
          ]
        },
        {
          roomId: '2',
          roomName: 'Aubo_i5',
          avatar: robotIamge,
          users: [
            { _id: '2', username: 'me' },
            { _id: '3', username: 'AuboI5Robot' }
          ]
        }
      ],
      messages: [],
      messagesLoaded: false,
      // 房间下拉菜单
      roomsActions: [
        { name: 'inviteUser', title: '邀请用户' },
        { name: 'removeUser', title: '删除用户' },
        { name: 'deleteRoom', title: '删除房间' }
      ],
      // 消息模板(键入“/”)
      templatesText: [
        { tag: '初始姿态', text: '设置为初始姿态' },
        { tag: '关节一', text: '关节一旋转5度' },
        { tag: '关节二', text: '关节二旋转6度' },
        { tag: '关节三', text: '关节三旋转5度' },
        { tag: '关节四', text: '关节四旋转6度' },
        { tag: '关节五', text: '关节五旋转6度' },
        { tag: '关节六', text: '关节六旋转4度' },
        { tag: '抓取罐子', text: '抓取罐子然后放到粉色框中' },
        { tag: '抓取盒子', text: '抓取盒子然后放到蓝色框中' },
        { tag: '抓取瓶子', text: '抓取瓶子然后放到绿色框中' }
      ],
      // 聊天系统默认文本消息
      textMessages: {
        ROOMS_EMPTY: '无聊天',
        ROOM_EMPTY: '未选中聊天',
        NEW_MESSAGES: '新消息',
        MESSAGE_DELETED: '消息已删除',
        MESSAGES_EMPTY: '无消息',
        CONVERSATION_STARTED: '聊天开始于:',
        TYPE_MESSAGE: '请输入你的指令',
        SEARCH: '搜索',
        IS_ONLINE: '在线',
        LAST_SEEN: 'last seen ',
        IS_TYPING: '正在输入...',
        CANCEL_SELECT_MESSAGE: '取消'
      },
      videoFeedUrl: 'api/camera/depth', // 抓取摄像头画面的URL
      itemList: []
    }
  },
  mounted () {
    // 加载完成后显示初始提示
    this.showWelcomeInfo()
    // 获取物品列表
    this.fetchItems()
  },
  methods: {
    // 显示初始提示
    showWelcomeInfo () {
      this.$notify({
        title: '提示',
        message: '欢迎使用语音助手!点击停止符号可以使用语音输入功能！'
      })
    },
    // 聊天框添加初始欢迎消息
    addMessages (reset) {
      const messages = []
      messages.push({ id: '1', content: '欢迎使用智慧语音助手！', senderId: '1', username: 'ROBOT-e5', date: new Date().toDateString(), timestamp: new Date().toString().substring(16, 21) })
      return messages
    },
    // 获取历史消息
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
    // 发送消息
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
      // 将消息发送给后端
      axios.post('/api/chat/startchat', {
        commandStr: message.content
      }).then(response => {
        console.log(response.data)
        // 逐一回复
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
    // 添加新消息
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
    },
    // 语音识别功能(禁止按钮实现)
    voiceText () {
      // 弹出提示
      this.$notify({
        title: '提示',
        message: '开始录音，请说话，停止说话后将自动识别文本！'
      })
      // 创建一个新的SpeechRecognition对象
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      // 设置中文语言
      recognition.lang = 'zh-CN'
      // 设置interimResults为false，这样在用户停止说话后立即返回结果
      recognition.interimResults = false
      // 开始语音识别
      recognition.start()
      // 当识别到语音结束时，将识别到的文本设置为message
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript
        console.log('识别到的文本:', text)
        // 发送text文本的消息
        this.messages = [
          ...this.messages,
          {
            _id: this.messages.length + 1, // 确保ID是唯一的
            content: text, // 回复的消息内容
            senderId: '2', // 这里应该是机器人或者服务器的ID
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString()
          }
        ]
        this.$notify({
          title: '成功',
          message: '识别完成！',
          type: 'success'
        })
        // 将text文本消息发送给后端
        axios.post('/api/chat/startchat', {
          commandStr: text
        }).then(response => {
          console.log(response.data)
          // 逐一回复
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
      }
      // 如果发生错误，打印错误信息
      recognition.onerror = (event) => {
        console.error('语音识别错误:', event.error)
      }
    },
    // 房间下拉菜单事件处理(未完成)
    menuActionHandler ({ action, roomId }) {
      switch (action.name) {
        case 'inviteUser':
          return this.inviteUser(roomId)
        case 'removeUser':
          return this.removeUser(roomId)
        case 'deleteRoom':
          return this.deleteRoom(roomId)
      }
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
      try {
        const response = axios.post('/api/grasp/startItemGrasp', null, {
          params: {
            item: name,
            place: 'none'
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
