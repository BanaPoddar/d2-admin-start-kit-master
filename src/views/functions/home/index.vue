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
            <div class="center-bold">机械臂位置(m)</div>
            <div class="data-display-container">
              <home-robot-data :value="armPosition.x" label="X" style="width: 33%" />
              <home-robot-data :value="armPosition.y" label="Y" style="width: 33%"/>
              <home-robot-data :value="armPosition.z" label="Z" style="width: 33%"/>
            </div>
          </template>
          <template v-if="item.i === '1'">
            <div class="center-bold">机械臂姿态(deg)</div>
            <div class="data-display-container">
              <home-robot-data :value="armPose.rx" label="RX" style="width: 33%" />
              <home-robot-data :value="armPose.ry" label="RY" style="width: 33%"/>
              <home-robot-data :value="armPose.rz" label="RZ" style="width: 33%"/>
            </div>
          </template>
          <template v-if="item.i === '3'">
<!--            <div class="box-content">
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
            </div>-->
            <div class="box-content">
              <div class="center-bold">机械臂控制</div>
              <div class="button-container">
                <el-button type="primary">设置为初始姿态</el-button>
                <el-button type="danger">急停</el-button>
                <el-button type="success">启动</el-button>
              </div>
              <div class="center-bold">夹爪设置</div>
              <div class="input-container">
                <div class="input-item">
                  <span>夹爪宽度：</span>
                  <el-input-number v-model="gripperWidth" :min="0" :max="100"></el-input-number>
                </div>
                <div class="input-item">
                  <span>夹爪速度：</span>
                  <el-input-number v-model="gripperSpeed" :min="0" :max="100"></el-input-number>
                </div>
              </div>
              <div class="center-bold">夹爪状态</div>
              <div class="status-container">
                <el-tag :type="isConnected ? 'success' : 'danger'">{{ isConnected ? '已连接' : '未连接' }}</el-tag>
                <el-button @click="toggleConnection">{{ isConnected ? '断开' : '连接' }}</el-button>
              </div>
            </div>
          </template>
          <template v-if="item.i === '2'">
            <div class="box-content">
              <!-- three.js -->
              <robot-model />
            </div>
          </template>
          <template v-if="item.i === '4'">
          </template>
          <template v-if="item.i === '5'">
            <div class="box-content">
              <!-- Echart 图表展示 -->
              <div class="statistics-layout" id="robot-usage">
                <el-row>
                  <el-col :span="4">
                    <div style="padding: 20px">
                      <div>
                        <div style="color: #909399;font-size: 14px">本月启动总数</div>
                        <div style="color: #606266;font-size: 24px;padding: 10px 0">129</div>
                        <div>
                          <span class="color-success" style="font-size: 14px">+13%</span>
                          <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
                        </div>
                      </div>
                      <div style="margin-top: 20px;">
                        <div style="color: #909399;font-size: 14px">本周启动总数</div>
                        <div style="color: #606266;font-size: 24px;padding: 10px 0">27</div>
                        <div>
                          <span class="color-danger" style="font-size: 14px">-19%</span>
                          <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
                        </div>
                      </div>
                      <div style="margin-top: 20px;">
                        <div style="color: #909399;font-size: 14px">本月总耗电</div>
                        <div style="color: #606266;font-size: 24px;padding: 10px 0">300.4</div>
                        <div>
                          <span class="color-success" style="font-size: 14px">+10%</span>
                          <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
                        </div>
                      </div>
                      <div style="margin-top: 20px;">
                        <div style="color: #909399;font-size: 14px">本周总耗电</div>
                        <div style="color: #606266;font-size: 24px;padding: 10px 0">121.3</div>
                        <div>
                          <span class="color-danger" style="font-size: 14px">-10%</span>
                          <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="20">
                    <div style="padding: 10px;border-left:1px solid #DCDFE6">
                      <el-date-picker
                        style="float: right;z-index: 1"
                        size="small"
                        v-model="orderCountDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="handleDateChange"
                        :picker-options="pickerOptions">
                      </el-date-picker>
                      <div>
                        <ve-line
                          :data="chartData"
                          :legend-visible="false"
                          :loading="loading"
                          :data-empty="dataEmpty"
                          :settings="chartSettings"></ve-line>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
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
import { str2Date } from '@/libs/data'
import axios from 'axios'
import RobotModel from '@/components/robotModel'
Vue.component('d2-grid-layout', GridLayout)
Vue.component('d2-grid-item', GridItem)
const DATA_FROM_BACKEND = {
  columns: ['date', 'orderCount', 'orderAmount'],
  rows: [
    { date: '2024-03-01', orderCount: 1, orderAmount: 10.93 },
    { date: '2024-03-02', orderCount: 2, orderAmount: 22.30 },
    { date: '2024-03-03', orderCount: 3, orderAmount: 36.23 },
    { date: '2024-03-04', orderCount: 7, orderAmount: 64.23 },
    { date: '2024-03-05', orderCount: 4, orderAmount: 84.92 },
    { date: '2024-03-06', orderCount: 3, orderAmount: 62.93 },
    { date: '2024-03-07', orderCount: 9, orderAmount: 22.93 },
    { date: '2024-03-08', orderCount: 2, orderAmount: 62.93 },
    { date: '2024-03-09', orderCount: 3, orderAmount: 52.93 },
    { date: '2024-03-10', orderCount: 4, orderAmount: 32.93 },
    { date: '2024-03-11', orderCount: 8, orderAmount: 22.93 },
    { date: '2024-03-12', orderCount: 3, orderAmount: 82.92 },
    { date: '2024-03-13', orderCount: 4, orderAmount: 10.23 },
    { date: '2024-03-14', orderCount: 9, orderAmount: 12.93 },
    { date: '2024-03-15', orderCount: 3, orderAmount: 42.93 }
  ]
}
export default {
  name: 'PageDemoPage1',
  components: {
    HomeRobotData,
    RobotModel
  },
  data () {
    return {
      myValue: 3.21,
      layout: {
        layout: [
          { x: 0, y: 0, w: 6, h: 4, i: '0' },
          { x: 6, y: 0, w: 6, h: 4, i: '1' },
          { x: 0, y: 4, w: 8, h: 15, i: '2', isDraggable: false },
          { x: 8, y: 4, w: 4, h: 15, i: '3' },
          { x: 0, y: 16, w: 12, h: 14, i: '4' }
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
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const start = new Date(2024, 3, 1)
            const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一月',
          onClick (picker) {
            const start = new Date(2024, 3, 15)
            const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      orderCountDate: '',
      chartSettings: {
        xAxisType: 'time',
        area: true,
        axisSite: { right: ['orderAmount'] },
        labelMap: { orderCount: '启动次数', orderAmount: '耗电量' }
      },
      chartData: {
        columns: [],
        rows: []
      },
      loading: false,
      dataEmpty: false,
      armPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      armPose: {
        rx: 0,
        ry: 0,
        rz: 0
      },
      gripperWidth: 0,
      gripperSpeed: 0,
      isConnected: false
    }
  },
  mounted () {
    // 加载完成后显示提示
    this.showInfo()
  },
  created () {
    this.initOrderCountDate()
    this.getData()
    this.getCurrentPose()
    this.getCurrentAngle()
    setInterval(() => {
      this.getCurrentPose()
    }, 1500) // 每隔0.5秒更新一次数据
  },
  methods: {
    toggleConnection () {
      this.isConnected = !this.isConnected
    },
    handleDateChange () {
      this.getData()
    },
    initOrderCountDate () {
      const start = new Date(2024, 2, 1)
      const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * 7)
      this.orderCountDate = [start, end]
    },
    getData () {
      setTimeout(() => {
        this.chartData = {
          columns: ['date', 'orderCount', 'orderAmount'],
          rows: []
        }
        for (let i = 0; i < DATA_FROM_BACKEND.rows.length; i++) {
          const item = DATA_FROM_BACKEND.rows[i]
          const currDate = str2Date(item.date)
          const start = this.orderCountDate[0]
          const end = this.orderCountDate[1]
          if (currDate.getTime() >= start.getTime() && currDate.getTime() <= end.getTime()) {
            this.chartData.rows.push(item)
          }
        }
        this.dataEmpty = false
        this.loading = false
      }, 1000)
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
        message: '欢迎进入机械臂数据大屏！'
      })
    },
    getCurrentPose () {
      axios.get('/api/get_current_pose').then(response => {
        this.armPose = response.data.current_pose.deg
        this.armPose.rx = this.armPose.rx.toFixed(5)
        this.armPose.ry = this.armPose.ry.toFixed(5)
        this.armPose.rz = this.armPose.rz.toFixed(5)
        this.armPosition = response.data.current_pose.position
        this.armPosition.x = this.armPosition.x.toFixed(5)
        this.armPosition.y = this.armPosition.y.toFixed(5)
        this.armPosition.z = this.armPosition.z.toFixed(5)
      }).catch(error => {
        console.error('Error fetching gripper data:', error)
      })
    },
    getCurrentAngle () {
      // 使用 axios发送请求到 http://127.0.0.1:5000/get_current_angle
      axios.get('/api/get_current_angle').then(response => {
        console.log(response.data)
        this.joint1 = response.data.current_position[0]
        this.joint2 = response.data.current_position[1]
        this.joint3 = response.data.current_position[2]
        this.joint4 = response.data.current_position[3]
        this.joint5 = response.data.current_position[4]
        this.joint6 = response.data.current_position[5]
      }).catch(error => {
        console.error('Error fetching gripper data:', error)
      })
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

.statistics-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}
</style>
