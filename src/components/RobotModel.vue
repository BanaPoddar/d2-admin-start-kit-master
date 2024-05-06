<template>
  <d2-container class="ghost">
    <div class="common-layout">
      <el-container>
        <div id="webgl">
          <Menu ref="robotControl" @sliderInput="sliderInput" @joints-changed="updateJoints" :isAsync="isAsync"/>
          <el-button class="btn" type="primary" @click="sendJointsData" v-if="isAsync">规划并执行</el-button>
          <el-button class="btn" type="primary" @click="sendHomeJoints" v-if="isAsync" style="margin-left: 150px">设置为初始姿态</el-button>
        </div>
      </el-container>
    </div>
  </d2-container>
</template>

<script>
import Menu from '@/components/RobotControl'
import * as THREE from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'
import URDFLoader from 'urdf-loader'
import axios from 'axios'

export default {
  props: {
    isAsync: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Menu
  },
  data () {
    return {
      robot: null,
      joints: [0, 0, 90, 0, 90, 0]
    }
  },
  watch: {
    joints: {
      handler (newVal) {
        this.$emit('joints-changed', newVal)
      },
      deep: true
    }
  },
  mounted () {
    // 初始化 Three.js 相关对象
    this.initBase()
    this.addLight()
    this.initOrbitControls()
    this.addHelpLine()
    this.initRobot()
    this.initPlane() // 创建平面
    // 将渲染器添加到 DOM 中
    document.getElementById('webgl').appendChild(this.renderer.domElement)
    // 开始渲染
    this.render()
    // 窗口大小处理
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(window.innerWidth / window.innerHeight)
    })
  },
  methods: {
    setGripperModelWidth (width) {
      this.robot.joints.right_finger_joint.setJointValue(width / 255)
      this.robot.joints.finger_joint.setJointValue(width / 255)
    },
    sendJointsData () {
      console.log(this.joints)
      // eslint-disable-next-line camelcase
      const joint_values = this.joints
      // 发送给后端 真实运动
      axios.post('/api/change_joint_angle', { joint_values })
        .then(response => {
          // 给出提示
          this.$notify({
            title: '成功',
            message: '机械臂成功执行运动！',
            type: 'success'
          })
        }).catch(error => {
          console.error('请求失败：', error)
        })
    },
    sendHomeJoints () {
      // eslint-disable-next-line camelcase
      const joint_values = [0, 0, 90, 0, 90, 0]
      // 发送给后端 真实运动
      axios.post('/api/change_joint_angle', { joint_values })
        .then(response => {
          this.$refs.robotControl.setJoints([0, 0, 90, 0, 90, 0])
          // eslint-disable-next-line camelcase
          const joint_values = [0, 0, 90, 0, 90, 0].map(joint => joint * Math.PI / 180)
          this.handleSetModelJointValues(joint_values)
          // 给出提示
          this.$notify({
            title: '成功',
            message: '机械臂成功设置为初始姿态！',
            type: 'success'
          })
        }).catch(error => {
          console.error('请求失败：', error)
        })
    },
    updateJoints (newJoints) {
      this.joints = newJoints
    },
    sliderInput (value, name) {
      if (this.robot && this.robot.joints[name]) {
        this.robot.joints[name].setJointValue(value)
      }
    },
    initBase () {
      // 创建场景
      this.scene = new THREE.Scene()
      this.scene.position.set(0, 0, 0)
      // 创建相机
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
      // 设置相机的位置
      this.camera.position.set(-1.2494421790882568, 0.5353738083398928, 5.076608828158961)
      // 设置相机的朝向
      this.camera.rotation.set(-0.12163454180993438, -0.20192201955322803, -0.02451024238853201)
      this.scene.add(this.camera)
      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setClearColor('#DCDCDC')
    },
    addLight () {
      // 添加光源
      const positions = [
        { x: 3, y: 3, z: 3 },
        { x: 3, y: -3, z: -3 },
        { x: -3, y: 3, z: -3 },
        { x: -3, y: -3, z: 3 },
        { x: -3, y: -3, z: -3 }
      ]
      positions.forEach(pos => {
        const light = new THREE.DirectionalLight('#fff', 1)
        light.position.set(pos.x, pos.y, pos.z)
        this.scene.add(light)
      })
    },
    initOrbitControls () {
      // 初始化轨道控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
    },
    render () {
      // 渲染
      this.renderer.render(this.scene, this.camera)
      this.controls.update()
      // 打印相机的位置和朝向
      /* console.log('Camera position:', this.camera.position);
      console.log('Camera rotation:', this.camera.rotation); */
      requestAnimationFrame(this.render)
    },
    addHelpLine () {
      // 添加网格辅助线
      const gridHelper = new THREE.GridHelper(100, 20)
      this.scene.add(gridHelper)
    },
    initRobot () {
      // 加载模型
      const loader = new URDFLoader()
      loader.load('./aubo_description/urdf/aubo_i5.urdf', result => {
        console.log(result)
        this.robot = result
        this.robot.rotation.x = Math.PI / 2
        this.robot.rotation.x *= -1
        this.robot.position.x = -1.5
        this.robot.position.y = 0.5
        this.robot.position.z = 1.5
        this.scene.add(this.robot)
        // 将关节角度转化为弧度制
        this.joints = this.joints.map(joint => joint * Math.PI / 180)
        // 设置关节初始角度
        this.robot.joints.shoulder_joint.setJointValue(this.joints[0])
        this.robot.joints.upperArm_joint.setJointValue(this.joints[1])
        this.robot.joints.foreArm_joint.setJointValue(this.joints[2])
        this.robot.joints.wrist1_joint.setJointValue(this.joints[3])
        this.robot.joints.wrist2_joint.setJointValue(this.joints[4])
        this.robot.joints.wrist3_joint.setJointValue(this.joints[5])
        // 设置OrbitControls的target为机械臂模型的位置
        // this.controls.target.set(this.robot.position.x, this.robot.position.y, this.robot.position.z)
      })
    },
    initPlane () {
      // 创建一个平面几何体，长宽都为1
      const geometry = new THREE.PlaneGeometry(1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
      const plane = new THREE.Mesh(geometry, material)
      // 设置平面的位置，使其位于模型的原点
      plane.position.set(-1.5, 0.5, 1.5)
      // 旋转平面使其平行于xz平面
      plane.rotation.x = Math.PI / 2
      this.scene.add(plane)
    },
    handleSetModelJointValues (jointValues) {
      const jointNames = ['shoulder_joint', 'upperArm_joint', 'foreArm_joint', 'wrist1_joint', 'wrist2_joint', 'wrist3_joint']
      jointNames.forEach((name, index) => {
        this.robot.joints[name].setJointValue(jointValues[index])
      })
    }
  }
}
</script>

<style scoped>
.btn {
  position: fixed;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
