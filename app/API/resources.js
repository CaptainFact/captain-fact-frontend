import trimRight from 'voca/trim_right'
import { HTTP_API_URL } from "../config"

const cleanUrl = trimRight(HTTP_API_URL, '/api')
const isAsoluteRegex = /^https?:\/\/(.*)/

/**
 * In dev resources are hosted on API. This checks if url is absolute and fix it accordingly
 * @param path
 */
export const staticResource = path => isAsoluteRegex.test(path) ? path : (cleanUrl + path)
