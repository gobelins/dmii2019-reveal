import MusicalLayer from './MusicalLayer'
import * as AS from '../ArtistScenes'

export default class PopRock extends MusicalLayer {
  constructor(index, assets, raycaster, camera) {
    super(index)

    this.name = 'ML_Pop_Rock'
    this.attributes = []
    this.raycaster = raycaster

    this.children = [
      new AS.Fishbach(0, assets.models.fishbach, camera),
      //new AS.Francois(1),
    ]

    // TODO : CHANGE TO [0]
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
