import { find, findOne, append, createElement } from 'chirashi'
import anime from 'animejs'

import { shuffleArray } from '../../utils/maths'

export default class GenreNameManager {
  constructor(wrapper) {
    this.genreName = findOne(wrapper, '.genre-name')
  }

  createLetters(genreName) {
    for (let i = 0; i < genreName.length; i += 1) {
      let letter = genreName[i]

      if (letter === ' ') {
        letter = '&nbsp;'
      } else if (letter === 'É') {
        letter = 'E&#769;'
      }

      append(this.genreName, createElement(`span.anim-letter{${letter}}`))
    }
  }

  update(genreName, translateDirection = 1, animated = false) {
    this.genreName.innerHTML = ''
    this.createLetters(genreName)

    if (animated) {
      const callback = () => {
        setTimeout(() => {
          this.hide(translateDirection)
        }, 1000)
      }

      this.show(translateDirection, callback)
    }
  }

  hide(translateDirection, callback = () => {}) {
    const letters = find(this.genreName, '.anim-letter')
    shuffleArray(letters)

    anime({
      targets: letters,
      opacity: 0,
      translateY: 80 * -translateDirection,
      duration: 800,
      easing: 'easeInQuad',
      delay: (el, i, l) => i * 25,
      complete: () => { callback() }
    })
  }

  show(translateDirection, callback = () => {}) {
    const letters = find(this.genreName, '.anim-letter')
    shuffleArray(letters)

    anime({
      targets: letters,
      opacity: 1,
      translateY: [80 * translateDirection, 0],
      duration: 800,
      easing: 'easeOutQuad',
      delay: (el, i, l) => i * 25,
      complete: () => { callback() }
    })
  }
}