import { findOne, append, createElement, addClass, setAttr, removeClass, on } from 'chirashi'
import anime from 'animejs'

export default class TimelineManager {
  constructor(wrapper) {
    this.viewBoxX = 500
    this.viewBoxY = 100

    this.lineWidth = 4
    this.lineColor = 'rgba(255, 255, 255, 1)'
    this.dotLineColor = 'rgba(255, 255, 255, 0.75)'
    this.dotSpacing = 10

    this.stopDotRadius = 6
    this.lastStopDotRadius = 16
    this.stopDotColor = '#FFFFFF'

    this.dottedCircleRadius = 50
    this.lineLength = this.viewBoxX - this.dottedCircleRadius - this.lastStopDotRadius

    this.stopPointNumber = 4
    this.stopPointDistance = this.lineLength / (this.stopPointNumber - 1)

    // SVG INIT
    this.svg = findOne(wrapper, '.timeline')
    setAttr(this.svg, { viewBox: `0 0 ${this.viewBoxX} ${this.viewBoxY}` })

    // DOTTED BASE
    const dottedLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    setAttr(dottedLine, {
      x1: this.lastStopDotRadius,
      x2: this.lineLength - this.dottedCircleRadius + this.lastStopDotRadius,
      y1: this.viewBoxY / 2,
      y2: this.viewBoxY / 2,
      stroke: this.dotLineColor,
      'stroke-width': this.lineWidth,
      'stroke-linecap': 'round',
      'stroke-dasharray': `1, ${this.dotSpacing}`
    })

    const dottedCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    setAttr(dottedCircle, {
      cx: this.lastStopDotRadius + 3 * this.stopPointDistance,
      cy: this.viewBoxY / 2,
      r: this.dottedCircleRadius,
      fill: 'rgba(255, 255, 255, 0)',
      stroke: this.dotLineColor,
      'stroke-width': this.lineWidth,
      'stroke-linecap': 'round',
      'stroke-dasharray': `1, ${this.dotSpacing}`
    })

    append(this.svg, dottedLine)
    append(this.svg, dottedCircle)

    for(let i = 0; i < this.stopPointNumber; i += 1) {
      const stopDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      setAttr(stopDot, {
        cx: this.lastStopDotRadius + i * this.stopPointDistance,
        cy: this.viewBoxY / 2,
        r: i === this.stopPointNumber - 1 ? this.lastStopDotRadius : this.stopDotRadius,
        fill: i === this.stopPointNumber - 1 ? this.dotLineColor : this.stopDotColor,
      })

      append(this.svg, stopDot)
    }

    // FULL PROGRESS
    this.fullLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    setAttr(this.fullLine, {
      x1: this.lastStopDotRadius,
      x2: this.lastStopDotRadius,
      y1: this.viewBoxY / 2,
      y2: this.viewBoxY / 2,
      stroke: this.lineColor,
      'stroke-width': this.lineWidth,
    })

    this.progressDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    setAttr(this.progressDot, {
      cx: this.lastStopDotRadius,
      cy: this.viewBoxY / 2,
      r: this.lastStopDotRadius,
      fill: this.stopDotColor,
    })

    append(this.svg, this.fullLine)
    append(this.svg, this.progressDot)
  }

  mockProgressAnimation() {
    const tl = anime.timeline({
      duration: 90000,
      easing: 'linear',
      complete: () => {
        this.mockResetAnimation()
      }
    })
    return tl
      .add({
        targets: this.fullLine,
        x2: [this.lastStopDotRadius, this.lineLength],
        offset: 0,
      })
      .add({
        targets: this.progressDot,
        cx: [this.lastStopDotRadius, this.lineLength],
        offset: 0,
      })
  }

  mockResetAnimation() {
    if (this.anim) {
      this.anim.restart()
    } else {
      this.anim = this.mockProgressAnimation()
    }
  }
}