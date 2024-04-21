<template>
  <div class="machine-arm-pose">
    <div class="row">
      <div class="box">
        <div class="value">{{ pose.dx }}</div>
        <div class="label">DX</div>
      </div>
      <div class="box">
        <div class="value">{{ pose.dy }}</div>
        <div class="label">DY</div>
      </div>
      <div class="box">
        <div class="value">{{ pose.dz }}</div>
        <div class="label">DZ</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pose: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.machine-arm-pose {
  text-align: center;
}

.row {
  display: flex;
  justify-content: space-between;
}

.box {
  width: calc(33.33% - 10px);
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}
</style>
