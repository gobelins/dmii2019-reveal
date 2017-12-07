import { findOne, append, createElement, addClass, setAttr, removeClass, on } from 'chirashi'
import anime from 'animejs'

import { randomFloat } from '../../utils/maths'

export default class MuteButton {
  constructor(wrapper, clickCallback = () => {}) {
    this.viewBoxX = 100
    this.viewBoxY = 100
    this.lineQuantity = 5
    this.lineColor = '#FFFFFF'
    this.lineWidth = 8

    this.isMuted = false
    this.lines = []

    // SVG INIT
    this.svg = findOne(wrapper, '.btn--mute')
    setAttr(this.svg, { viewBox: `0 0 ${this.viewBoxX} ${this.viewBoxY}` })

    const xIncrement = (this.viewBoxX - this.lineWidth) / (this.lineQuantity - 1)
    let x = this.lineWidth * 0.5
    for (let i = 0; i < this.lineQuantity; i += 1) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      addClass(line, 'btn--mute__line')
      setAttr(line, {
        x1: x,
        x2: x,
        y1: randomFloat(0.2, 0.7) * this.viewBoxY,
        y2: this.viewBoxY,
        stroke: this.lineColor,
        'stroke-width': this.lineWidth
      })
      append(this.svg, line)
      this.lines.push(line)

      x += xIncrement
    }

    this.loopAnimation = this.animateLoop()

    // EVENT HANDLING
    on(this.svg, {
      click: () => {
        clickCallback()
        this.toggle()
      }
    })
  }

  animateLoop() {
    return anime({
      targets: this.lines,
      y1: (el) => el.y1.baseVal.value - 0.2 * this.viewBoxY,
      duration: 500,
      delay: (el, i, l) => i * 75,
      easing: 'linear',
      direction: 'alternate',
      loop: true
    })
  }

  toggle() {
    this.isMuted = !this.isMuted

    if (this.isMuted) {
      this.loopAnimation.pause()
      anime({
        targets: this.lines,
        y1: (el) => this.isMuted ? this.viewBoxY - this.viewBoxY * 0.3 : Math.random() * this.viewBoxY,
        duration: 250,
        delay: (el, i, l) => i * this.lineQuantity * 10,
        easing: 'easeInOutQuad'
      })
    } else {
      anime({
        targets: this.lines,
        y1: (el) => randomFloat(0, 0.7) * this.viewBoxY,
        duration: 250,
        delay: (el, i, l) => i * this.lineQuantity * 10,
        easing: 'easeInOutQuad',
        complete: () => { this.loopAnimation = this.animateLoop() }
      })
    }
  }
}