<template>
  <d2-container type="card">
    <template slot="header">姿态同步</template>
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
              <el-card style="margin: 10px;text-align: center;">
                <el-tag size="mini" type="info">机械臂数据</el-tag>
                <!--显示每行4个数据-->
                <el-row :gutter="4">
                  <el-col :span="6">
                    <el-card style="margin: 5px;text-align: center;">
                      <!--上半部分显示数据，中间有一个水平分割线，下半部分显示数据名称，如“关节3角度”-->
                      <div style="margin: 5px;">
<!--                        字号大一点 颜色为暗红色 加粗-->
                        <div style="font-size: 30px;color: #8B0000;font-weight: bold;">90°</div>
                        <el-divider></el-divider>
                        <!--不使用el-tag-->
                        <div style="font-size: 20px;font-weight: bold;">关节3角度</div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <el-card style="margin: 5px;text-align: center;">
                      <!--上半部分显示数据，中间有一个水平分割线，下半部分显示数据名称，如“关节3角度”-->
                      <div style="margin: 5px;">
                        <!--                        字号大一点 颜色为暗红色 加粗-->
                        <div style="font-size: 30px;color: #8B0000;font-weight: bold;">0°</div>
                        <el-divider></el-divider>
                        <!--不使用el-tag-->
                        <div style="font-size: 20px;font-weight: bold;">关节4角度</div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <el-card style="margin: 5px;text-align: center;">
                      <!--上半部分显示数据，中间有一个水平分割线，下半部分显示数据名称，如“关节3角度”-->
                      <div style="margin: 5px;">
                        <!--                        字号大一点 颜色为暗红色 加粗-->
                        <div style="font-size: 30px;color: #8B0000;font-weight: bold;">144</div>
                        <el-divider></el-divider>
                        <!--不使用el-tag-->
                        <div style="font-size: 20px;font-weight: bold;">夹爪宽度(0-255)</div>
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <el-card style="margin: 5px;text-align: center;">
                      <!--上半部分显示数据，中间有一个水平分割线，下半部分显示数据名称，如“关节3角度”-->
                      <div style="margin: 5px;">
                        <!--                        字号大一点 颜色为暗红色 加粗-->
                        <div style="font-size: 30px;color: #8B0000;font-weight: bold;">同步模式</div>
                        <el-divider></el-divider>
                        <!--不使用el-tag-->
                        <div style="font-size: 20px;font-weight: bold;">机械臂状态</div>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-card>
              <el-card style="margin: 10px;text-align: center;">
                <el-tag size="mini" type="info">人体姿态数据</el-tag>
              </el-card>
              <el-card style="margin: 10px;text-align: center;">
                <el-tag size="mini" type="info">关节预测数据</el-tag>
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
import axios from 'axios'
Vue.component('SplitPane', SplitPane)
export default {
  data () {
    return {
      videoFeedUrl: '/api/video_feed',// 后端Flask接口地址
      participants: [
        { i: '1' },
        { i: '2' },
        { i: '3' },
        { i: '4' }
      ]
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
        message: '在横向或者纵向的分割线上拖拽调整分区大小'
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
