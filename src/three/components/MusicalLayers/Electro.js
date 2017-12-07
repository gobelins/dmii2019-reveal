import MusicalLayer from './MusicalLayer'
import * as AS from '../ArtistScenes'

export default class Electro extends MusicalLayer {
  constructor(index, assets, raycaster) {
    super(index)

    this.name = 'ML_Electro'
    this.attributes = []
    this.raycaster = raycaster

    this.children = [
      new AS.Superpoze(0, assets.models.superpozeNameGrp),
    ]

    this.activeAS = this.children[0]

    this.children.forEach((child) => {
      this.wrapper.add(child.getThreeObject())
    })
  }

  show() {
    console.log('MusicalLayer, show', this.name)
    this.enabled = true

    this.activeAS.show()
  }

  hide() {
    console.log('MusicalLayer, hide', this.name)
    const callback = () => { this.enabled = false }

    this.activeAS.hide(callback)
  }
}
