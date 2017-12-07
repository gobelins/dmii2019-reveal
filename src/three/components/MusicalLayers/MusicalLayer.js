import * as THREE from 'three'

import { LAYER_WIDTH, LAYER_HEIGHT, LAYER_DEPTH } from '../../constants/dimens'

/**
 * Base class for Musical Layers.
 * Each layer (and component) should have a name and children / attributes arrays.
 *
 * ex :
 * this.attributes = [
   {
     label: 'dodeScale',
     type: 'number',
     min: 0.01,
     max: 10,
     step: 0.01,
   },
   {
     label: 'dodeColor',
     type: 'color',
   },
   ]
 */
export default class MusicalLayer {
  constructor(index) {
    this.name = `layer-${index}`
    this.index = index
    this.children = []
    this.attributes = []
    this.enabled = false

    this.wrapper = new THREE.Group()
    this.wrapper.position.y = index * LAYER_HEIGHT * -1
    this.wrapper.position.z = -LAYER_DEPTH / 2

    // const boxGeometry = new THREE.BoxGeometry(LAYER_WIDTH, LAYER_HEIGHT, LAYER_DEPTH)
    // const box = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial(0xff0000));
    // const boxHelper = new THREE.BoxHelper(box)
    // boxHelper.isHelper = true
    //
    // this.wrapper.add(boxHelper)
  }

  show() {
    this.enabled = true

    this.activeAS.show()
  }

  hide() {
    const callback = () => { this.enabled = false }

    this.activeAS.hide(callback)
  }

  changeArtist(artistId) {
    if (this.activeAS.id !== artistId) {
      const newAS = this.children.find(child => child.id === artistId)

      if (newAS) {
        const callback = () => {
          this.activeAS = newAS
          this.activeAS.show()
        }

        this.activeAS.hide(callback)
      }
    }
  }

  getThreeObject() {
    return this.wrapper
  }

  update(dt, audioIntensities) {
    this.children
      .filter(child => child.enabled)
      .forEach((child) => { child.update(dt, audioIntensities) })
  }
}
