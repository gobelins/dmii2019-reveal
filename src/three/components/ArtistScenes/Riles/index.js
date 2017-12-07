import * as THREE from 'three'

import ArtistScene from '../ArtistScene'
import FirePlane from './FirePlane'
import FireParticles from './FireParticles'

import { roundToPrec, ceilToPrec } from '../../../../utils/maths'

// DIMENS
import {
  PLANE_POSITION_Y,
  PLANE_POSITION_Z,
  PLANE_WIDTH,
  PLANE_HEIGHT,
  PLANE_ROTATION,
  TEXT_SCALE,
  TEXT_POSITION_Y,
  TEXT_POSITION_Z
} from '../../../constants/riles'

export default class Riles extends ArtistScene {
  constructor(id, nameGeometry, raycaster) {
    super(id)

    this.name = 'AS_Riles'
    this.raycaster = raycaster
    this.intersectUv = new THREE.Vector2()

    // BACKGROUND
    const bgSphereGeometry = new THREE.SphereGeometry(50, 50, 50, 50)
    const bgSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xed5746, side: THREE.BackSide })

    this.bgSphere = new THREE.Mesh(bgSphereGeometry, bgSphereMaterial)

    this.threeAdd(this.bgSphere)

    // RAYCASTING
    this.intersectFactor = 0
    const rayPlaneGeometry = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT, 1, 1)
    const rayPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, visible: false })
    this.rayPlane = new THREE.Mesh(rayPlaneGeometry, rayPlaneMaterial)

    this.rayPlane.position.y = PLANE_POSITION_Y
    this.rayPlane.position.z = PLANE_POSITION_Z
    this.rayPlane.rotation.x = PLANE_ROTATION

    this.threeAdd(this.rayPlane)

    // AUDIO PLANES
    this.firePlane = new FirePlane()
    this.fireParticles = new FireParticles()

    this.add(this.firePlane)
    // this.add(this.fireParticles)

    // TEXT
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xed5746 })
    this.text = new THREE.Mesh(nameGeometry, textMaterial)
    this.text.scale.set(TEXT_SCALE, TEXT_SCALE, TEXT_SCALE)

    this.text.position.y = TEXT_POSITION_Y
    this.text.position.z = TEXT_POSITION_Z

    this.threeAdd(this.text)
  }

  show(callback = () => {}) {
    console.log('Riles.show')

    this.enabled = true
  }

  hide(callback = () => {}) {
    console.log('Riles.hide')

    this.enabled = false
  }

  update(dt, audioIntensities) {
    const intersects = this.raycaster.intersectObject(this.rayPlane)

    if (!!intersects[0] && !!intersects[0].uv) {
      if (this.intersectFactor <= 0.01) {
        this.intersectUv.x = intersects[0].uv.x
        this.intersectUv.y = intersects[0].uv.y
      } else {
        const vx = (intersects[0].uv.x - this.intersectUv.x) * 0.1
        const vy = (intersects[0].uv.y - this.intersectUv.y) * 0.1
        this.intersectUv.x += vx
        this.intersectUv.y += vy
      }

      if (this.intersectFactor !== 1) {
        const vFactor = ceilToPrec((1 - this.intersectFactor) * 0.3, 5)
        this.intersectFactor = ceilToPrec(this.intersectFactor + vFactor, 3)
        // console.log('Riles.update', this.intersectFactor)
      }
    } else {
      if (this.intersectFactor !== 0) {
        const vFactor = roundToPrec((0 - this.intersectFactor) * 0.3, 5)
        this.intersectFactor = roundToPrec(this.intersectFactor + vFactor, 3)
        // console.log('Riles.update', this.intersectFactor)
      }
    }

    this.firePlane.update(dt, audioIntensities, this.intersectUv, this.intersectFactor)
    this.fireParticles.update(dt, audioIntensities, this.intersectUv, this.intersectFactor)

    // this.bassAudioPlane.update(dt, audioIntensities.bass, this.intersectUv, this.intersectFactor)
    // this.kickAudioPlane.update(dt, audioIntensities.kick, this.intersectUv, this.intersectFactor)
    // this.highAudioPlane.update(dt, audioIntensities.high, this.intersectUv, this.intersectFactor)
  }
}
