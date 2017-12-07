import * as THREE from 'three'

import MusicalLayer from './MusicalLayer'

import { rgbArrayToVec3 } from '../../../utils/glsl'

import introplane_vs from '../../shaders/introplane_shader.vert'
import introplane_fs from '../../shaders/introplane_shader.frag'

import {
  PLANE_WIDTH,
  PLANE_HEIGHT,
  PLANE_SEGMENT_WIDTH,
  PLANE_SEGMENT_HEIGHT,
  PLANE_POSITION_Y,
  PLANE_POSITION_Z,
  PLANE_ROTATION
} from '../../constants/intro'

export default class Intro extends MusicalLayer {
  constructor(index) {
    super(index)

    this.name = 'ML_Intro'
    this.attributes = [
      {
        label: 'baseColor',
        type: 'color',
      },
      {
        label: 'noiseColor',
        type: 'color',
      },
    ]
    this.enabled = true

    this.baseColor = [134, 165, 174]
    this.noiseColor = [124, 153, 160]
    this.targetOpacity = 1

    // BACKGROUND
    const bgSphereGeometry = new THREE.SphereGeometry(50, 50, 200, 200)
    this.bgSphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.baseColor[0] / 255, this.baseColor[1] / 255, this.baseColor[2] / 255),
      side: THREE.BackSide,
    })
    const bgSphere = new THREE.Mesh(bgSphereGeometry, this.bgSphereMaterial)

    this.wrapper.add(bgSphere)

    this.uniforms = {
      u_base_color: { type: 'vec3', value: rgbArrayToVec3(this.baseColor) },
      u_noise_color: { type: 'vec3', value: rgbArrayToVec3(this.noiseColor) },
      u_frequency: { type: '1f', value: 5 },
      u_amplitude: { type: '1f', value: 22 },
      u_opacity: { type: '1f', value: 0 },
      u_time: { type: '1f', value: 0 },
    }
    const planeGeometry = new THREE.PlaneGeometry(
      PLANE_WIDTH,
      PLANE_HEIGHT,
      PLANE_SEGMENT_WIDTH,
      PLANE_SEGMENT_HEIGHT,
    )
    const planeMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: introplane_vs,
      fragmentShader: introplane_fs,
      transparent: true,
    })
    const bgPlane = new THREE.Mesh(planeGeometry, planeMaterial)

    bgPlane.position.y = PLANE_POSITION_Y
    bgPlane.position.z = PLANE_POSITION_Z
    bgPlane.rotation.x = PLANE_ROTATION
    bgPlane.scale.set(3, 1, 1)

    this.wrapper.add(bgPlane)
  }

  changeArtist(artistId) {
    // DOES NOTHING
  }

  show() {
    this.enabled = true
  }

  hide() {
    const callback = () => {
      this.enabled = false
    }
  }

  update(dt, audioIntensities) {
    if (this.enabled) {
      if (window.DEVMODE) {
        const baseColor = rgbArrayToVec3(this.baseColor)
        const noiseColor = rgbArrayToVec3(this.noiseColor)
        this.bgSphereMaterial.color.setRGB(baseColor.x, baseColor.y, baseColor.z)
        this.uniforms.u_base_color.value = baseColor
        this.uniforms.u_noise_color.value = noiseColor
      }

      if (this.uniforms.u_opacity.value !== this.targetOpacity) {
        this.uniforms.u_opacity.value += (this.targetOpacity - this.uniforms.u_opacity.value) * 0.02
      }
      this.uniforms.u_time.value += dt * 0.00002
    }
  }
}
