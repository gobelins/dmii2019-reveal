import ArtistScene from '../ArtistScene'

export default class Francois extends ArtistScene {
  constructor(id) {
    super(id)

    this.name = 'AS_Francois'
  }

  show() {
    console.log('Francois.show')

    this.enabled = true
    this.wrapper.visible = true
  }

  hide() {
    console.log('Francois.hide')

    this.enabled = false
    this.wrapper.visible = false
  }

  update(dt) {
    this.children.forEach((child) => { child.update(dt) })
  }
}
