<template>
  <d2-container class="ghost">
    <div class="common-layout">
      <el-container>
        <div id="webgl">
            <Menu @sliderInput="sliderInput" />
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

export default {
  components: {
    Menu
  },
  data () {
    return {
      robot: null
    }
  },
  mounted () {
    // 初始化 Three.js 相关对象
    this.initBase()
    this.addLight()
    this.initOrbitControls()
    this.addHelpLine()
    this.initRobot()
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
    sliderInput (value, name) {
      this.robot.joints[name].setJointValue(value)
    },
    initBase () {
      // 创建场景
      this.scene = new THREE.Scene()
      this.scene.position.set(0, 0, 0)
      // 创建相机
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
      this.camera.position.set(2.5, 1.51, 1.02)
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
      /* loader.load('./ur5/ur5.urdf', result => { */
      loader.load('./aubo_description/urdf/aubo_i5.urdf', result => {
        this.robot = result
        this.robot.rotation.x = Math.PI / 2
        this.robot.rotation.x *= -1
        this.robot.position.x = 0
        this.robot.position.y = 0
        this.robot.position.z = 0
        this.scene.add(this.robot)
        // 设置关节初始角度
        this.robot.joints.shoulder_joint.setJointValue(0)
        this.robot.joints.upperArm_joint.setJointValue(0)
        this.robot.joints.foreArm_joint.setJointValue(1.57)
        this.robot.joints.wrist1_joint.setJointValue(0)
        this.robot.joints.wrist2_joint.setJointValue(1.57)
        this.robot.joints.wrist3_joint.setJointValue(0)
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
