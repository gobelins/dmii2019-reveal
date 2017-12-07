/* eslint-disable */

import * as THREE from 'three'
import anime from 'animejs'

import ArtistScene from '../ArtistScene'
import TopMiddlePart from './scenes_parts/TopMiddlePart'
import TopBassePart from './scenes_parts/TopBassePart'
import FloorPart from './scenes_parts/FloorPart'
import Font from './Font'

export default class Fishbach extends ArtistScene {
  constructor(id, groupModel, camera) {
    super(id, groupModel)

    this.name = 'AS_Fishbach'

    this.fontSetting = {
      fontOpacity : 0,
      neonOpacity : 1,
    }
    
    
    this.direction          = new THREE.Vector2(0, 0)
    this.cameraPosition     = new THREE.Vector2(0, 0)
    this.mouse              = new THREE.Vector2(0, 0)
    
    this.cameraEasing       = {x: 50, y: 10}
    
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.camera = camera
    this.isCameraActived = true
    
    this.fonts = []
    this.audioValue 

    this.canClick = true

    this.init(groupModel)
  }

  init(models){
    
    this.initEvent()
    this.initScene(models)
  }

  initScene(models){

    this.topMidPart = new TopMiddlePart({
      scene : this.wrapper,
      position : {
          x : 0,
          y : -22,
          z : -100
      },
      audioValue : this.audioValue,
      opacity : this.fontSetting.neonOpacity
    })
   

    this.topBassePartLeft = new TopBassePart({
      scene : this.wrapper,
      position : {
          x : -13,
          y : -22,
          z : -100
      },
      direction : 'left',
      opacity : this.fontSetting.neonOpacity
    })

    this.topBassePartRight = new TopBassePart({
      scene : this.wrapper,
      position : {
          x : 13,
          y : -22,
          z : -100
      },
      direction : 'right',
      opacity : this.fontSetting.neonOpacity
    })

    this.floor = new FloorPart({
      scene : this.wrapper,
      position : {
          x : 0,
          y : -28,
          z : -95
      },
      opacity : this.fontSetting.neonOpacity
    })

    models.children.forEach((child, i) => {
      const font = new Font({
        position : child.position,
        geometry : child.geometry,
        scene : this.wrapper,
        customPos : {
          x : -1,
          y : 0,
          z : -100
        },
        opacity : this.fontSetting.fontOpacity
      })

      this.fonts.push(font)
    })
  
    this.lookAtVector = new THREE.Vector3(this.topMidPart.position.x, this.topMidPart.position.y + 20, this.topMidPart.position.z)
  }

  initEvent(){
    const that = this
    const threeContainer = document.getElementById('three-container')

    window.addEventListener("mousemove", (e) => {
      that.mouse.x = (e.clientX / that.width - .5) * 2
      that.mouse.y = (e.clientY / that.height - .5) * 2
    })

    threeContainer.addEventListener("click", () => {
        const targetFontOpacity = this.fontSetting.fontOpacity + Math.min(Math.random(), .15)
        const targetNeonOpacity = this.fontSetting.neonOpacity - Math.min(Math.random(), .15)
        

        if(this.fontSetting.fontOpacity < 1.5){
          anime({
            targets: this.fontSetting,
            fontOpacity: targetFontOpacity,
            easing: 'easeOutQuad',
          })  
        }
        
        if(this.fontSetting.neonOpacity > .2){
          anime({
            targets: this.fontSetting,
            neonOpacity: targetNeonOpacity,
            easing: 'easeOutQuad'
          })
        }
/*
      if (this.fontOpacity < 1)
        this.fontOpacity = this.fontOpacity + .05
 */ 
      })
  }

 

  show(callback = () => {}) {
    console.log('Fishbach.show')
    console.log('that.mouse', this.mouse)

    this.direction.subVectors(this.mouse, this.cameraPosition)
    this.direction.multiplyScalar(.06)
    this.cameraPosition.addVectors(this.cameraPosition, this.direction)
    this.camera.position.x = this.cameraPosition.x * this.cameraEasing.x * -1
    this.camera.position.y = -this.cameraPosition.y * this.cameraEasing.y * -1

    this.enabled = true
  }

  hide(callback = () => {}) {
    console.log('Fishbach.hide')

    this.enabled = false
  }

  update(dt, audioIntensities) {
    this.topMidPart.update(audioIntensities, this.fontSetting.neonOpacity)
    this.topBassePartLeft.update(audioIntensities, this.fontSetting.neonOpacity)
    this.topBassePartRight.update(audioIntensities, this.fontSetting.neonOpacity)
    this.floor.update(audioIntensities, this.fontSetting.neonOpacity)

    for(let i = 0; i < this.fonts.length; i++){
      this.fonts[i].mesh.material.opacity = this.fontSetting.fontOpacity * this.fonts[i].randomOpacityMultiplier + this.fontSetting.fontOpacity
    }

    if(this.isCameraActived){
      this.direction.subVectors(this.mouse, this.cameraPosition)
      this.direction.multiplyScalar(.06)
      this.cameraPosition.addVectors(this.cameraPosition, this.direction)
      this.camera.position.x = this.cameraPosition.x * this.cameraEasing.x * -1
      this.camera.position.y = -this.cameraPosition.y * this.cameraEasing.y * -1
      this.camera.lookAt(this.lookAtVector)  
    }

    if(this.fontSetting.neonOpacity < 1){
      this.fontSetting.neonOpacity += 0.005
    }
    if(this.fontSetting.fontOpacity > 0){
      this.fontSetting.fontOpacity -= 0.01
    }
  }
}
