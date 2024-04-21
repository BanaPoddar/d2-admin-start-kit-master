<template>
  <div class="slider-block">
    <div v-for="joint in joints" :key="joint.name" class="slider-item">
      <p class="demonstration">{{ joint.name }}</p>
<!--      <span class="demonstration">{{ joint.description }}</span>-->
      <el-slider v-model.number="joint.value" show-input :min="min" :max="max" :step="0.01" @input="sliderInput($event,joint.name,joint.direction)" />
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      joints: [
        { name: 'link1_joint', description: '绕y轴旋转', value: -1.57, direction: 'y' },
        { name: 'link2_joint', description: '绕x轴旋转', value: -1.57, direction: 'x' },
        { name: 'link3_joint', description: '绕x轴旋转', value: 1.57, direction: 'x' },
        { name: 'link4_joint', description: '绕x轴旋转', value: 0, direction: 'x' },
        { name: 'link5_joint', description: '绕y轴旋转', value: 0, direction: 'y' },
        { name: 'link6_joint', description: '绕x轴旋转', value: 0, direction: 'x' }
      ],
      min: Number(-Math.PI.toFixed(2)),
      max: Number(Math.PI.toFixed(2))
    }
  },
  methods: {
    sliderInput (e, name, direction) {
      this.$emit('sliderInput', e, name, direction)
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
