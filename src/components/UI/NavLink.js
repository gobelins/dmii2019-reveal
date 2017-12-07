import { find, findOne, append, createElement, on } from 'chirashi'
import anime from 'animejs'

import { shuffleArray } from '../../utils/maths'

export default class NavLink {
  constructor(domLink, i, onClick) {
    this.domLink = domLink
    this.id = i

    this.isHovered = false
    this.isActive = false

    this.label = findOne(this.domLink, '.link__label')
    this.line = findOne(this.domLink, '.link__line')

    this.createLetters()
    this.label.style.opacity = 1

    on(this.domLink, {
      click: () => { this.handleMouseClick(onClick) },
      mouseover: () => { this.handleMouseOver() },
      mouseleave: () => { this.handleMouseLeave() },
    })
  }

  createLetters() {
    const labelContent = this.label.innerHTML
    this.label.innerHTML = ''

    for (let i = 0; i < labelContent.length; i += 1) {
      let letter = labelContent[i]

      if (letter === ' ') {
        letter = '&nbsp;'
      } else if (letter === 'É') {
        letter = 'E&#769;'
      }

      append(this.label, createElement(`span.anim-letter{${letter}}`))
    }
  }

  handleMouseClick(callback) {
    this.isActive = true

    callback()
  }

  handleMouseOver() {
    this.isHovered = true

    if (!this.isActive) {
      if (this.hideAnim) this.hideAnim.pause()
      this.showAnim = this.show()
    }
  }

  handleMouseLeave() {
    this.isHovered = false

    if (!this.isActive) {
      if (this.showAnim) this.showAnim.pause()
      this.hideAnim = this.hide()
    }
  }

  hide(callback = () => {}) {
    const tl = anime.timeline({
      complete: () => {
        callback()
      }
    })

    const letters = find(this.label, '.anim-letter')
    shuffleArray(letters)

    return tl
      .add({
        targets: letters,
        opacity: 0,
        duration: 300,
        easing: 'easeInExpo',
        delay: (el, i, l) => i * 20,
        offset: 0,
      })
      .add({
        targets: this.line,
        width: 22,
        easing: 'easeOutExpo',
        offset: 0,
      })
  }

  show(callback = () => {}) {
    const tl = anime.timeline({
      complete: () => {
        callback()
      }
    })

    const letters = find(this.label, '.anim-letter')
    shuffleArray(letters)

    return tl
      .add({
        targets: letters,
        opacity: 1,
        duration: 300,
        easing: 'easeInExpo',
        delay: (el, i, l) => i * 20,
        offset: 0,
      })
      .add({
        targets: this.line,
        width: 44,
        easing: 'easeOutExpo',
        offset: 0,
      })
  }
}