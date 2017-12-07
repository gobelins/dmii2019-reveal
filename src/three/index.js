import { Vector2, Vector3, Raycaster } from 'three'

import anime from 'animejs'
import Scene from './components/Scene'

// COMPONENTS
import MusicalLayersManager from './components/MusicalLayersManager'
import * as ML from './components/MusicalLayers'

const MUSICAL_LAYERS = [ML.Intro, ML.PopRock, ML.Rap, ML.Electro]

/* THREE global class */
export default class ThreeWrapper {
  constructor(assets, audioPlayer) {
    this.audioPlayer = audioPlayer

    // INIT
    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight

    this.optionPostPro = {
      bloom: {
        strength: 0,
        radius: 0.0,
        threshold: 0.0,
      },
      blur: {
        intensityBlur: 0.0,
      },
    }

    this.sceneWrapper = new Scene(
      this.screenWidth,
      this.screenHeight,
      window.devicePixelRatio ? window.devicePixelRatio : 1,
      true,
      this.optionPostPro,
    )

    // RAYCASTER
    this.mouse = new Vector2()
    this.raycaster = new Raycaster()

    // ELEMENTS
    this.musicalLayersManager = new MusicalLayersManager(MUSICAL_LAYERS, assets, this.raycaster, this.sceneWrapper.camera, this.optionPostPro)
    this.elements = []

    this.addElement(this.musicalLayersManager)

    window.addEventListener('resize', () => { this.onWindowResize() }, false)
    window.addEventListener('mousemove', (e) => { this.onMouseMove(e) }, false)
  }

  addElement(element) {
    this.elements.push(element)
    this.sceneWrapper.add(element.getThreeObject())
  }

  goToLayer(layerIndex, callback) {
    this.musicalLayersManager.goToLayer(layerIndex, callback)
    this.sceneWrapper.cameraFovTo(layerIndex === 1 ? 10 : 70)

    if (layerIndex !== 1) {
      anime({
        targets: this.optionPostPro.bloom,
        strength: 0,
        duration: 100,
        easing: 'easeOutQuad',
      })
    this.musicalLayersManager.children[1].children[0].isCameraActived = false
    this.sceneWrapper.cameraMoveTo(0, 0, 0, this.sceneWrapper.camera, this.musicalLayersManager.children[1].children[0].lookAtVector)
    this.sceneWrapper.camera.matrixWorldNeedsUpdate = true
    } else {
      anime({
        targets: this.optionPostPro.bloom,
        strength: 1.4,
        duration: 100,
        delay: 1500,
        easing: 'easeOutQuad',
      })
      this.musicalLayersManager.children[1].children[0].isCameraActived = true
    }
  }

  goToNextSong() {
    this.musicalLayersManager.changeArtist(this.audioPlayer.current_artist_id)
  }

  toggleBlurScene() {
    if (this.optionPostPro.blur.intensityBlur === 0.25) {
      anime({
        targets: this.optionPostPro.blur,
        intensityBlur: 0,
        duration: 400,
        easing: 'easeInOutQuart',
      })
    } else {
      anime({
        targets: this.optionPostPro.blur,
        intensityBlur: 0.25,
        duration: 400,
        easing: 'easeInOutQuart',
      })
    }
  }

  // EVENTS
  onWindowResize() {
    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight

    this.sceneWrapper.resize(this.screenWidth, this.screenHeight)
  }

  onMouseMove(e) {
    this.mouse.x = ((e.clientX / this.screenWidth) * 2) - 1
    this.mouse.y = (-(e.clientY / this.screenHeight) * 2) + 1
  }

  // RENDER
  update(dt, audioIntensities) {
    this.raycaster.setFromCamera(this.mouse, this.sceneWrapper.activeCamera)

    this.elements.forEach((element) => { element.update(dt, audioIntensities) })
    this.sceneWrapper.render()
  }
}
