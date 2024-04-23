<template>
  <d2-container type="card">
    <template slot="header">姿态同步</template>
    <div style="height: 900px; margin: -16px;">
      <SplitPane :min-percent='20' :default-percent='36' split="vertical">
        <!--左侧画面 姿态摄像头画面/注意事项/开始结束同步按钮 -->
        <template slot="paneL">
          <SplitPane split="horizontal" :default-percent='50'>
            <!--左上画面 姿态摄像头画面 -->
            <template slot="paneL">
              <div style="margin: 10px;">
                <img :src="videoFeedUrl" style="width: 100%; height: 100%;" :class="{ 'grayscale': !isCameraActive }" />
              </div>
            </template>
            <template slot="paneR">
              <SplitPane split="horizontal" :default-percent='30'>
                <!--左中画面 注意事项 -->
                <template slot="paneL">
                  <el-tag size="mini" type="info" slot="header">注意事项</el-tag>
                  <div style="margin: 10px;">
                    <div>1.点击“开始同步”后，请站起来<span style="font-weight: bold; color: red;">背起右臂</span>，保证<span style="font-weight: bold; color: red;">左臂</span>在摄像头画面内</div>
                    <div>当大臂身体的夹角[60,150]内，肘关节夹角在[50,180]内时，机械臂开始同步</div>
                    <div>2.点击“退出同步”后，请让<span style="font-weight: bold; color: red;">手掌</span>出现在在摄像头画面内确保退出</div>
                  </div>
                </template>
                <!--左下画面 开始结束同步按钮 -->
                <template slot="paneR">
                  <div style="margin: 10px;text-align: center;">
                    <el-button type="primary" size="medium" @click="startSync">开始同步</el-button>
                    <el-button type="danger" size="medium" @click="stopSync">退出同步</el-button>
                  </div>
                </template>
              </SplitPane>
            </template>
          </SplitPane>
        </template>
        <!--右侧画面 人体/人体预测/机械臂/误差相关数据 -->
        <template slot="paneR">
              <div style="margin: 10px;">
              <el-card class="human-pose-data" style="margin: 10px;text-align: center;">
                <el-tag size="mini" type="info">人体姿态数据</el-tag>
                <!--显示每行4个数据-->
                <el-row :gutter="4">
                  <el-col :span="6">
                    <sync-data :value="anglesData[1]" label="大臂-身体角度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data :value="anglesData[0]" label="左臂肘关节角度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data :value="anglesData[2]" label="大拇指-食指宽度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data :value="anglesData[3]" label="大小拇指宽度"  />
                  </el-col>
                </el-row>
              </el-card>
              <el-card class="robot-prediction-data" style="margin: 10px;text-align: center;">
                <el-tag size="mini" type="info">机械臂预测数据</el-tag>
                <el-row :gutter="4">
                  <el-col :span="6">
                    <sync-data :value="calculateData[2]" label="关节3预测角度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data :value="calculateData[1]" label="关节4预测角度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data :value="calculateData[0]" label="夹爪预测宽度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data :value="calculateData[0]" label="夹爪预测宽度"  />
                  </el-col>
                </el-row>
              </el-card>
              <el-card style="margin: 10px;text-align: center;">
                <el-tag size="mini" type="info">机械臂实际数据</el-tag>
                <el-row :gutter="4">
                  <el-col :span="6">
                    <sync-data :value="robot_data[1]" label="关节3角度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data :value="robot_data[0]" label="关节4角度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data :value="gripperData" label="夹爪宽度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data :value="anglesData[4]" label="状态"  />
                  </el-col>
                </el-row>
              </el-card>
                <el-card style="margin: 10px;text-align: center;">
                  <el-tag size="mini" type="info">误差值</el-tag>
                  <el-row :gutter="4">
                    <el-col :span="6">
                      <sync-data :value="errorData.joint3" label="关节3误差" />
                    </el-col>
                    <el-col :span="6">
                      <sync-data :value="errorData.joint4" label="关节4误差" />
                    </el-col>
                    <el-col :span="6">
                      <sync-data :value="errorData.gripper" label="夹爪误差" />
                    </el-col>
                    <el-col :span="6">
                      <sync-data :value="errorData.average" label="均误差"  />
                    </el-col>
                  </el-row>
                </el-card>
              </div>
        </template>
      </SplitPane>
    </div>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import SplitPane from 'vue-splitpane'
import SyncData from '@/components/SyncData.vue'
import axios from 'axios'
Vue.component('SplitPane', SplitPane)
export default {
  components: {
    SyncData
  },
  data: function () {
    return {
      isCameraActive: true, // 摄像头是否激活状态(不为灰)
      videoFeedUrl: '/api/camera/pose', // 后端姿态摄像头画面的URL
      anglesData: [], // 人体姿态数据
      calculateData: [], // 人体姿态预测数据
      robot_data: [], // 机械臂数据
      gripperData: '', // 夹爪宽度数据
      // 误差数据
      errorData: {
        joint3: '',
        joint4: '',
        gripper: '',
        average: ''
      }
    }
  },
  mounted () {
    // 加载完成后显示欢迎提示
    this.showWelcomeInfo()
  },
  created () {
    this.fetchPoseData() // 获取人体姿态相关数据
    this.fetchRobotData()// 获取机械臂相关数据
    this.fetchGripperData() // 获取夹爪相关数据
    setInterval(this.fetchPoseData, 500) // 每隔0.5秒获取一次人体姿态数据
    setInterval(this.fetchRobotData, 500) // 每隔0.5秒获取一次机器人数据
    setInterval(this.fetchGripperData, 500) // 每隔0.5秒获取一次夹爪相关数据
  },
  methods: {
    // 显示欢迎提示
    showWelcomeInfo () {
      this.$notify({
        title: '提示',
        message: '欢迎使用同步姿态功能！请起立背起右手'
      })
    },
    // 获取人体姿态相关数据
    fetchPoseData () {
      axios.get('/api/sync/get_sync_data')
        .then(response => {
          this.anglesData = response.data.data // 将后台返回的数据赋值给anglesData变量
          // 保留三位小数
          this.anglesData[0] = this.anglesData[0].toFixed(3)
          this.anglesData[1] = this.anglesData[1].toFixed(3)
          this.anglesData[2] = this.anglesData[2].toFixed(3)
          this.anglesData[3] = this.anglesData[3].toFixed(3)
          // 设置夹爪宽度范围为6到45，小于6为1.0，大于45为0.0，其余为线性变化
          if (this.anglesData[2] < 6) this.calculateData[0] = 255.0
          else if (this.anglesData[2] > 45) this.calculateData[0] = 0.0
          else this.calculateData[0] = ((1.0 - (this.anglesData[2] - 6) / 39.0) * 255).toFixed(0)
          // 设置关节4的角度范围为-40到90，小于50为-40，大于180为90
          if (this.anglesData[0] < 50) this.calculateData[1] = -40
          else if (this.anglesData[0] > 180) this.calculateData[1] = 90
          else this.calculateData[1] = (this.anglesData[0] - 90.000).toFixed(3)
          // 设置关节3的角度范围为180 - angle2，小于65为115，大于150为30
          if (this.anglesData[1] < 65) this.calculateData[2] = 115
          else if (this.anglesData[1] > 150) this.calculateData[2] = 30
          else this.calculateData[2] = (180.000 - this.anglesData[1]).toFixed(3)
          // 若机械臂状态为0，则显示为“正常”，否则显示为“异常”
          if (this.anglesData[4] === 0) {
            this.anglesData[4] = '未同步'
          } else {
            this.anglesData[4] = '同步中'
          }
          if (this.anglesData[0] < 50 || this.anglesData[0] > 180 || this.anglesData[1] < 65 || this.anglesData[1] > 150) {
            this.isCameraActive = false
            this.$message({
              message: '请站起来背起右臂，保证左臂在摄像头画面内',
              type: 'warning'
            })
          } else {
            this.isCameraActive = true
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    },
    // 获取机械臂相关数据
    fetchRobotData () {
      // 使用axios或其他方法从后台获取数据
      axios.get('/api/get_current_angle') // 更新 API 地址
        .then(response => {
          // 从返回的数据中提取关节3和关节4的角度数据
          const joint3Angle = response.data.current_position[2] // 第3个元素对应关节3角度
          const joint4Angle = response.data.current_position[3] // 第4个元素对应关节4角度
          // 更新组件中的数据
          this.robot_data = [joint4Angle, joint3Angle] // 注意：这里角度顺序可能需要调整
          this.errorData.joint3 = Math.abs(joint3Angle - this.calculateData[2]).toFixed(3)
          this.errorData.joint4 = Math.abs(joint4Angle - this.calculateData[1]).toFixed(3)
          this.errorData.average = ((this.errorData.joint3 + this.errorData.joint4 + this.errorData.gripper) / 3).toFixed(3)
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    },
    // 获取夹爪相关数据
    fetchGripperData () {
      // 使用axios或其他方法从后台获取夹爪相关数据
      axios.get('/api/gripper/get_gripper_info')
        .then(response => {
          this.gripperData = response.data.gripper_gPR // 将夹爪相关数据赋值给gripperData变量
          this.errorData.gripper = Math.abs(this.gripperData - this.calculateData[0]).toFixed(3)
        })
        .catch(error => {
          console.error('Error fetching gripper data:', error)
        })
    },
    // 开始同步
    startSync () {
      axios.post('/api/sync/start_sync_pose')
        .then(response => {
          this.$message({
            message: '开始同步,请站起来背起右臂，保证左臂在摄像头画面内\n' +
              '当大臂身体的夹角[60,150]内，肘关节夹角在[50,180]内时，机械臂开始同步',
            type: 'success'
          })
        })
        .catch(error => {
          console.error('Error starting sync:', error)
        })
    },
    // 退出同步
    stopSync () {
      axios.post('/api/sync/stop_sync_pose')
        .then(response => {
          this.$message({
            message: '退出同步',
            type: 'success'
          })
        })
        .catch(error => {
          console.error('Error stopping sync:', error)
        })
    },
    // 获取测试数据
    getVideoFeedUrl () {
      axios.get('/api/test').then(response => {
        console.log(response.data)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
/* 添加一个新的CSS类来应用灰度滤镜 */
.grayscale {
  filter: grayscale(100%);
}
</style>
