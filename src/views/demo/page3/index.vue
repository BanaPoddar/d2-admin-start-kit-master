<template>
  <d2-container type="card">
    <template slot="header">同步姿态</template>
    <div style="height: 400px; margin: -16px;">
      <SplitPane :min-percent='20' :default-percent='30' split="vertical">
        <template slot="paneL">
          <div style="margin: 10px;">
            <!-- 在此处添加用于显示摄像头画面的图像元素 -->
            <img :src="videoFeedUrl" style="width: 100%; height: 100%;" />
          </div>
        </template>
        <template slot="paneR">
          <SplitPane split="horizontal">
            <template slot="paneL"><div style="margin: 10px;">右上</div></template>
            <template slot="paneR"><div style="margin: 10px;">右下</div></template>
          </SplitPane>
        </template>
      </SplitPane>
    </div>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import SplitPane from 'vue-splitpane'
Vue.component('SplitPane', SplitPane)
export default {
  data () {
    return {
      videoFeedUrl: '/api/video_feed' // 后端Flask接口地址
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
    }
  }
}
</script>
