import "isomorphic-fetch"
import trimRight from 'voca/trim_right'

import { SocketApi } from "./socket_api"
import { HTTP_API_URL } from "../config.jsenv"
import { parseServerError } from './server_error'
import flashNoInternetError from './no_internet_error'


class CaptainFactHttpApi {
  constructor(baseUrl, token) {
    this.baseUrl = trimRight(baseUrl, '/') + '/'
    this.hasToken = !!token
    this.headers = {
      'authorization': token ? `Bearer ${token}` : "",
      'Content-Type': "application/json"
    }
  }

  setAuthorizationToken(token) {
    this.hasToken = true
    localStorage.token = token
    this.headers['authorization'] = token ? `Bearer ${token}` : ""
    SocketApi.setAuthorizationToken(token)
  }

  resetToken() {
    this.hasToken = false
    delete(this.headers['authorization'])
    localStorage.removeItem("token")
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
      }).catch(() => {
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

  get(resourceUrl) {
    const response = fetch(this.baseUrl + resourceUrl, {headers: this.headers})
    return this.prepareResponse(response)
  }

  post(resourceUrl, data) {
    return this.makeRequest(resourceUrl, "POST", data)
  }

  put(resourceUrl, data) {
    return this.makeRequest(resourceUrl, "PUT", data)
  }

  delete(resourceUrl, data) {
    return this.makeRequest(resourceUrl, "DELETE", data)
  }
}


// Configure HttpApi
const token = typeof localStorage === "undefined" ? null : localStorage.token
const HttpApi = new CaptainFactHttpApi(HTTP_API_URL, token)

export default HttpApi
