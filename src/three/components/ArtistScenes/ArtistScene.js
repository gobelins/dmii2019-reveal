import * as THREE from 'three'

export default class ArtistScene {
  constructor(id) {
    this.name = `artist-${id}`
    this.id = id
    this.children = []
    this.attributes = []

    this.wrapper = new THREE.Group()
    this.enabled = false
  }

  add(child) {
    this.children.push(child)
    this.wrapper.add(child.getThreeObject())
  }

  threeAdd(child) {
    this.wrapper.add(child)
  }

  show() {
    this.enabled = true
  }

  hide() {
    this.enabled = false
  }

  getThreeObject() {
    return this.wrapper
  }
}
