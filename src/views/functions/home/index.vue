<template>
  <d2-container type="full" class="page">
    <d2-grid-layout
      v-bind="layout">
      <d2-grid-item
        v-for="(item, index) in layout.layout"
        :key="index"
        v-bind="item">
        <el-card shadow="never" class="page_card">
          <!-- 卡片1 机械臂位置(m)展示-->
          <template v-if="item.i === '0'">
            <div class="center-bold">机械臂位置(m)</div>
            <div class="data-display-container">
              <home-robot-data :value="armPosition.x" label="X" style="width: 33%" />
              <home-robot-data :value="armPosition.y" label="Y" style="width: 33%"/>
              <home-robot-data :value="armPosition.z" label="Z" style="width: 33%"/>
            </div>
          </template>
          <!-- 卡片2 机械臂姿态(deg)展示-->
          <template v-if="item.i === '1'">
            <div class="center-bold">机械臂姿态(deg)</div>
            <div class="data-display-container">
              <home-robot-data :value="armPose.rx" label="RX" style="width: 33%" />
              <home-robot-data :value="armPose.ry" label="RY" style="width: 33%"/>
              <home-robot-data :value="armPose.rz" label="RZ" style="width: 33%"/>
            </div>
          </template>
          <!-- 卡片3 机械臂3D仿真+关节控制-->
          <template v-if="item.i === '2'">
            <div class="box-content">
              <!-- isAsync 仿真模式/真实模式 joints-changed 获得实时更新的关节角度值数组-->
              <robot-model ref="robotModel" :isAsync="isAsync" @joints-changed="updateJoints"/>
            </div>
          </template>
          <!-- 卡片4 机械臂/夹爪控制中心-->
          <template v-if="item.i === '3'">
            <div class="box-content">
              <div class="left-align">机械臂控制</div>
              <div class="button-container" style="margin-bottom: 20px">
                <el-button type="primary" @click="setHomePose">设置为初始姿态</el-button>
                <el-button type="danger">急停</el-button>
                <el-button type="success">启动</el-button>
              </div>
              <hr>
              <div class="left-align">异步发送关节数据(仿真模式)</div>
              <div class="switch-container" style="margin-bottom: 20px">
                <el-switch v-model="isAsync" active-text="开启" inactive-text="关闭" class="switch-spacing" @change="confirmModeChange"></el-switch>
                <el-button type="primary" v-show="isAsync" @click="sendJointData" >发送关节数据</el-button>
              </div>
              <hr>
              <div class="left-align">夹爪设置</div>
              <div class="input-item">
                <div class="status-container">
                  <span>夹爪状态：</span>
                  <el-tag :type="gripperStatus === '未使用' ? 'info' : gripperStatus === '已复位' ? 'warning' : 'success'" class="tag-spacing">{{ gripperStatus }}</el-tag>
                  <el-button @click="toggleGripperStatus" type="primary">{{ gripperButtonLabel }}</el-button>
                </div>
                <div class="input-item">
                  <span>夹爪宽度：</span>
                  <el-input-number v-model="gripperWidth" :min="0" :max="255" :disabled="gripperStatus !== '已激活'"></el-input-number>
                  <el-button type="primary" @click="setGripperWidth" :disabled="gripperStatus !== '已激活'" style="margin-left: 10px">设置宽度</el-button>
                  <span style="margin-left: 10px">(最小:0 | 最大:255)</span>
                </div>
                <div class="input-item">
                  <span>夹爪速度：</span>
                  <el-input-number v-model="gripperSpeed" :min="0" :max="255" :disabled="gripperStatus !== '已激活'"></el-input-number>
                  <el-button type="primary" @click="setGripperSpeed" :disabled="gripperStatus !== '已激活'" style="margin-left: 10px">设置速度</el-button>
                  <span style="margin-left: 10px">(最小:0 | 最大:255)</span>
                </div>
                <div class="input-item">
                  <span>夹爪力度：</span>
                  <el-input-number v-model="gripperForce" :min="0" :max="255" :disabled="gripperStatus !== '已激活'"></el-input-number>
                  <el-button type="primary" @click="setGripperForce" :disabled="gripperStatus !== '已激活'" style="margin-left: 10px">设置力度</el-button>
                  <span style="margin-left: 10px">(最小:0 | 最大:255)</span>
                </div>
              </div>
            </div>
          </template>
          <!-- 卡片5 机械臂启动情况/耗电量图标echarts展示-->
          <template v-if="item.i === '4'">
            <div class="box-content">
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
                        v-model="utilizationDate"
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
import VeLine from 'v-charts/lib/line.common'
Vue.component('d2-grid-layout', GridLayout)
Vue.component('d2-grid-item', GridItem)
// echarts图表内静态数据
const DATA_FROM_BACKEND = {
  columns: ['date', 'utilization', 'eleConsumption'],
  rows: [
    { date: '2024-03-01', utilization: 1, eleConsumption: 10.93 },
    { date: '2024-03-02', utilization: 2, eleConsumption: 22.30 },
    { date: '2024-03-03', utilization: 3, eleConsumption: 36.23 },
    { date: '2024-03-04', utilization: 7, eleConsumption: 64.23 },
    { date: '2024-03-05', utilization: 4, eleConsumption: 84.92 },
    { date: '2024-03-06', utilization: 3, eleConsumption: 62.93 },
    { date: '2024-03-07', utilization: 9, eleConsumption: 22.93 },
    { date: '2024-03-08', utilization: 2, eleConsumption: 62.93 },
    { date: '2024-03-09', utilization: 3, eleConsumption: 52.93 },
    { date: '2024-03-10', utilization: 4, eleConsumption: 32.93 },
    { date: '2024-03-11', utilization: 8, eleConsumption: 22.93 },
    { date: '2024-03-12', utilization: 3, eleConsumption: 82.92 },
    { date: '2024-03-13', utilization: 4, eleConsumption: 10.23 },
    { date: '2024-03-14', utilization: 9, eleConsumption: 12.93 },
    { date: '2024-03-15', utilization: 3, eleConsumption: 42.93 }
  ]
}
export default {
  name: 'HomeRobot',
  components: {
    HomeRobotData,
    RobotModel,
    VeLine
  },
  data () {
    return {
      // 布局设置
      layout: {
        layout: [
          { x: 0, y: 0, w: 6, h: 4, i: '0' },
          { x: 6, y: 0, w: 6, h: 4, i: '1' },
          { x: 0, y: 4, w: 8, h: 16, i: '2', isDraggable: false },
          { x: 8, y: 4, w: 4, h: 16, i: '3' },
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
      // 机械臂位置数据
      armPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      // 机械臂姿态数据
      armPose: {
        rx: 0,
        ry: 0,
        rz: 0
      },
      // 机械臂关节角度数据
      joints: [0, 0, 1.57, 0, 1.57, 0],
      // true仿真模式(异步发送关节变化数据)/false真实模式(同步发送关节变化数据)
      isAsync: true,
      // 夹爪相关数据
      gripperWidth: 0,
      gripperSpeed: 255,
      gripperForce: 150,
      gripperStatus: '未使用',
      // 图表设置参数
      chartSettings: {
        xAxisType: 'time',
        area: true,
        axisSite: { right: ['eleConsumption'] },
        labelMap: { utilization: '启动次数', eleConsumption: '耗电量' }
      },
      loading: false,
      dataEmpty: false,
      // 图表数据
      chartData: {
        columns: [],
        rows: []
      },
      // 图表时间选择器中的方法选项
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
            const start = new Date(2024, 3, 1)
            const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 时间选择器数据
      utilizationDate: ''
    }
  },
  mounted () {
    // 加载完成后显示页面初始提示
    this.showWelcomeInfo()
  },
  computed: {
    // 夹爪按钮文本
    gripperButtonLabel () {
      if (this.gripperStatus === '未使用' || this.gripperStatus === '已激活') {
        return '复位(重置)'
      } else if (this.gripperStatus === '已复位') {
        return '激活'
      }
    }
  },
  created () {
    // 获取机械臂当前位置和姿态
    this.getCurrentPose()
    setInterval(() => {
      this.getCurrentPose()
    }, 1500) // 每隔0.5秒更新一次数据
    // 初始化图表默认选择的时间段
    this.initDefaultDate()
    // 获取图表数据
    this.getChartData()
  },
  methods: {
    // 显示页面初始提示
    showWelcomeInfo () {
      this.$notify({
        title: '提示',
        message: '欢迎进入机械臂数据控制中心！'
      })
    },
    // 获取机械臂当前位置和姿态
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
    // 更新关节角度数据
    updateJoints (newJoints) {
      this.joints = newJoints
    },
    // 设置机械臂回到初始位置
    setHomePose () {
      // eslint-disable-next-line no-undef
      const joint_values = [0, 0, 1.57, 0, 1.57, 1]
      // 发送给后端 真实运动
      axios.post('/api/change_joint_angle', { joint_values })
        .then(response => {
          // 给出提示
          this.$notify({
            title: '成功',
            message: '机械臂已经回到初始位置！',
            type: 'success'
          })
          // 设置3d模型关节的值
          // this.$refs.robotModel.handleSetModelJointValues(joint_values)
        }).catch(error => {
          console.error('请求失败：', error)
        })
    },
    // 确认切换模式
    confirmModeChange (newVal) {
      if (!newVal) {
        this.$confirm('警告：真实模式机械臂可能发生剧烈抖动，您确定关闭仿真模式吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isAsync = newVal
        }).catch(() => {
          this.isAsync = !newVal
        })
      }
    },
    // 异步发送关节数据
    sendJointData () {
      // eslint-disable-next-line no-undef
      const joint_values = this.joints
      console.log('joint_values:', joint_values)
      axios.post('/api/change_joint_angle', { joint_values })
        .then(response => {
          console.log('后台响应：', response.data)
          this.$notify({
            title: '成功',
            message: '成功发送关节角度数据！',
            type: 'success'
          })
        }).catch(error => {
          console.error('请求失败：', error)
        })
    },
    // 设置夹爪状态
    toggleGripperStatus () {
      if (this.gripperStatus === '未使用') {
        this.gripperStatus = '已复位'
        axios.post('/api/gripper/reset_gripper')
          .then(response => {
            this.$notify({
              title: '成功',
              message: '成功复位夹爪，请点击激活按钮激活夹爪！',
              type: 'success'
            })
          }).catch(error => {
            console.error('请求失败：', error)
          })
      } else if (this.gripperStatus === '已复位') {
        this.gripperStatus = '已激活'
        axios.post('/api/gripper/active_gripper')
          .then(response => {
            this.$notify({
              title: '成功',
              message: '成功激活夹爪！您现在可以控制夹爪了',
              type: 'success'
            })
          }).catch(error => {
            console.error('请求失败：', error)
          })
      } else if (this.gripperStatus === '已激活') {
        this.gripperStatus = '已复位'
      }
    },
    // 设置夹爪宽度
    setGripperWidth () {

    },
    // 设置夹爪宽度
    setGripperSpeed () {

    },
    // 设置夹爪宽度
    setGripperForce () {

    },
    // 设置日期变化
    handleDateChange () {
      this.getChartData()
    },
    // 初始化默认时间段
    initDefaultDate () {
      const start = new Date(2024, 2, 1)
      const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * 15)
      this.utilizationDate = [start, end]
    },
    // 获取图表数据
    getChartData () {
      setTimeout(() => {
        this.chartData = {
          columns: ['date', 'utilization', 'eleConsumption'],
          rows: []
        }
        for (let i = 0; i < DATA_FROM_BACKEND.rows.length; i++) {
          const item = DATA_FROM_BACKEND.rows[i]
          const currDate = str2Date(item.date)
          const start = this.utilizationDate[0]
          const end = this.utilizationDate[1]
          if (currDate.getTime() >= start.getTime() && currDate.getTime() <= end.getTime()) {
            this.chartData.rows.push(item)
          }
        }
        this.dataEmpty = false
        this.loading = false
      }, 1000)
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
      .box-content {
        padding-left: 10px; /* 调整这个值来改变左边的空白区域的大小 */
      }

      .left-align {
        text-align: left;
        margin-bottom: 20px;
        margin-top: 20px;
        /* 加粗 字号变大 */
        font-weight: bold;
        font-size: 20px;
      }

      .switch-spacing {
        margin-right: 20px; /* 调整这个值来改变间距的大小 */
      }

      .tag-spacing {
        margin-right: 10px; /* 调整这个值来改变标签和按钮之间的间距 */
      }

      .button-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 10px; /* 调整这个值来改变按钮之间的间隔 */
      }

      .status-container, .input-item {
        margin-bottom: 20px; /* 调整这个值来改变行间距的大小 */
      }

      .input-container {
        display: flex;
        flex-direction: column;
        gap: 10px; /* 调整这个值来改变输入框之间的间隔 */
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
