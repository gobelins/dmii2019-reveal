import * as THREE from 'three'

import { rgbArrayToVec3 } from '../../../../utils/glsl'

import fireplane_vs from '../../../shaders/fireplane_shader.vert'
import fireplane_fs from '../../../shaders/fireplane_shader.frag'

import {
  PLANE_POSITION_Y,
  PLANE_POSITION_Z,
  PLANE_SEGMENT_WIDTH,
  PLANE_SEGMENT_HEIGHT,
  PLANE_WIDTH,
  PLANE_HEIGHT,
  PLANE_ROTATION
} from '../../../constants/riles'

const BASS_TIME_LIMITER = 10000
const BASS_TIME_SPEED = 10000

export default class FirePlane {
  constructor() {
    this.name = 'FirePlane'
    this.children = []
    this.attributes = [
      {
        label: 'bassAmplitude',
        type: 'number',
        min: 1,
        max: 80,
        step: 1,
      },
      {
        label: 'bassFrequency',
        type: 'number',
        min: 0.01,
        max: 0.8,
        step: 0.01,
      },
    ]

    this.bassResolution = 50
    this.bassAmplitude = 2
    this.bassFrequency = 3
    this.highAmplitude = 4
    this.highFrequency = 0.75
    this.highFrequencyBoost = 0.75

    this.planeGeometry = new THREE.PlaneGeometry(
      PLANE_WIDTH,
      PLANE_HEIGHT,
      PLANE_SEGMENT_WIDTH,
      PLANE_SEGMENT_HEIGHT,
    )

    this.uniforms = {
      u_base_color: { type: 'vec3', value: rgbArrayToVec3([237, 87, 70]) },
      u_fire_color: { type: 'vec3', value: rgbArrayToVec3([255, 233, 110]) },
      u_bass_resolution: { type: 'vec2', value: new THREE.Vector2(this.bassResolution, this.bassResolution) },
      u_bass_amplitude: { type: '1f', value: this.bassAmplitude },
      u_bass_frequency: { type: '1f', value: this.bassFrequency },
      u_high_amplitude: { type: '1f', value: this.highAmplitude },
      u_high_frequency: { type: '1f', value: this.highFrequency },
      u_high_frequency_boost: { type: '1f', value: this.highFrequencyBoost },
      u_high_intensity: { type: '1f', value: 0 },
      u_intersect_uv: { type: 'vec2', value: new THREE.Vector2(-1, -1) },
      u_mask_radius: { type: '1f', value: 0.3 },
      u_mask_value: { type: '1f', value: 100 },
      u_bass_time: { type: '1f', value: 0 },
      u_high_time: { type: '1f', value: 0 },
    }

    this.planeMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: fireplane_vs,
      fragmentShader: fireplane_fs,
      transparent: true,
      wireframe: false,
    })

    this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial)

    this.plane.position.y = PLANE_POSITION_Y
    this.plane.position.z = PLANE_POSITION_Z
    this.plane.rotation.x = PLANE_ROTATION
  }

  getThreeObject() {
    return this.plane
  }

  update(dt, audioIntensities, intersectUv, intersectFactor) {
    let highIntensity = (audioIntensities.kick - 0.5) * 2
    if (highIntensity < 0) highIntensity = 0

    // USED ONLY BY DEV
    if (window.DEVMODE) {
      this.uniforms.u_bass_amplitude.value = this.bassAmplitude
      this.uniforms.u_high_amplitude.value = this.highAmplitude
      this.uniforms.u_high_frequency.value = this.highFrequency
    }

    this.uniforms.u_bass_time.value += dt / (BASS_TIME_LIMITER - (BASS_TIME_SPEED * audioIntensities.bass))
    this.uniforms.u_high_time.value += 0.01
    this.uniforms.u_high_intensity.value = highIntensity
    this.uniforms.u_intersect_uv.value = intersectUv
    this.uniforms.u_mask_value.value = intersectFactor
  }
}
