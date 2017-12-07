import MusicalLayer from './MusicalLayer'
import * as AS from '../ArtistScenes'

export default class Rap extends MusicalLayer {
  constructor(index, assets, raycaster) {
    super(index)

    this.name = 'ML_Rap'
    this.attributes = []
    this.raycaster = raycaster

    this.children = [
      new AS.Riles(0, assets.models.rilesName, raycaster),
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

    this.activeAS.hide()
  }
}
