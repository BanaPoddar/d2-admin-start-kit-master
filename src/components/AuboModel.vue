<template>
  <div ref="threeCanvas" style="width: 100%; height: 500px"></div>
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default {
  name: 'ThreeModel',
  mounted () {
    this.initThree()
  },
  methods: {
    initThree () {
      const width = this.$refs.threeCanvas.clientWidth
      const height = this.$refs.threeCanvas.clientHeight

      // 创建场景
      const scene = new THREE.Scene()

      // 添加相机
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
      camera.position.z = 5

      // 创建渲染器并设置大小
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(width, height)
      this.$refs.threeCanvas.appendChild(renderer.domElement)

      // 加载模型
      const loader = new GLTFLoader()
      loader.load(
        '@/assets/3d-model/i5Robot.gltf',
        (gltf) => {
          scene.add(gltf.scene)
        },
        undefined,
        (error) => {
          console.error('An error happened.', error)
        }
      )

      // 添加光源
      const light = new THREE.AmbientLight(0x404040) // soft white light
      scene.add(light)

      // 添加控制器
      const controls = new OrbitControls(camera, renderer.domElement)

      // 动画循环渲染场景
      const animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }
      animate()
    }
  }
}
</script>
