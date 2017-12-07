import * as THREE from 'three'
import anime from 'animejs'
import PostProRender from './postProRender'
import { CAMERA_Z } from '../constants/positions'

import fishbach_bg_vs from '../shaders/fishbach_bg.vert'
import fishbach_bg_fs from '../shaders/fishbach_bg.frag'

/**
 * Class for the global Scene.
 */
export default class Scene {
  constructor(width, height, devicePixelRatio, isPostPro, optsPostPro) {
    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
    this.renderer.setClearColor(0x333333, 1)
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(devicePixelRatio)
    // CAMERA
    this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 10000)
    this.camera.position.set(0, 0, CAMERA_Z)
    this.activeCamera = this.camera
    this.optsPostPro = optsPostPro || null
    this.activeCamera.position.z = 0
    this.isUpdatingFov = false

    this.isPostPro = isPostPro || true

    document.getElementById('three-container').appendChild(this.renderer.domElement)

    const bgSphereGeometry = new THREE.SphereGeometry(80, 50, 50, 50)
    this.bgUniforms = {
      u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerHeight, window.innerWidth) },
    }

    const bgSphereMaterial = new THREE.ShaderMaterial({
      uniforms: this.bgUniforms,
      vertexShader: fishbach_bg_vs,
      fragmentShader: fishbach_bg_fs,
      side: THREE.BackSide,
    })

    this.bgSphere = new THREE.Mesh(bgSphereGeometry, bgSphereMaterial)
    this.bgSphere.position.z = -150

    this.scene.add(this.bgSphere)

    if (this.isPostPro) {
      this.initPostPro()
    }

    this.resize(window.innerWidth, window.innerHeight)
  }

  // GETTERS AND SETTERS
  getCamera() {
    return this.camera
  }

  getRenderer() {
    return this.renderer
  }

  // ELEMENTS MANAGING
  add(element) {
    this.scene.add(element)
  }

  initPostPro() {
    if (this.isPostPro) {
      this.postProRenderer = new PostProRender(this.renderer, this.bgSphere, this.optsPostPro)
      this.resize(window.innerWidth, window.innerHeight)
    }
  }

  // CAMERA
  cameraMoveTo(x = 0, y = 0, z = 0, camera, vector) {
    anime({
      targets: this.camera.position,
      x,
      y,
      z,
      duration: 1000,
      easing: 'easeInOutQuart',
      update: () => {
        camera.lookAt(vector)
      },
    })
  }

  cameraRotateTo(x = 0, y = 0, z = 0) {
    anime({
      targets: this.camera.rotation,
      x,
      y,
      z,
      duration: 750,
      easing: 'easeInOutQuart',
      complete: () => {
        if (y === Math.PI * 2) this.camera.rotation.y = 0
      },
    })
  }

  cameraFovTo(fov) {
    this.isUpdatingFov = true

    anime({
      targets: this.camera,
      fov,
      duration: 1000,
      delay: 950,
      easing: 'easeInOutQuart',
      complete: () => { this.isUpdatingFov = true },
    })
  }

  render() {
    if (this.isUpdatingFov) this.camera.updateProjectionMatrix()

    this.postProRenderer.bloomOption = this.optsPostPro

    if (this.isPostPro) {
      if (this.postProRenderer.optsPostPro.bloom.strength !== 0 || this.postProRenderer.optsPostPro.blur.intensityBlur !== 0) {
        this.postProRenderer.render(this.scene, this.activeCamera)
      } else {
        this.renderer.render(this.scene, this.activeCamera)
      }
    } else {
      this.renderer.render(this.scene, this.activeCamera)
    }
  }

  // EVENTS
  resize(screenWidth, screenHeight) {
    this.camera.aspect = screenWidth / screenHeight
    this.camera.updateProjectionMatrix()

    if (this.postProRenderer) {
      this.postProRenderer.setSize(screenWidth, screenHeight, window.devicePixelRatio)
    }

    this.renderer.setSize(screenWidth, screenHeight)
  }
}
