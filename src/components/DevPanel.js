import * as THREE from 'three'
import Stats from 'stats-js'
import DatGUI from 'dat-gui'

const OrbitControls = require('three-orbit-controls')(THREE)

import { setStylesOnElement } from '../utils/dom'

const CLASS_NAME_OVERLAY = 'dev-overlay'
const CLASS_NAME_INFOS = 'dev-overlay-infos'
const CLASS_NAME_BUTTONS = 'dev-overlay-buttons'

const AUDIO_CANVAS_WIDHT = 500
const AUDIO_CANVAS_HEIGHT = 100

export default class DevPanel {
  constructor(isDevModeEnabled, threeWrapper, audioPlayer, devMethods) {
    this.isDevModeEnabled = isDevModeEnabled
    this.threeWrapper = threeWrapper
    this.sceneWrapper = threeWrapper.sceneWrapper
    this.musicalLayersManager = threeWrapper.musicalLayersManager
    this.audioPlayer = audioPlayer
    this.devMethods = devMethods

    this.gui = new DatGUI.GUI()
    this.stats = new Stats()

    // AUDIO
    this.frequenciesIndex = 0

    // CAMERAS
    this.sceneWrapper.devCamera = this.sceneWrapper.camera.clone()
    this.sceneWrapper.devCamera.position.set(85, 50, 90)
    this.sceneWrapper.devCamera.lookAt(new THREE.Vector3())
    this.controls = new OrbitControls(this.sceneWrapper.devCamera)
    this.controls.enabled = this.isDevModeEnabled

    this.mainCameraHelper = new THREE.CameraHelper(this.sceneWrapper.camera)
    this.mainCameraHelper.visible = false
    this.sceneWrapper.add(this.mainCameraHelper)

    // GUI
    this.folderNames = []

    this.initAudioGUI()
    this.changeGUISource(this.musicalLayersManager)
    this.createDom()
    this.initAudioVisualizer()

    this.switchHelpers(this.musicalLayersManager.getThreeObject())

    // EVENTS
    window.addEventListener('keydown', (e) => {
      this.onKeyDown(e)
    }, false)

    this.audioCanvas.addEventListener('click', () => {
      this.frequenciesIndex = (this.frequenciesIndex + 1) % 3
    }, false)
  }

  /* ORBITS */
  switchCamera() {
    if (this.sceneWrapper.activeCamera.position.z === this.sceneWrapper.devCamera.position.z) {
      this.sceneWrapper.activeCamera = this.sceneWrapper.camera
    } else {
      this.sceneWrapper.activeCamera = this.sceneWrapper.devCamera
    }
  }

  /* STATS */
  beginCapture() {
    this.stats.begin()
  }

  endCapture() {
    this.stats.end()
  }

  /* HELPERS */
  switchHelpers(object) {
    if (object.isHelper) {
      object.visible = !object.visible
    } else {
      object.children.forEach((child) => {
        this.switchHelpers(child)
      })
    }
  }

  /* GUI */
  initAudioGUI() {
    const folder = this.gui.addFolder('Audio Player')
    folder.add(this.audioPlayer, 'loop')

    folder.add(this.audioPlayer, 'play')
    folder.add(this.audioPlayer, 'pause')

    folder.add(this.audioPlayer, 'nextGenre')
    folder.add(this.audioPlayer, 'prevGenre')

    folder.add(this.audioPlayer, 'nextSong')
    folder.add(this.audioPlayer, 'prevSong')

    folder.add(this.audioPlayer, 'randomNextSongArtist')
    folder.add(this.audioPlayer, 'randomPrevSongArtist')
  }

  changeGUISource(object) {
    this.clearGUI()

    this.createGUIFolderFromElement(this.gui, object)
  }

  clearGUI() {
    this.folderNames.forEach((folderName) => {
      this.removeGUIFolder(folderName)
    })

    this.folderNames = []
  }

  createGUIFolderFromElement(parent, element) {
    if (element.attributes.length > 0 || element.children.length > 0) {
      const folder = parent.addFolder(element.name)
      this.folderNames.push(element.name)

      element.attributes.forEach((attribute) => {
        switch (attribute.type) {
          case 'number':
            folder.add(element, attribute.label, attribute.min, attribute.max, attribute.step)
            break

          case 'color':
            folder.addColor(element, attribute.label)
            break

          default:
        }
      })

      element.children.forEach((child) => {
        this.createGUIFolderFromElement(folder, child)
      })
    }
  }

  removeGUIFolder(folderName) {
    const folder = this.gui.__folders[folderName]

    if (!folder) return

    folder.close();
    this.gui.__ul.removeChild(folder.domElement.parentNode)
    delete this.gui.__folders[folderName]

    this.gui.onResize()
  }

  // AUDIO
  initAudioVisualizer() {
    this.audioCanvas = document.createElement('canvas')
    this.audioCanvas.width = AUDIO_CANVAS_WIDHT
    this.audioCanvas.height = AUDIO_CANVAS_HEIGHT
    setStylesOnElement(this.audioCanvas, { position: 'absolute', left: 0, bottom: 0, display: 'none' })

    document.body.appendChild(this.audioCanvas)

    this.audioCtx = this.audioCanvas.getContext('2d')
    this.audioCtx.fillStyle = 'rgb(0, 0, 0)'
    this.audioCtx.fillRect(0, 0, AUDIO_CANVAS_WIDHT, AUDIO_CANVAS_HEIGHT)
  }

  // DOM
  createDom() {
    this.domElement = document.createElement('div')
    this.domElement.classList.add(CLASS_NAME_OVERLAY)

    setStylesOnElement(this.domElement, {display: this.isDevModeEnabled ? 'block' : 'none'})
    setStylesOnElement(this.stats.domElement, { float: 'left' })

    const domDevInfos = document.createElement('div')
    domDevInfos.classList.add(CLASS_NAME_INFOS)
    domDevInfos.innerHTML = '' +
      '<div><b>C</b> pour switcher de caméra</div>' +
      '<div><b>R</b> pour réintialiser la caméra dev</div>' +
      '<div><b>A</b> pour afficher / cacher les fréquences</div>' +
      ''

    const domDevButtons = document.createElement('div')
    domDevButtons.classList.add(CLASS_NAME_BUTTONS)
    for (let i = 0; i < 4; i += 1) {
      const button = document.createElement('button')
      button.textContent = `LAYER ${i}`
      button.onclick = () => { this.devMethods.goToGenre(i) }
      domDevButtons.appendChild(button)
    }

    const skipButton = document.createElement('button')
    skipButton.textContent = 'RANDOM NEXT'
    skipButton.onclick = () => { this.devMethods.goToNextSong() }
    domDevButtons.appendChild(skipButton)

    this.domElement.appendChild(this.stats.domElement)
    this.domElement.appendChild(this.gui.domElement)
    this.domElement.appendChild(domDevInfos)
    this.domElement.appendChild(domDevButtons)

    document.body.appendChild(this.domElement)
  }

  update(frequencies) {
    this.audioCtx.fillStyle = 'rgb(0, 0, 0)'
    this.audioCtx.fillRect(0, 0, AUDIO_CANVAS_WIDHT, AUDIO_CANVAS_HEIGHT)
    this.audioCtx.fillStyle = 'rgb(200, 0, 50)'

    const barWidth = AUDIO_CANVAS_WIDHT / frequencies[this.frequenciesIndex].length
    let x = 0
    let y = 0
    for (let i = 0; i < frequencies[this.frequenciesIndex].length; i += 1) {
      y = AUDIO_CANVAS_HEIGHT * (frequencies[this.frequenciesIndex][i] / 255)

      // Target a frequencies range
      if (i >= 40 && i <= 100) {
        this.audioCtx.fillStyle = 'rgb(50, 0, 200)'
      } else {
        this.audioCtx.fillStyle = 'rgb(200, 0, 50)'
      }

      this.audioCtx.fillRect(x, AUDIO_CANVAS_HEIGHT - y, barWidth, y)

      x += barWidth
    }
  }

  onKeyDown(e) {
    switch (e.keyCode) {
      // PRESS D - OPEN/CLOSE DEV MODE
      case 68:
        this.isDevModeEnabled = !this.isDevModeEnabled

        setStylesOnElement(this.domElement, {
          display: this.isDevModeEnabled ? 'block' : 'none',
        })

        this.controls.enabled = this.isDevModeEnabled
        this.mainCameraHelper.visible = this.isDevModeEnabled
        this.switchHelpers(this.musicalLayersManager.getThreeObject())

        break

      // PRESS C - SWITCH BETWEEN CAMERA
      case 67:
        if (this.isDevModeEnabled) {
          this.switchCamera()
        }
        break

      // PRESS R - RESET DEV CAMERA POS
      case 82:
        if (this.isDevModeEnabled) {
          this.controls.reset()
        }
        break

      // PRESS A - TOGGLE FREQUENCIES VISUALIZER
      case 65:
        if (this.isDevModeEnabled) {
          this.audioCanvas.style.display = this.audioCanvas.style.display === 'block' ? 'none' : 'block'
        }

        break

      default:
    }
  }
}
