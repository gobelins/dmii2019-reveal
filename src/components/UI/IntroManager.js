import { find, findOne, createElement, remove, addClass, removeClass, on, next } from 'chirashi'
import anime from 'animejs'

import { setStylesOnElement } from '../../utils/dom'

import content from '../../../assets/data/ui-content.json'

export default class UIIntroManager {
  constructor(uiElems, navFuncs, uiFuncs, nextGenreLink) {
    this.ui = uiElems.ui
    this.nav = uiElems.nav
    this.logoAsterios = uiElems.logoAsterios
    this.footerCenter = uiElems.footerCenter
    this.ticketBtn = uiElems.ticketBtn
    this.help = uiElems.help
    this.helpText = uiElems.helpText

    this.goToGenre = navFuncs.goToGenre
    this.enableTicket = uiFuncs.enableTicket

    this.nextGenreLink = nextGenreLink

    // INTRO
    this.currentIntroStep = 0
    this.introLogo = findOne(this.ui, '.logo-reveal')
    this.introContent = findOne(this.ui, '.intro-content')
    this.introContentText = findOne(this.introContent, '.intro-content__text')
    this.introContentIcon = findOne(this.introContent, '.intro-content__icon')
    this.introSkipper = findOne(this.ui, '.intro-skipper')
    this.introSkipBtn = findOne(this.ui, '.intro-skipper__skip-btn')
    this.introPrevBtn = findOne(this.ui, '.intro-skipper__prev-btn')
    this.introNextBtn = findOne(this.ui, '.intro-skipper__next-btn')

    this.introStepElems = []

    setTimeout(() => {
      this.initIntro()
      this.showIntroLogos(() => {
        this.showIntroSkipper()
        this.showIntroStep()
      })
    }, 2000)
  }

  // INTRO
  initIntro() {
    this.updateIntroContent()

    on(this.introPrevBtn, { click: () => { this.goToPrevIntroStep() } })
    on(this.introNextBtn, { click: () => { this.goToNextIntroStep() } })
  }

  updateIntroContent() {
    this.introStepElems = []
    const currentIntroStep = content.introSteps[this.currentIntroStep]

    this.introContentText.innerHTML = ''
    currentIntroStep.text.forEach((line) => {
      const domLine = createElement(`<span>${line}</span>`)
      this.introContentText.append(domLine)

      this.introStepElems.push(domLine)
    })

    if (currentIntroStep.iconSrc) {
      this.introContentIcon.src = currentIntroStep.iconSrc
      setStylesOnElement(this.introContentIcon, { display: 'inline-block' })

      this.introStepElems.push(this.introContentIcon)
    } else {
      this.introContentIcon.src = ''
      setStylesOnElement(this.introContentIcon, { display: 'none' })
    }

    // TODO: BAD, REFORMAT, NO, TIRED
    switch (this.currentIntroStep) {
      case 1:
        addClass(this.nav, 'visible')
        break;

      case 2:
        addClass(this.help, 'visible')
        break

      case 3:
        removeClass(this.helpText, 'visible')
        addClass(this.footerCenter, 'visible')
        break

      default:
    }
  }

  showIntroLogos(callback = () => {}) {
    anime({
      targets: [this.logoAsterios, this.introLogo],
      opacity: 1,
      duration: 1500,
      easing: 'easeInOutQuad',
      complete: () => { setTimeout(() => { this.hideIntroLogo(callback) }, 500) }
    })
  }

  hideIntroLogo(callback = () => {}) {
    anime({
      targets: this.introLogo,
      opacity: 0,
      duration: 1500,
      easing: 'easeInOutQuad',
      complete: callback
    })
  }

  showIntroSkipper() {
    anime({
      targets: this.introSkipper,
      opacity: 1,
      duration: 750,
      easing: 'easeInOutQuad'
    })
  }

  hideIntroSkipper(callback = () => {}) {
    anime({
      targets: this.introSkipper,
      opacity: 0,
      duration: 750,
      easing: 'easeInOutQuad',
      complete: callback
    })
  }

  showIntroStep() {
    anime({
      targets: this.introStepElems,
      opacity: [0, 1],
      duration: 750,
      easing: 'easeInOutQuad',
      delay: (el, i, l) => i * 150
    })
  }

  hideIntroStep(callback = () => {}) {
    anime({
      targets: this.introStepElems,
      opacity: 0,
      duration: 750,
      easing: 'easeInOutQuad',
      delay: (el, i, l) => i * 150,
      complete: callback
    })
  }

  goToIntroStep(nextStep) {
    const callback = () => {
      this.currentIntroStep = nextStep
      this.updateIntroContent()
      this.showIntroStep()
    }

    this.hideIntroStep(callback)
  }

  goToPrevIntroStep() {
    if (this.currentIntroStep - 1 >= 0) {
      if (this.currentIntroStep - 1 === 0) removeClass(this.introPrevBtn, 'active')
      this.goToIntroStep(this.currentIntroStep - 1)
    }
  }

  goToNextIntroStep() {
    if (this.currentIntroStep + 1 < content.introSteps.length) {
      if (this.currentIntroStep + 1 === 1) addClass(this.introPrevBtn, 'active')
      this.goToIntroStep(this.currentIntroStep + 1)
    } else {
      this.leaveIntro()
    }
  }

  leaveIntro() {
    this.hideIntroSkipper(() => { remove(this.introSkipper) })
    this.hideIntroStep(() => {
      remove(this.introContent)
      this.goToGenre(1)
    })
  }

  enableSkipIntro() {
    addClass(this.introSkipBtn, 'active')
    on(this.introSkipBtn, { click: () => {
      addClass(this.nav, 'visible')
      addClass(this.footerCenter, 'visible')
      addClass(this.ticketBtn, 'active')
      addClass(this.help, 'visible')
      removeClass(this.helpText, 'visible')

      this.enableTicket()
      this.leaveIntro()
    } })
  }
}