import { get } from '../../helpers/FetchApiController'

export async function getAudioAnalysisMock() {
  let data
  try {
    data = await get(
      'https://api.spotify.com/v1/audio-analysis/06AKEBrKUckW0KREUWRnvT',
      {
        method: 'get',
        headers: {
          Authorization: 'Bearer BQBokBpJ5mFRaavUwXu6VoYesj0pWfH733bcaaFAqBUb-IDyXLt6hVI66HeIM2QLNsB3G-wYINYrUDo_WsYnY7NCU0DgGHTuZAjicqBUftRNMN07Z0qL8lduRlBR5iagKw3DFW46rubb',
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (e) {
    console.log('getAudioAnalysisMock.getAudioAnalysisMock', e);
  }

  return data
}
