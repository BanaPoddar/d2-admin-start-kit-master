<template>
  <el-card style="margin: 5px;text-align: center;">
    <div style="margin: 5px;">
      <div :style="valueStyle">{{ value }}</div>
      <el-divider></el-divider>
      <div style="font-size: 20px;font-weight: bold;">{{ label }}</div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    valueStyle: {
      type: Object,
      default: () => ({ fontSize: '30px', color: '#8B0000', fontWeight: 'bold' })
    }
  }
}
</script>
