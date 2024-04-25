<template>
  <div class="slider-block">
    <div v-for="joint in joints" :key="joint.name" class="slider-item">
      <p class="demonstration">{{ joint.description }}</p>
      <el-slider v-model.number="joint.value" show-input :min="min" :max="max" :step="0.1" @input="sliderInput($event,joint.name,joint.direction)" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    isAsync: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      joints: [
        { name: 'shoulder_joint', description: '关节一', value: 0, direction: 'y' },
        { name: 'upperArm_joint', description: '关节二', value: 0, direction: 'x' },
        { name: 'foreArm_joint', description: '关节三', value: 90, direction: 'x' },
        { name: 'wrist1_joint', description: '关节四', value: 0, direction: 'x' },
        { name: 'wrist2_joint', description: '关节五', value: 90, direction: 'y' },
        { name: 'wrist3_joint', description: '关节六', value: 0, direction: 'x' }
      ],
      min: Number(-180),
      max: Number(180)
    }
  },
  watch: {
    joints: {
      handler (newVal) {
        if (newVal) {
          const jointValues = newVal.map(joint => joint.value * Math.PI / 180)
          this.$emit('joints-changed', jointValues)
        }
        if (!this.isAsync) {
          this.sendNowJointsData()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.getCurrentAngle()
  },
  methods: {
    // 通过滑块改变关节角度
    sliderInput (e, name, direction) {
      const radianValue = e * Math.PI / 180
      this.$emit('sliderInput', radianValue, name, direction)
    },
    // 发送实时关节角度(真实模式)
    sendNowJointsData () {
      if (this.joints) {
        // eslint-disable-next-line
        const joint_values = this.joints.map(joint => joint.value * Math.PI / 180)
        console.log('joint_values:', joint_values)
        axios.post('/api/change_joint_angle', { joint_values })
          .then(response => {
            console.log('后台响应：', response.data)
          }).catch(error => {
            console.error('请求失败：', error)
          })
      }
    },
    // 获取当前关节角度
    getCurrentAngle () {
      axios.get('/api/get_current_angle').then(response => {
        console.log(response.data)
        for (let i = 0; i < this.joints.length; i++) {
          this.joints[i].value = response.data.current_position[i]
        }
      }).catch(error => {
        console.error('Error fetching gripper data:', error)
      })
    }
  }
}
</script>

<style>
.slider-block {
  padding: 50px;
  box-sizing: border-box;
  width: 400px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
}
</style>
