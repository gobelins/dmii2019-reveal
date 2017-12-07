import anime from 'animejs'

import UIIntroManager from './UI/IntroManager'
import GenreNameManager from './UI/GenreNameManager'
import MuteButtonManager from './UI/MuteButtonManager'
import FooterAudioInfos from './UI/FooterAudioInfos'
import TimelineManager from './UI/TimelineManager'
import NavManager from './UI/NavManager';

import { find, findOne, createElement, addClass, removeClass, on } from 'chirashi'

export default class UIManager {
  constructor(navFuncs) {
    this.goToGenre = navFuncs.goToGenre
    this.goToNextSong = navFuncs.goToNextSong
    this.toggleBlurScene = navFuncs.toggleBlurScene

    this.ui = findOne(document.body, '.ui')

    this.logoAsterios = findOne(this.ui, '.logo-asterios')

    // CENTER
    this.artistInfos = findOne(this.ui, '.artist-infos')
    this.artistInfosCoverImg = findOne(this.artistInfos, '.album-cover')
    this.artistInfosArtist = findOne(this.artistInfos, '.content__artist')
    this.artistInfosAboutLink = findOne(this.artistInfos, '.content__artist-link')
    this.artistInfosTicketingLink = findOne(this.artistInfos, '.content__ticketing-link')
    this.artistInfosCloseBtn = findOne(this.artistInfos, '.btn--close')
    this.about = findOne(this.ui, '.about')

    // FOOTER LEFT
    this.songControls = findOne(this.ui, '.ui__footer__left')

    // FOOTER CENTER
    this.footerCenter = findOne(this.ui, '.ui__footer__center')
    this.ticketBtn = findOne(this.footerCenter, '.btn--ticket')

    // FOOTER RIGHT
    this.help = findOne(this.ui, '.ui__footer__right')
    this.helpBtn = findOne(this.help, '.icon--help')
    this.helpText = findOne(this.help, '.text')

    // LINKS
    this.nav = findOne(this.ui, '.nav')

    const uiElems = {
      ui: this.ui,
      nav: this.nav,
      logoAsterios: this.logoAsterios,
      footerCenter: this.footerCenter,
      ticketBtn: this.ticketBtn,
      help: this.help,
      helpText: this.helpText,
    }
    const uiFuncs = {
      enableTicket: () => { this.enableTicket() }
    }

    this.UIIntroManager = new UIIntroManager(uiElems, navFuncs, uiFuncs)

    this.genreNameManager = new GenreNameManager(this.ui)
    this.muteButtonManager = new MuteButtonManager(this.songControls, navFuncs.toggleMute)
    this.footerAudioInfos = new FooterAudioInfos(this.songControls)
    this.navManager = new NavManager(
      this.nav,
      this.goToGenre,
      () => { this.showAbout() },
      () => { this.hideAbout() },
    )
    this.timelineManager = new TimelineManager(this.footerCenter)

    this.enableHelp()
  }

  // ANIMATIONS
  updateGenreName(genreIndex, translateDir, animated) {
    const genreName = ['', 'POP ROCK', 'RAP HIP HOP', 'ÉLECTRO'][genreIndex]
    this.genreNameManager.update(genreName, translateDir, animated)
  }

  updateNavLinks(id) {
    this.navManager.handleNavUpdate(id)
  }

  showAbout() {
    const tl = anime.timeline()
    this.goToGenre(0)

    tl
      .add({
        targets: this.about,
        opacity: 1,
        duration: 750,
        offset: 2000,
        easing: 'easeOutQuad'
      })
      .add({
        targets: this.footerCenter,
        opacity: 0,
        duration: 750,
        offset: 0,
        easing: 'easeOutQuad'
      })
  }

  hideAbout() {
    const tl = anime.timeline()
    this.goToGenre(1)

    tl
      .add({
        targets: this.about,
        opacity: 0,
        duration: 750,
        offset: 0,
        easing: 'easeOutQuad'
      })
      .add({
        targets: this.footerCenter,
        opacity: 1,
        duration: 750,
        offset: 2000,
        easing: 'easeOutQuad'
      })
  }

  // ENABLERS
  enableSkipIntro() {
    this.UIIntroManager.enableSkipIntro()
  }

  enableHelp() {
    on(this.helpBtn, {
      mouseenter: () => { addClass(this.helpText, 'visible') },
      mouseleave: () => { removeClass(this.helpText, 'visible') },
    })
  }

  enableTicket() {
    addClass(this.ticketBtn, 'active')

    on(this.ticketBtn, {
      click: () => {
        this.toggleBlurScene()
        addClass(this.artistInfos, 'visible')
      }
    })

    on(this.artistInfosCloseBtn, {
      click: () => {
        this.toggleBlurScene()
        removeClass(this.artistInfos, 'visible')
      }
    })
  }

  // UPDATES
  updateSongInfos(audioInfos) {
    this.footerAudioInfos.update(audioInfos.albumName, audioInfos.title)

    // TICKET
    this.artistInfosCoverImg.src = audioInfos.albumCover
    this.artistInfosArtist.innerHTML = audioInfos.artistName
    this.artistInfosAboutLink.href = audioInfos.aboutUrl
    this.artistInfosTicketingLink.href = audioInfos.ticketingUrl
  }

  updateHelp(genreIndex) {
    let helpText
    switch(genreIndex) {
      case 0:
        helpText = 'Merci pour votre visite !'
        break

      case 1:
        helpText = 'Électrisez la scène en cliquant rapidement.'
        break

      case 2:
        helpText = 'Enflammez la scène en baladant votre souris.'
        break

      case 3:
        helpText = 'Apaisez la scène en maintenant longtemps le clic de votre souris.'
        break

      default:
        helpText = 'Hmmm je suis perdu'
    }
    this.helpText.innerHTML = helpText
  }

  mockUpdateTimeline() {
    this.timelineManager.mockResetAnimation()
  }
}