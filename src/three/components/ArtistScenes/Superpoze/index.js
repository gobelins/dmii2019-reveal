import * as THREE from 'three'

import ArtistScene from '../ArtistScene'
import LetterFragment from './LetterFragment'
import RandomFragment from './RandomFragment'

import { randomFloat, tween } from '../../../../utils/maths'
import { rgbArrayToVec3 } from '../../../../utils/glsl'

import superpoze_bg_vs from '../../../shaders/superpoze_bg.vert'
import superpoze_bg_fs from '../../../shaders/superpoze_bg.frag'

import { LAYER_DEPTH } from '../../../constants/dimens'
import { SPHERE_RADIUS_MAX, PALETTE_1, PALETTE_2 } from '../../../constants/superpoze'

const LIGHT_WAVE_VALUE = 10
const LIGHT_ACCENT_BASE_INTENSITY = 0.5
const BG_ACCENT_EASE_VALUE = 0.15
const MVMT_EASE_VALUE = 0.03
const BASS_EASE_VALUE = 0.1

export default class Superpoze extends ArtistScene {
  constructor(id, geoGroup) {
    super(id)

    this.name = 'AS_Superpoze'
    this.attributes = [
      {
        label: 'targetGravity',
        type: 'number',
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        label: 'baseFirstColor',
        type: 'color',
      },
      {
        label: 'baseSecondColor',
        type: 'color',
      },
      {
        label: 'baseLightColor',
        type: 'color',
      },
      {
        label: 'baseFrequency',
        type: 'number',
        min: 1,
        max: 10,
        step: 0.1,
      },
      {
        label: 'accentColor',
        type: 'color',
      },
      {
        label: 'accentLightColor',
        type: 'color',
      },
      {
        label: 'accentOpacity',
        type: 'number',
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        label: 'accentFrequency',
        type: 'number',
        min: 0,
        max: 10,
        step: 0.1,
      },
      {
        label: 'noiseIntensity',
        type: 'number',
        min: 0,
        max: 1,
        step: 0.01,
      },
    ]

    // DEV GUI
    this.baseFirstColor = [...PALETTE_1.baseFirst]
    this.baseSecondColor = [...PALETTE_1.baseSecond]
    this.baseLightColor = PALETTE_1.baseLight
    this.baseFrequency = 3.5

    this.accentColor = [...PALETTE_1.accent]
    this.accentLightColor = PALETTE_1.accentLight
    this.accentOpacity = 1
    this.accentFrequency = 5.5

    this.noiseIntensity = 0.06

    this.gravity = 0
    this.targetGravity = 0
    this.bassIntensity = 0

    // BACKGROUND
    const bgSphereGeometry = new THREE.SphereGeometry(50, 50, 50, 50)
    this.bgUniforms = {
      u_base_first_color: { type: 'vec3', value: rgbArrayToVec3(this.baseFirstColor) },
      u_base_second_color: { type: 'vec3', value: rgbArrayToVec3(this.baseSecondColor) },
      u_base_frequency: { type: '1f', value: this.baseFrequency },
      u_accent_color: { type: 'vec3', value: rgbArrayToVec3(this.accentColor) },
      u_accent_opacity: { type: 'float', value: this.accentOpacity },
      u_accent_frequency: { type: '1f', value: this.accentFrequency },
      u_noise_intensity: { type: '1f', value: this.noiseIntensity },
      u_time: { type: '1f', value: 0 },
    }

    const bgSphereMaterial = new THREE.ShaderMaterial({
      uniforms: this.bgUniforms,
      vertexShader: superpoze_bg_vs,
      fragmentShader: superpoze_bg_fs,
      side: THREE.BackSide,
    })

    this.bgSphere = new THREE.Mesh(bgSphereGeometry, bgSphereMaterial)
    this.bgSphere.rotation.y = Math.PI * 0.5

    this.threeAdd(this.bgSphere)

    // LIGHTS
    this.baseLightPosAngle = randomFloat(0, Math.PI * 2)
    this.accentLightPosAngle = this.baseLightPosAngle + (this.baseLightPosAngle > Math.PI ? -Math.PI : Math.PI)
    this.baseLightWaveAngle = randomFloat(0, Math.PI * 2)
    this.accentLightWaveAngle = randomFloat(0, Math.PI * 2)

    this.mainLight = new THREE.DirectionalLight(0xFFFFFF, 0.8)
    // const mainLightHelper = new THREE.DirectionalLightHelper(this.mainLight)
    // mainLightHelper.isHelper = true
    this.mainLight.position.set(0, 0, LAYER_DEPTH)

    this.baseLight = new THREE.PointLight(this.baseLightColor, 0.3)
    // const baseLightHelper = new THREE.PointLightHelper(this.baseLight, 2, 0x78f0ec)
    // baseLightHelper.isHelper = true

    this.accentLight = new THREE.PointLight(this.accentLightColor, 0.3)
    // const accentLightHelper = new THREE.PointLightHelper(this.accentLight, 2, 0xFF0000)
    // accentLightHelper.isHelper = true

    this.updateLightsPositions()

    this.threeAdd(this.mainLight)
    this.threeAdd(this.baseLight)
    this.threeAdd(this.accentLight)
    // this.threeAdd(mainLightHelper)
    // this.threeAdd(baseLightHelper)
    // this.threeAdd(accentLightHelper)

    // LETTERS FRAGMENTS
    const letterMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, emissive: 0x566dae })
    geoGroup.children.forEach((child, i) => {
      this.add(new LetterFragment(i, child.position, child.geometry, letterMaterial))
    })

    geoGroup.children.forEach((child, i) => {
      this.add(new RandomFragment(i, child.geometry, letterMaterial))
    })

    const threeContainer = document.getElementById('three-container')
    threeContainer.addEventListener('mousedown', () => { this.targetGravity = 1 })
    threeContainer.addEventListener('mouseup', () => { this.targetGravity = 0 })
  }

  updateLightsPositions() {
    this.baseLight.position.set(
      SPHERE_RADIUS_MAX * Math.sin(this.baseLightPosAngle),
      LIGHT_WAVE_VALUE * Math.cos(this.baseLightWaveAngle),
      SPHERE_RADIUS_MAX * Math.cos(this.baseLightPosAngle),
    )

    this.accentLight.position.set(
      SPHERE_RADIUS_MAX * Math.sin(this.accentLightPosAngle),
      LIGHT_WAVE_VALUE * Math.sin(this.accentLightWaveAngle),
      SPHERE_RADIUS_MAX * Math.cos(this.accentLightPosAngle),
    )
  }

  show(callback = () => {}) {
    this.enabled = true
  }

  hide(callback = () => {}) {
    this.enabled = false
  }

  update(dt, audioIntensities) {
    // DEV
    if (window.DEVMODE) {
      this.bgUniforms.u_base_frequency.value = this.baseFrequency
      this.bgUniforms.u_accent_opacity.value = this.accentOpacity

      this.bgUniforms.u_accent_frequency.value = this.accentFrequency
      this.bgUniforms.u_noise_intensity.value = this.noiseIntensity
    }

    // GRAVITY
    this.gravity += (this.targetGravity - this.gravity) * MVMT_EASE_VALUE

    // COLORS
    this.baseFirstColor[0] = tween(PALETTE_1.baseFirst[0], PALETTE_2.baseFirst[0], this.gravity)
    this.baseFirstColor[1] = tween(PALETTE_1.baseFirst[1], PALETTE_2.baseFirst[1], this.gravity)
    this.baseFirstColor[2] = tween(PALETTE_1.baseFirst[2], PALETTE_2.baseFirst[2], this.gravity)

    this.baseSecondColor[0] = tween(PALETTE_1.baseSecond[0], PALETTE_2.baseSecond[0], this.gravity)
    this.baseSecondColor[1] = tween(PALETTE_1.baseSecond[1], PALETTE_2.baseSecond[1], this.gravity)
    this.baseSecondColor[2] = tween(PALETTE_1.baseSecond[2], PALETTE_2.baseSecond[2], this.gravity)

    this.accentColor[0] = tween(PALETTE_1.accent[0], PALETTE_2.accent[0], this.gravity)
    this.accentColor[1] = tween(PALETTE_1.accent[1], PALETTE_2.accent[1], this.gravity)
    this.accentColor[2] = tween(PALETTE_1.accent[2], PALETTE_2.accent[2], this.gravity)

    this.bgUniforms.u_base_first_color.value = rgbArrayToVec3(this.baseFirstColor)
    this.bgUniforms.u_base_second_color.value = rgbArrayToVec3(this.baseSecondColor)
    this.bgUniforms.u_accent_color.value = rgbArrayToVec3(this.accentColor)
    this.baseLight.color.setHex(this.baseLightColor)
    this.accentLight.color.setHex(this.accentLightColor)

    // BACKGROUND
    this.bgUniforms.u_time.value += dt * 0.00008
    this.bgUniforms.u_accent_opacity.value +=
      (((audioIntensities.kick - 0.3) * 3.33) - this.bgUniforms.u_accent_opacity.value)
      * BG_ACCENT_EASE_VALUE

    if (this.bgUniforms.u_accent_opacity.value < 0) this.bgUniforms.u_accent_opacity.value = 0

    // LIGHTS
    this.baseLightPosAngle += 0.01
    this.accentLightPosAngle += 0.01
    this.baseLightWaveAngle += 0.01
    this.accentLightWaveAngle += 0.01
    this.updateLightsPositions()

    this.accentLight.intensity = LIGHT_ACCENT_BASE_INTENSITY * audioIntensities.kick

    // BASS FORMATTING
    let trsBassIntensity = (audioIntensities.bass - 0.5) * 2
    if (trsBassIntensity < 0) trsBassIntensity = 0
    this.bassIntensity += (trsBassIntensity - this.bassIntensity) * BASS_EASE_VALUE

    this.children.forEach((child) => { child.update(dt, this.gravity, trsBassIntensity) })
  }
}
