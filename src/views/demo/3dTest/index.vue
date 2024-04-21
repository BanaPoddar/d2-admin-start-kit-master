<template>
  <d2-container type="full" class="card">
    <div id="webgl"></div>
  </d2-container>
</template>

<script>
import { LoadingManager, MathUtils } from 'three'
import * as THREE from 'three'
import URDFLoader from 'urdf-loader'
import OrbitControls from 'three/examples/jsm/controls/OrbitControls.js' // 确保路径正确

// 创建场景->相机->渲染器->相机添加到场景中->渲染器渲染场景和相机->渲染器添加到dom中
let robot = null
let scene = ''
let camera = ''
let renderer = ''
// 轨道控制器
let controls = ''

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    OrbitControls
  },
  mounted () {
    this.initBase()
    this.addLight()
    this.initOrbitControls()
    this.addHelpLine()
    this.initRobot()

    // 将渲染器添加到页面中
    document.getElementById('webgl').appendChild(renderer.domElement)
    this.render()

    // 窗口大小处理
    window.addEventListener('resize', () => {
      // 更新相机宽高比
      camera.aspect = window.innerWidth / window.innerHeight
      // 更新相机的投影矩阵
      camera.updateProjectionMatrix()
      // 更新渲染器渲染的尺寸大小
      renderer.setSize(window.innerWidth, window.innerHeight)
      // 设置渲染器的像素比(window.devicePixelRatio:当前设备的像素比)
      renderer.setPixelRatio(window.innerWidth / window.innerHeight)
    })
  },
  methods: {
    // 初始化
    initBase () {
      scene = new THREE.Scene()
      scene.position.set(0, 0.2, 0.8)
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.set(1.86, 1.51, 1.02)
      // camera.position.set(0, 0, 0);
      // camera.lookAt(scene.position);
      // 相机添加到场景中
      scene.add(camera)
      // antialias:开启抗锯齿  logarithmicDepthBuffer:使用对数深度缓冲器,一般在单个场景处理较大的差异
      renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor('#DCDCDC')
    },
    // 添加光线
    addLight () {
      const positions = [
        { x: 10, y: 10, z: 10 },
        { x: -10, y: 10, z: -10 },
        { x: -30, y: 10, z: 0 },
        { x: 0, y: -10, z: 0 }
      ]
      positions.forEach(pos => {
        const light = new THREE.DirectionalLight('#8fbad3', 1)
        light.position.set(pos.x, pos.y, pos.z)
        // 将灯光添加到场景中
        scene.add(light)
      })
    },
    // 轨道控制器
    initOrbitControls () {
      controls = new OrbitControls(camera, renderer.domElement)
      // 开启阻尼 更加真实
      controls.enableDamping = true
    },
    // render渲染器
    render () {
      // 渲染器更新
      renderer.render(scene, camera)
      // 控制器更新
      controls.update()
      requestAnimationFrame(this.render)
    },
    // 辅助线
    addHelpLine () {
      // 坐标轴辅助显示
      const arrowHelper = new THREE.AxesHelper(5)
      scene.add(arrowHelper)
      const gridHelper = new THREE.GridHelper(100, 20)
      scene.add(gridHelper)
    },
    initRobot () {
      // 导入Robot模型
      const manager = new LoadingManager()
      const loader = new URDFLoader(manager)
      loader.load('./aubo_description/urdf/aubo_e5.urdf', result => {
        robot = result
        // console.log("ROBOT:",robot);
        // 设置ROBOT坐标z朝上
        robot.rotation.x = Math.PI / 2
        robot.rotation.x *= (-1)
        // 设置ROBOT在坐标原点
        robot.position.x = 0
        robot.position.y = 0
        robot.position.z = 0
        scene.add(robot)
      })
    },
    // 设置各个关节的角度
    sliderInput (value, name) {
      // 找到要设置的关节
      // let target = handList.find(item => item.materialLibraries.join('') === name + '.mtl');
      // target.rotation[direction] = value;
      // console.log("此时的ROBOT,value,name",robot,value,name);
      name = 'link' + String(name) + '_joint'
      robot.joints[name].setJointValue(MathUtils.degToRad(value))
      // robot.joints[name].setJointValue(value);
      // robot.updateMatrixWorld(true);
    }
  }
}
</script>

<style>
.btn {
  position: fixed;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
