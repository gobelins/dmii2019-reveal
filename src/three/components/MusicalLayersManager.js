import * as THREE from 'three'
import anime from 'animejs'

// CONSTANTS
import { LAYER_HEIGHT } from '../constants/dimens'

/**
 * Class for Musical Layer Manager. It manages Musical Layers.
 */
export default class MusicalLayersManager {
  constructor(musicalLayers, assets, raycaster, camera, optsPostPro) {
    this.name = 'Musical Layers Manager'
    this.children = []
    this.attributes = []
    this.optsPostPro = optsPostPro

    this.wrapper = new THREE.Group()

    musicalLayers.forEach((MusicalLayerConstructor, i) => {
      const musicalLayer = new MusicalLayerConstructor(i, assets, raycaster, camera)
      this.children.push(musicalLayer)
      this.wrapper.add(musicalLayer.getThreeObject())
    })

    this.currentMLIndex = 0
  }

  goToLayer(layerIndex, callback) {
    if (this.children[this.currentMLIndex].enabled) {
      this.children[this.currentMLIndex].hide()
    }

    anime({
      targets: this.optsPostPro.blur,
      intensityBlur: 0.25,
      duration: 400,
      easing: 'easeInOutQuart',
    })

    anime({
      targets: this.wrapper.position,
      y: layerIndex * LAYER_HEIGHT,
      duration: 3000,
      easing: 'easeInOutQuart',
      complete: () => {
        anime({
          targets: this.optsPostPro.blur,
          intensityBlur: 0,
          duration: 1500,
          easing: 'easeOutQuad',
          complete: () => {
            callback()
          },
        })

        this.currentMLIndex = layerIndex
        this.children[layerIndex].show()
      },
    })
  }

  changeArtist(artist) {
    this.children[this.currentMLIndex].changeArtist(artist)
  }

  getThreeObject() {
    return this.wrapper
  }

  update(dt, audioIntensities) {
    this.children
      .filter(element => element.enabled)
      .forEach((element) => { element.update(dt, audioIntensities) })
  }
}
