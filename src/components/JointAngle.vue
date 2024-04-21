<template>
  <div style="display: flex; align-items: center; justify-content: center;">
    <div :style="labelStyle" >{{ label }}</div>
    <el-button type="primary" @click="decrementValue" style="margin-left: 10px">-</el-button>
    <el-input v-model="value" style="width: 100px; margin: 0 10px;"></el-input> <!-- 修改宽度 -->
    <el-button type="primary" @click="incrementValue" >+</el-button>

  </div>
</template>

<script>
export default {
  data () {
    return {
      value: this.initialValue // 初始化value为传入的值
    }
  },
  props: {
    label: {
      type: String,
      required: true
    },
    initialValue: { // 新增prop
      type: Number,
      default: 0
    },
    labelStyle: {
      type: Object,
      default: () => ({ fontSize: '20px', color: '#000000', fontWeight: 'normal', margin: '0 10px', writingMode: 'horizontal-tb' }) // 修改fontWeight和writingMode
    }
  },
  methods: {
    incrementValue () {
      this.value += 0.1
      this.value = parseFloat(this.value.toFixed(1))
    },
    decrementValue () {
      this.value -= 0.1
      this.value = parseFloat(this.value.toFixed(1))
    }
  }
}
</script>
