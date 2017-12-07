import { find, findOne, append, createElement } from 'chirashi'
import anime from 'animejs'

import { shuffleArray } from '../../utils/maths'

export default class FooterAudioInfos {
  constructor(wrapper) {
    this.wrapper = wrapper
    this.songInfosArtist = findOne(wrapper, '.song-info--album')
    this.songInfosTitle = findOne(wrapper, '.song-info--title')
  }

  createLetters(albumName, songName) {
    for (let i = 0; i < albumName.length; i += 1) {
      append(this.songInfosArtist, createElement(`span.anim-letter{${albumName[i]}}`))
    }

    for (let i = 0; i < songName.length; i += 1) {
      append(this.songInfosTitle, createElement(`span.anim-letter{${songName[i]}}`))
    }
  }

  update(albumName, songName) {
    const callback = () => {
      this.songInfosArtist.innerHTML = ''
      this.songInfosTitle.innerHTML = ''
      this.createLetters(albumName, songName)
      this.show()
    }

    this.hide(callback)
  }

  hide(callback = () => {}) {
    const letters = find(this.wrapper, '.anim-letter')
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

  show(callback = () => {}) {
    const letters = find(this.wrapper, '.anim-letter')
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
}