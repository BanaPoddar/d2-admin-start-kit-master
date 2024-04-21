<template>
  <d2-container type="card">

    <template slot="header">姿态同步</template>
    <vue-tour v-if="showTour" :steps="steps" />
    <div style="height: 900px; margin: -16px;">
      <SplitPane :min-percent='20' :default-percent='50' split="vertical">
        <template slot="paneL">
          <div style="margin: 10px;">
            <!--摄像头画面不超过paneL范围-->
            <img :src="videoFeedUrl" style="width: 100%; height: 100%;" />
          </div>
        </template>
        <template slot="paneR">
          <SplitPane split="horizontal" :default-percent='90'>
            <template slot="paneL">
              <div style="margin: 10px;">
              <el-card class="human-pose-data" style="margin: 10px;text-align: center;">
                <el-tag size="mini" type="info">人体姿态数据</el-tag>
                <!--显示每行4个数据-->
                <el-row :gutter="4">
                  <el-col :span="6">
                    <sync-data value="90°" label="大臂-身体角度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data value="0°" label="左臂肘关节角度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data value="144" label="大拇指-食指宽度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data value="sync" label="大小拇指宽度"  />
                  </el-col>
                </el-row>
              </el-card>
              <el-card class="robot-prediction-data" style="margin: 10px;text-align: center;">
                <el-tag size="mini" type="info">机械臂预测数据</el-tag>
                <el-row :gutter="4">
                  <el-col :span="6">
                    <sync-data value="90°" label="关节3预测角度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data value="0°" label="关节4预测角度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data value="144" label="夹爪预测宽度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data value="sync" label="夹爪预测宽度"  />
                  </el-col>
                </el-row>
              </el-card>
              <el-card style="margin: 10px;text-align: center;">
                <el-tag size="mini" type="info">机械臂实际数据</el-tag>
                <el-row :gutter="4">
                  <el-col :span="6">
                    <sync-data value="90°" label="关节3角度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data value="0°" label="关节4角度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data value="144" label="夹爪宽度" />
                  </el-col>
                  <el-col :span="6">
                    <sync-data value="sync" label="状态"  />
                  </el-col>
                </el-row>
              </el-card>
                <el-card style="margin: 10px;text-align: center;">
                  <el-tag size="mini" type="info">误差值</el-tag>
                  <el-row :gutter="4">
                    <el-col :span="6">
                      <sync-data value="90°" label="关节3误差" />
                    </el-col>
                    <el-col :span="6">
                      <sync-data value="0°" label="关节4误差" />
                    </el-col>
                    <el-col :span="6">
                      <sync-data value="144" label="夹爪误差" />
                    </el-col>
                    <el-col :span="6">
                      <sync-data value="sync" label="均误差"  />
                    </el-col>
                  </el-row>
                </el-card>
              </div>
            </template>
            <template slot="paneR">
              <div style="margin: 10px;text-align: center;">
                <!--使得两个按钮居中-->
                <el-button type="primary" size="medium" @click="getVideoFeedUrl">开始同步</el-button>
                <el-button type="danger" size="medium" @click="getVideoFeedUrl">退出同步</el-button>
              </div>
            </template>
          </SplitPane>
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
    SyncData,
  },
  data () {
    return {
      videoFeedUrl: '/api/camera/pose', // 后端Flask接口地址
      participants: [
        { i: '1' },
        { i: '2' },
        { i: '3' },
        { i: '4' }
      ],
      steps: [
        {
          target: '.human-pose-data', // CSS选择器，指向你想要突出显示的元素
          content: '这是人体姿态数据区域，你可以在这里查看人体姿态的相关数据。'
        },
        {
          target: '.robot-prediction-data',
          content: '这是机械臂预测数据区域，你可以在这里查看机械臂的预测数据。'
        }
      ],
      showTour: true
    }
  },
  mounted () {
    // 加载完成后显示提示
    this.showInfo()
  },
  methods: {
    // 显示提示
    showInfo () {
      this.$notify({
        title: '提示',
        message: '欢迎使用同步姿态功能！请起立背起右手'
      })
    },
    // 获取测试数据
    getVideoFeedUrl () {
      axios.get('/api/test').then(response => {
        console.log(response.data)
      }).catch(error => {
        console.log(error)
      })
    },
    // 抓取物体
    grasp (index, row) {
      console.log(index, row)
    }
  }
}
</script>
