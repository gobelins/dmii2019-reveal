import * as THREE from 'three'

import { randomFloat, randomInt, tween } from '../../../../utils/maths'

import {
  FRAGMENT_SCALE,
  FRAGMENT_BASE_ROTATION_X,
  FRAGMENT_BASE_ROTATION_Y,
  SPHERE_RADIUS_MIN,
  SPHERE_RADIUS_MAX,
} from '../../../constants/superpoze'

const BASE_SPEED = 0.005

export default class RandomFragment {
  constructor(id, geometry, material) {
    this.name = `RandomFragment-${id}`
    this.children = []
    this.attributes = []
    this.id = id

    // ANIMATION
    this.rotDirection = (randomInt(0, 1) * 2) - 1
    this.speedModifier = randomFloat(0.3, 0.7)
    this.bumpValue = 0.5

    this.fragment = new THREE.Mesh(geometry, material)

    // SCALE
    this.randScale = randomFloat(FRAGMENT_SCALE, FRAGMENT_SCALE * 2.5)
    this.fragment.scale.set(this.randScale, this.randScale, this.randScale)

    // LOW GRAVITY POSITION
    this.randY = ((Math.random()) - 0.5) * SPHERE_RADIUS_MAX
    this.sliceRadius = Math.sqrt((SPHERE_RADIUS_MAX ** 2) - (this.randY ** 2))
    this.randRadius = randomFloat(SPHERE_RADIUS_MIN, this.sliceRadius)
    this.randAngle = randomFloat(0, Math.PI * 2)
    this.waveAngle = randomFloat(0, Math.PI * 2)

    this.supPosition = new THREE.Vector3(
      this.randRadius * Math.cos(this.randAngle),
      this.randY,
      this.randRadius * Math.sin(this.randAngle),
    )

    this.supRotation = new THREE.Vector2(
      FRAGMENT_BASE_ROTATION_X + randomFloat(0, Math.PI * 2),
      FRAGMENT_BASE_ROTATION_Y + randomFloat(0, Math.PI * 2),
    )

    this.fragment.position.x = this.supPosition.x
    this.fragment.position.y = this.supPosition.y
    this.fragment.position.z = this.supPosition.z

    this.fragment.rotation.x = this.supRotation.x
    this.fragment.rotation.y = this.supRotation.y
  }

  getThreeObject() {
    return this.fragment
  }

  update(dt, gravity, bassIntensity) {
    // SCALE
    const tweenedScale = tween(this.randScale, FRAGMENT_SCALE, gravity)
    if (tweenedScale.x !== this.fragment.scale.x) {
      this.fragment.scale.set(tweenedScale, tweenedScale, tweenedScale)
    }

    // POSITION
    const gravitySpeedModifier = tween(1, 0.1, gravity)
    const supAngleValue = (BASE_SPEED + ((bassIntensity / 20))) * this.speedModifier * gravitySpeedModifier
    const angleValue = (Math.abs(this.randAngle) + supAngleValue) % (Math.PI * 2)
    this.randAngle = this.rotDirection * angleValue

    const waveAngleValue = (bassIntensity * this.speedModifier * 0.025)
    this.waveAngle = (this.waveAngle + waveAngleValue) % (Math.PI * 2)

    const tweenedRadius = tween(this.randRadius, this.sliceRadius, gravity)

    this.supPosition.x = tweenedRadius * Math.cos(this.randAngle)
    this.supPosition.z = tweenedRadius * Math.sin(this.randAngle)

    this.fragment.position.x = this.supPosition.x
    this.fragment.position.y = this.supPosition.y
    this.fragment.position.z = this.supPosition.z

    // ROTATION
    const supRotationValue = bassIntensity * this.speedModifier * (1 - gravity)
    this.supRotation.x = (this.supRotation.x + (supRotationValue / 15)) % (Math.PI * 2)
    this.supRotation.y = (this.supRotation.y + (supRotationValue / 10)) % (Math.PI * 2)

    this.fragment.rotation.x = this.supRotation.x
    this.fragment.rotation.y = this.supRotation.y
  }
}
