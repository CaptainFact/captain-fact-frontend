import 'isomorphic-fetch'
import trimRight from 'voca/trim_right'

import { SocketApi } from './socket_api'
import { HTTP_API_URL } from '../config'
import { parseServerError } from './server_error'
import flashNoInternetError from './no_internet_error'
import { optionsToQueryString } from '../lib/url_utils'


class CaptainFactHttpApi {
  constructor(baseUrl, token) {
    this.baseUrl = `${trimRight(baseUrl, '/')}/`
    this.hasToken = !!token
    this.headers = {'Content-Type': 'application/json'}
    if (token)
      this.headers.authorization = `Bearer ${token}`
  }

  setAuthorizationToken(token) {
    this.hasToken = true
    localStorage.token = token
    if (token)
      this.headers.authorization = `Bearer ${token}`
    SocketApi.setAuthorizationToken(token)
  }

  resetToken() {
    this.hasToken = false
    delete (this.headers.authorization)
    localStorage.removeItem('token')
    SocketApi.resetToken()
  }

  prepareResponse(promise) {
    return new Promise((fulfill, reject) => {
      return promise.then(response => {
        return response.text().then((body) => {
          body = body ? JSON.parse(body) : null
          if (!response.ok)
            reject(parseServerError(body))
          else
            fulfill(body)
        })
      }).catch(e => {
        console.error(e)
        // Special case when no internet connection
        reject('noInternet')
        flashNoInternetError()
      })
    })
  }

  makeRequest(resourceUrl, requestType, data) {
    const response = fetch(this.baseUrl + resourceUrl, {
      method: requestType,
      body: data ? JSON.stringify(data) : '',
      headers: this.headers
    })
    return this.prepareResponse(response)
  }

  /**
   * Send a get request against the given `resourceUrl`.
   * @param {string} resourceUrl
   * @param {object} [options] - A map of options to convert to query
 *                               string http://url?option1=xxx&option2=yyy
   * @returns {Promise}
   */
  get(resourceUrl, options) {
    const queryString = optionsToQueryString(options)
    const url = this.baseUrl + resourceUrl + queryString
    const response = fetch(url, {headers: this.headers})
    return this.prepareResponse(response)
  }

  post(resourceUrl, data) {
    return this.makeRequest(resourceUrl, 'POST', data)
  }

  put(resourceUrl, data) {
    return this.makeRequest(resourceUrl, 'PUT', data)
  }

  delete(resourceUrl, data) {
    return this.makeRequest(resourceUrl, 'DELETE', data)
  }
}


// Configure HttpApi
const token = typeof localStorage === 'undefined' ? null : localStorage.token
const HttpApi = new CaptainFactHttpApi(HTTP_API_URL, token)

export default HttpApi
