import 'babel-polyfill'
import 'whatwg-fetch'
import { DefaultLoadingManager, JSONLoader, ObjectLoader } from 'three'
import { on, find, findOne, next } from 'chirashi'
import anime from 'animejs'

import ThreeWrapper from './three'
// import SpotifyAPI from './components/SpotifyData'
import PlaylistPlayerManager from './components/PlayerManager'
import UIManager from './components/UIManager'
import DevPanel from './components/DevPanel'

import playlistData from '../playlistsData.json'

// ------ GLOBALS --------
let audioPlayer
let threeWrapper
let uiManager

let isAnimatingGenre = false
let currentGenreIndex = 0

// DEV
window.DEVMODE = window.location.hash && window.location.hash.substring(1) === 'DEV'
let devPanel

// ------ THREEJS --------
const MAX_FPS = 60
const FPS_INTERVAL = 1000 / MAX_FPS

let lastDate = Date.now()
let dt = 0
let now = 0

// --- HTML ELEMENTS -----
const ui = findOne(document.body, '.ui')
const links = find(ui, '.nav__about')
const current_nav_genre = find(ui, '.current_genre')

// ------ FUNCTIONS ------
function goToGenre(genreIndex) {
  const translateDirection = genreIndex > currentGenreIndex ? 1 : -1

  currentGenreIndex = genreIndex
  isAnimatingGenre = true

  uiManager.mockUpdateTimeline()
  audioPlayer.goToGenre(genreIndex)
  threeWrapper.goToLayer(genreIndex, () => { isAnimatingGenre = false })

  uiManager.updateSongInfos(audioPlayer.getAudioInfos())
  uiManager.updateHelp(genreIndex)
  uiManager.updateGenreName(genreIndex, translateDirection, true)
  uiManager.updateNavLinks(genreIndex)
}

function goToNextGenre() {
  if (currentGenreIndex + 1 < 4) {
    goToGenre(currentGenreIndex + 1)
  }
}

function goToPrevGenre() {
  if (currentGenreIndex - 1 >= 1) {
    goToGenre(currentGenreIndex - 1)
  }
}

function goToNextSong() {
  audioPlayer.randomNextSongArtist()
  threeWrapper.goToNextSong()
  uiManager.updateSongInfos(audioPlayer.getAudioInfos())
}

function toggleBlurScene() {
  threeWrapper.toggleBlurScene()
}

function toggleMute() {
  audioPlayer.toggleMute()
}

function animate() {
  requestAnimationFrame(() => { animate() })

  now = Date.now()
  dt = now - lastDate

  if (dt > FPS_INTERVAL) {
    lastDate = now - (dt % FPS_INTERVAL)

    if (window.DEVMODE) devPanel.beginCapture()

    audioPlayer.update()
    threeWrapper.update(dt, audioPlayer.intensities)

    if (window.DEVMODE) {
      devPanel.update([
        audioPlayer.frequenciesAll,
        audioPlayer.frequenciesBass,
        audioPlayer.frequenciesHigh,
      ])

      devPanel.endCapture()
    }
  }
}

// --- EVENTS FUNCTIONS ---
function handleScroll(e) {
  if (!isAnimatingGenre) {
    if (e.deltaY < 0) {
      goToPrevGenre()
    } else {
      goToNextGenre()
    }
  }
}

function handeKeyDown(e) {
  if (!isAnimatingGenre) {
    if (e.keyCode === 38) {
      goToPrevGenre()
    } else if (e.keyCode === 40) {
      goToNextGenre()
    }
  }
}

// ------- EVENTS --------
on(window, {
  // wheel: (e) => { handleScroll(e) },
  keydown: (e) => { handeKeyDown(e) },
})

// -------- MAIN ---------
// DEV
const navFuncs = { goToGenre, goToNextSong, toggleMute, toggleBlurScene }
uiManager = new UIManager(navFuncs)

// To create playlist from playlist passed in parameters of SpotifyAPI (prompted in console)
// const SpotifyManager = new SpotifyAPI({
//   tab_playlist: [{
//     genre: 'POPROCK',
//     playlist_id: '7LSpLqXxfC2pJyFWYgvmOg',
//     tracks: [],
//   },
//   {
//     genre: 'RAP',
//     playlist_id: '4CRRBFgpMtgMT3zumtQ4au',
//     tracks: [],
//   },
//   {
//     genre: 'ELECTRO',
//     playlist_id: '1ZCNjZ0fNiYfBB0O9pcrJu',
//     tracks: [],
//   }],
// })
// SpotifyManager.createPlaylists()

const jsonLoader = new JSONLoader()
const objectLoader = new ObjectLoader()

const assets = {
  models: {},
  fonts: {},
}

DefaultLoadingManager.onLoad = () => {
  audioPlayer = new PlaylistPlayerManager(playlistData, goToNextSong)
  threeWrapper = new ThreeWrapper(assets, audioPlayer)

  // DEV
  if (window.DEVMODE) devPanel = new DevPanel(false, threeWrapper, audioPlayer, navFuncs)

  uiManager.enableSkipIntro()
  uiManager.updateSongInfos(audioPlayer.getAudioInfos())
  uiManager.updateGenreName(0, 1, false)

  animate()

  audioPlayer.play()
  uiManager.mockUpdateTimeline()
}

jsonLoader.load('../assets/models/riles.json', (obj) => {
  assets.models.rilesName = obj
})

objectLoader.load('../assets/models/superpoze_group.json', (obj) => {
  assets.models.superpozeNameGrp = obj
})

objectLoader.load('../assets/models/fishbach.json', (obj) => {
  assets.models.fishbach = obj
})

