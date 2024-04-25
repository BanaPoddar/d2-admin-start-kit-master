<template>
  <el-card style="margin: 5px; text-align: center; display: flex; justify-content: center; align-items: center;">
    <div style="display: flex; align-items: center; justify-content: center;">
      <div :style="labelStyle">{{ label }}</div>
      <el-divider direction="vertical"></el-divider>
      <div :style="valueStyle">{{ value }}</div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    valueStyle: {
      type: Object,
      default: () => ({ fontSize: '30px', color: '#8B0000', fontWeight: 'bold', marginRight: '10px' })
    },
    labelStyle: {
      type: Object,
      default: () => ({ fontSize: '30px', color: '#000000', fontWeight: 'bold', marginLeft: '10px' }) // 修改颜色为黑色
    }
  }
}
</script>
