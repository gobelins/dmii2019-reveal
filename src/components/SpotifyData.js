// @flow
import SpotifyWebApi from 'spotify-web-api-js'

export default class SpotifyData {
  // aNumber: number

  constructor(opts = {}) {
    this._opts = opts
    this._playlists = this._opts['tab_playlist']
    this.spotifyAPI = new SpotifyWebApi()
    this.spotifyAPI.setAccessToken(localStorage.getItem('ACCESS_TOKEN'))
    this.file = opts.file || './playlistsData.json'
  }

  async createPlaylists() {
    const dataPlaylist = []

    const fetchAnalysis = async (playlist) => {
      const objTemp = {
        playlist: '',
        tracks: [],
      }
      const fetchedPlaylist = await this.spotifyAPI.getPlaylist('cubwdhzgtyqxdd53gz0azap97', playlist.playlist_id)

      objTemp.playlist = fetchedPlaylist
      
      const trackIds = fetchedPlaylist.tracks.items.map((trackItem) => {
        objTemp.tracks.push(trackItem.track)

        return trackItem.track.id
      })

      const analysisPromises = []

      trackIds.forEach((trackID) => {
        analysisPromises.push(this.spotifyAPI.getAudioAnalysisForTrack(trackID))
      })

      return objTemp
    }

    const tempTabPlaylist = []
    

    let tab_temp = this._playlists.map(playlist => {
      return new Promise((res, rej) => {
        res(fetchAnalysis(playlist))
      })
      .then((res) => {
        return res
      })
    })

    Promise.all(tab_temp)
      .then((res) => {
        this.generateJsonDATA(res)
      })
  }

  generateJsonDATA(obj){
   let jsonObj = JSON.stringify(obj)
  
   console.log(jsonObj)
  }

  get playlists() {
    return this._playlists
  }
}