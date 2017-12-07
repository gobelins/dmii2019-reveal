import { find, findOne, append, createElement, on } from 'chirashi'
import anime from 'animejs'

import NavLink from './NavLink'

import { shuffleArray } from '../../utils/maths'

export default class NavManager {
  constructor(wrapper, goToGenre, showAbout, hideAbout) {
    this.goToGenre = goToGenre
    this.showAbout = showAbout
    this.hideAbout = hideAbout
    this.isAboutVisible = false

    this.currentGenre = findOne(wrapper, '.current-genre')
    this.domLinks = find(wrapper, '.link--nav')
    this.domAboutLink = find(wrapper, '.link--about')
    this.navLinks = []

    this.domLinks.forEach((link, i) => {
      this.navLinks.push(new NavLink(link, i, () => { this.handleNavClick(i) }))
    })

    on(this.domAboutLink, {
      click: () => { this.handleAboutClick() }
    })
  }

  updateCurrentGenre(newGenre) {
    const callback = () => {
      this.currentGenre.innerHTML = ''
      this.createLettersCurrentGenre(newGenre)
      this.showCurrentGenre()
    }

    this.hideCurrentGenre(callback)
  }

  createLettersCurrentGenre(genre) {
    for (let i = 0; i < genre.length; i += 1) {
      let letter = genre[i]

      if (letter === ' ') {
        letter = '&nbsp;'
      } else if (letter === 'É') {
        letter = 'E&#769;'
      }

      append(this.currentGenre, createElement(`span.anim-letter{${letter}}`))
    }
  }

  hideCurrentGenre(callback = () => {}) {
    const letters = find(this.currentGenre, '.anim-letter')
    shuffleArray(letters)

    if (letters.length === 0) {
      callback()
    } else {
      anime({
        targets: letters,
        opacity: 0,
        duration: 300,
        easing: 'easeInExpo',
        delay: (el, i, l) => i * 20,
        complete: () => {
          callback()
        }
      })
    }
  }

  showCurrentGenre(callback = () => {}) {
    const letters = find(this.currentGenre, '.anim-letter')
    shuffleArray(letters)

    anime({
      targets: letters,
      opacity: 1,
      duration: 300,
      easing: 'easeOutExpo',
      delay: (el, i, l) => i * 20,
      complete: () => { callback() }
    })
  }

  handleAboutClick() {
    if (this.isAboutVisible) {
      this.isAboutVisible = false
      this.hideAbout()
    } else {
      this.isAboutVisible = true
      this.showAbout()
    }
  }

  handleNavUpdate(genreId) {
    this.updateCurrentGenre(['', 'POP ROCK', 'RAP HIP HOP', 'ÉLECTRO'][genreId])

    this.navLinks
      .forEach((link) => {
        if (link.id === genreId - 1) {
          link.isActive = true
          link.show()
        } else {
          link.isActive = false
          link.hide()
        }
      })
  }

  handleNavClick(linkId) {
    this.updateCurrentGenre(['', 'POP ROCK', 'RAP HIP HOP', 'ÉLECTRO'][linkId + 1])

    this.navLinks
      .filter((link) => link.id !== linkId && link.isActive)
      .forEach((link) => {
        link.isActive = false
        link.hide()
      })

    this.goToGenre(linkId + 1)
  }
}