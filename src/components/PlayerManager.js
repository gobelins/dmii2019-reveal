import { arrayAverage, tween, roundToPrec } from '../utils/maths'

import uiContent from '../../assets/data/ui-content.json'

const BASE_VOLUME = 0.4

export default class PlaylistPlayerManager {
  constructor(playlists = {}, onEndCallback, opts = {}) {
    this.playlists = playlists
    this.onEndCallback = onEndCallback
    this.data = []

    this.autoplay = opts.autoplay || false
    this.controls = opts.controls || false
    this.loop = opts.loop || false
    this.nb_song_per_artist = opts.nb_song_per_artist || 5

    this.current_music_id = 0
    this.current_genre_id = 0
    this.current_artist_id = 0

    this.isMuted = false
    this.isPlaying = false
    this.currentSongStartTime = 0
    this.progress = 0
    this.timeout = null

    this.intensities = {
      all: 0,
      bass: 0,
      kick: 0,
      high: 0
    }

    this.init()
  }

  init() {
    this.data = this._sortData(this.playlists)
    this.audioInit()
    this.update()
  }

  getAudioInfos() {
    return {
      artistName: this.data[this.current_genre_id].artists[this.current_music_id][0].name,
      albumName: this.data[this.current_genre_id].name_album[this.current_music_id],
      albumCover: this.data[this.current_genre_id].images_album[this.current_music_id][1].url,
      title: this.data[this.current_genre_id].name_song[this.current_music_id],
      aboutUrl: uiContent.artistsInfos[this.current_genre_id][this.current_artist_id].aboutUrl,
      ticketingUrl: uiContent.artistsInfos[this.current_genre_id][this.current_artist_id].ticketingUrl,
    }
  }

  audioInit() {
    this.audio = new Audio()
    this.audio.src = this.data[this.current_genre_id].url_preview[this.current_music_id]
    this.audio.context = new (window.AudioContext || window.webkitAudioContext)()
    this.audio.loop = this.loop
    this.audio.crossOrigin = 'anonymous'

    this.audio.addEventListener('ended', () => {
      console.log('PlaylistPlayerManager EDNERD', this.progress)
      this.progress = 0
      this.onEndCallback()
    })

    this.source = this.audio.context.createMediaElementSource(this.audio)

    // VOLUME
    this.gainNode = this.audio.context.createGain()
    this.gainNode.gain.value = BASE_VOLUME

    // NO FILTERING
    this.analyserAll = this.audio.context.createAnalyser()
    this.analyserAll.minDecibels = -90
    this.analyserAll.maxDecibels = -10
    this.analyserAll.smoothingTimeConstant = 0.85
    this.analyserAll.fftSize = 512

    this.source.connect(this.analyserAll)

    // BASS FILTERING
    this.analyserBass = this.audio.context.createAnalyser()
    this.analyserBass.smoothingTimeConstant = 0.85
    this.analyserBass.fftSize = 512
    this.bassFilter = this.audio.context.createBiquadFilter()
    this.bassFilter.type = 'lowpass'
    this.bassFilter.frequency.value = 35

    this.source.connect(this.bassFilter)
    this.bassFilter.connect(this.analyserBass)

    // HIGH FILTERING
    this.analyserHigh = this.audio.context.createAnalyser()
    this.analyserHigh.smoothingTimeConstant = 0.85
    this.analyserHigh.fftSize = 512
    this.highFilter = this.audio.context.createBiquadFilter()
    this.highFilter.type = 'highpass'
    this.highFilter.frequency.value = 4000

    this.source.connect(this.highFilter)
    this.highFilter.connect(this.analyserHigh)

    // CONNECT TO DESTINATION
    this.source.connect(this.gainNode)
    this.gainNode.connect(this.audio.context.destination)

    this.frequenciesAll = new Uint8Array(this.analyserAll.frequencyBinCount)
    this.frequenciesBass = new Uint8Array(this.analyserBass.frequencyBinCount)
    this.frequenciesHigh = new Uint8Array(this.analyserHigh.frequencyBinCount)

    this.analyserAll.getByteFrequencyData(this.frequenciesAll)
    this.analyserBass.getByteFrequencyData(this.frequenciesBass)
    this.analyserHigh.getByteFrequencyData(this.frequenciesHigh)
  }

  _sortData(tabPlaylists) {
    const playlistsSorted = []

    tabPlaylists.forEach((playlistElem) => {
      const playlist = playlistElem.playlist,
        tracks = playlistElem.tracks,
        objTrack = {
          genre: '',
          artists: [],
          images_album: [],
          name_album: [],
          name_song: [],
          url_preview: [],
          popularity: [],
        }

      objTrack.genre = playlist.name

      tracks.forEach((track) => {
        objTrack.artists.push(track.album.artists)
        objTrack.images_album.push(track.album.images)
        objTrack.name_album.push(track.album.name)
        objTrack.name_song.push(track.name)
        objTrack.url_preview.push(track.preview_url)
        objTrack.popularity.push(track.popularity)
      })

      playlistsSorted.push(objTrack)
    })

    return playlistsSorted
  }

  play() {
    this.currentSongStartTime = this.audio.currentTime
    this.isPlaying = true

    this.audio.play()
  }

  pause() {
    this.isPlaying = false
    this.audio.pause()
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    if (this.isMuted) this.gainNode.gain.value = 0
  }

  nextSong() {
    if (this.current_music_id === this.data[this.current_genre_id].url_preview.length - 1)
      this.current_music_id = 0
    else
      this.current_music_id += 1

    if (window.DEVMODE) {
      console.log('curr mus', this.current_music_id)
      console.log('curr mus', this.data[this.current_genre_id].url_preview.length - 1)

      console.info('Song Name ', this.data[this.current_genre_id].name_song[this.current_music_id])
      console.info('Album ', this.data[this.current_genre_id].name_album[this.current_music_id])
      console.info('Artist ', this.data[this.current_genre_id].artists[this.current_music_id][0].name)
    }

    this.pause()
    this.setAudioSrc(this.data[this.current_genre_id].url_preview[this.current_music_id])
    this.play()
  }

  prevSong() {
    if (this.current_music_id > 0) {
      this.current_music_id -= 1

      if (window.DEVMODE) {
        console.info('Song Name ', this.data[this.current_genre_id].name_song[this.current_music_id])
        console.info('Album ', this.data[this.current_genre_id].name_album[this.current_music_id])
        console.info('Artist ', this.data[this.current_genre_id].artists[this.current_music_id][0].name)
      }

      this.pause()
      this.setAudioSrc(this.data[this.current_genre_id].url_preview[this.current_music_id])
      this.play()
    }
  }

  nextGenre() {
    this.goToGenre(this.current_genre_id + 1)
  }

  prevGenre() {
    this.goToGenre(this.current_genre_id - 1)
  }

  goToGenre(genreId) {
    if (genreId >= 0 && genreId < this.data.length) {
      this.current_genre_id = genreId
      this.current_music_id = 0

      this.pause()

      if (window.DEVMODE) {
        console.info('current_genre ', this.data[this.current_genre_id].genre)
        console.info('Song Name ', this.data[this.current_genre_id].name_song[this.current_music_id])
        console.info('Album ', this.data[this.current_genre_id].name_album[this.current_music_id])
        console.info('Artist ', this.data[this.current_genre_id].artists[this.current_music_id][0].name)
      }

      this.setAudioSrc(this.data[this.current_genre_id].url_preview[this.current_music_id])
      this.play()
    } else {
      alert(`PlaylistPlayerManager.goToGenre : ${genreId} out of boundaries`)
    }
  }

  setAudioSrc(src) {
    this.audio.src = src
  }

  randomNextSongArtist() {
    let nb_song = this.data[this.current_genre_id].url_preview.length,
      nb_artist = nb_song / this.nb_song_per_artist

    switch (nb_artist) {
      case 1 :
        this.nextSong()
        break;
      case 2 :
        if (this.current_artist_id < nb_artist - 1) {
          this.current_artist_id += 1

          let max = this.current_artist_id * this.nb_song_per_artist,
            min = (this.current_artist_id * this.nb_song_per_artist) + this.nb_song_per_artist,
            randSong = Math.floor(Math.random() * (max - min) + min)

          this.pause()

          console.log({
            nb_song: nb_song,
            nb_artist: nb_artist,
            min: min,
            max: max,
            rand_song: randSong
          })

          console.info('current_genre ', this.data[this.current_genre_id].genre)
          console.info('Song Name ', this.data[this.current_genre_id].name_song[randSong])
          console.info('Album ', this.data[this.current_genre_id].name_album[randSong])
          console.info('Artist ', this.data[this.current_genre_id].artists[randSong][0].name)

          this.setAudioSrc(this.data[this.current_genre_id].url_preview[randSong])
          this.play()

        } else {
          this.randomPrevSongArtist()
        }
        break;
      default :
        this.play()
        break
    }
  }

  randomPrevSongArtist() {
    let nb_song = this.data[this.current_genre_id].url_preview.length,
      nb_artist = nb_song / this.nb_song_per_artist

    if (this.current_artist_id > 0) {
      this.current_artist_id -= 1

      let max = this.current_artist_id * this.nb_song_per_artist + this.nb_song_per_artist,
        min = (this.current_artist_id * this.nb_song_per_artist),
        randSong = Math.floor(Math.random() * (max - min) + min)

      this.pause()

      console.log({
        nb_song: nb_song,
        nb_artist: nb_artist,
        min: min,
        max: max,
        rand_song: randSong
      })

      console.info('current_genre ', this.data[this.current_genre_id].genre)
      console.info('Song Name ', this.data[this.current_genre_id].name_song[randSong])
      console.info('Album ', this.data[this.current_genre_id].name_album[randSong])
      console.info('Artist ', this.data[this.current_genre_id].artists[randSong][0].name)

      this.setAudioSrc(this.data[this.current_genre_id].url_preview[randSong])
      this.play()
    }
  }

  formatFrequencies(frequenciesAll, frequenciesBass, frequenciesHigh) {
    const intensityAll = arrayAverage(frequenciesAll.slice(0, 160)) / 255
    const intensityBass = arrayAverage(frequenciesBass.slice(0, 4)) / 255
    const intensityKick = arrayAverage(frequenciesHigh.slice(50, 60)) / 255
    const intensityHigh = arrayAverage(frequenciesHigh.slice(40, 100)) / 255

    this.intensities = {
      all: intensityAll,
      bass: intensityBass,
      kick: intensityKick,
      high: intensityHigh,
    }
  }

  update() {
    this.progress = this.audio.currentTime - this.currentSongStartTime

    if (!this.isMuted) {
      const songEaseStart = 1
      const songEaseEnd = this.current_genre_id === 0 ? 164 : 29

      if (this.progress <= songEaseStart) {
        this.gainNode.gain.value = tween(0, BASE_VOLUME, this.progress)
      } else if (this.progress >= songEaseEnd) {
        let easeValue = this.progress - songEaseEnd
        if (easeValue < 0) easeValue = 0
        if (easeValue > 1) easeValue = 1
        this.gainNode.gain.value = tween(BASE_VOLUME, 0, easeValue)
      } else if (this.gainNode.gain.value !== BASE_VOLUME) {
        this.gainNode.gain.value = BASE_VOLUME
      }
    }

    if (this.gainNode.gain.value < 0 || this.gainNode.gain.value > BASE_VOLUME) {
      this.gainNode.gain.value = BASE_VOLUME
    }

    this.analyserAll.getByteFrequencyData(this.frequenciesAll)
    this.analyserBass.getByteFrequencyData(this.frequenciesBass)
    this.analyserHigh.getByteFrequencyData(this.frequenciesHigh)

    this.formatFrequencies(this.frequenciesAll, this.frequenciesBass, this.frequenciesHigh)
  }
}
