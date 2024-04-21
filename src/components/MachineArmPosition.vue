<template>
  <div class="machine-arm-position">
    <div class="label">机械臂位置（m）</div>
    <div class="data">
      <div>X: {{ position.x }}</div>
      <div>Y: {{ position.y }}</div>
      <div>Z: {{ position.z }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.machine-arm-position {
  text-align: center;
}

.label {
  font-weight: bold;
  margin-bottom: 10px;
}

.data div {
  margin-bottom: 5px;
}
</style>
