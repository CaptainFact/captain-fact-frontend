import { Socket } from 'phoenix'
import { WS_API_URL } from '../config'
import parseServerError from './server_error'
import noInternetError from './no_internet_error'
import { getFromLocalStorage, LOCAL_STORAGE_KEYS } from '../lib/local_storage'

class CaptainFactSocketApi {
  constructor(url) {
    const token = getFromLocalStorage(LOCAL_STORAGE_KEYS.TOKEN)
    this.socketUrl = url
    this.channels = {}
    this.createSocket(token)
  }

  setAuthorizationToken(token) {
    this.createSocket(token)
  }

  resetToken() {
    this.socket = new Socket(this.socketUrl)
  }

  createSocket(token) {
    this.socket = new Socket(this.socketUrl, { params: { token } })
    this.socket.onError(noInternetError)
    this.socket.onClose(noInternetError)
  }

  /**
   * Joins a channel. Automatically open the socket if its closed
   * @param {String} identifier
   * @param {String} channelAddress
   * @param {{}} mapEventsToFuncs - functions to call when events are triggered
   * @return {Promise} promise
   */
  joinChannel(identifier, channelAddress, mapEventsToFuncs = {}) {
    return new Promise((fulfill, reject) => {
      if (['closed', 'closing'].includes(this.socket.connectionState())) {
        this.socket.connect()
      }
      const channel = this.socket.channel(channelAddress)
      this.channels[identifier] = channel
      for (const [event, func] of Object.entries(mapEventsToFuncs)) {
        channel.on(event, func)
      }
      channel
        .join()
        .receive('ok', fulfill)
        .receive('error', (e) => reject(e.reason))
        .receive('timeout', () => reject('noInternet'))
    })
  }

  /**
   * Leaves a channel. Automatically close the socket if there's no more channel
   * @param {String} identifier
   * @return {Phoenix.Channel} channel
   */
  leaveChannel(identifier) {
    const socketState = this.socket.connectionState()
    // Leave channel gracefully
    if (this.channels[identifier]) {
      this.channels[identifier].leave()
      delete this.channels[identifier]
    }
    // If no more channels, close the socket
    if (!Object.keys(this.channels).length && ['connecting', 'open'].includes(socketState)) {
      this.socket.disconnect()
    }
  }

  /**
   * Push given message on the channel
   * @param {String} channelIdentifier
   * @param {String} message
   * @param {Object} params
   * @return {Promise} channel
   */
  push(channelIdentifier, message, params = {}) {
    return new Promise((fulfill, reject) => {
      return this.channels[channelIdentifier]
        .push(message, params)
        .receive('ok', (data) => fulfill(data))
        .receive('error', (err) => reject(parseServerError(err)))
    })
  }
}

export default new CaptainFactSocketApi(WS_API_URL)
