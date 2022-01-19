import { SettingsDatabase } from "./databases/settings"

const browser = require("webextension-polyfill")

/**
 * Base helpers class
 */
export class Helper {

  /**
   * Read lines from given texts
   *
   * @param  {steing} body String body to parse
   * @return {array}       List of parsed lines
   */
  static parse_txt(body) {
    const lines = []
    const splited = body.split("\r\n").map(line => line.split("\n"))

    if(splited[0]) {
      const temp_lines = splited[0]
      temp_lines.forEach(line => {
        if(line !== "" && !line.startsWith("!")) {
          lines.push(line)
        }
      })
    }

    return lines
  }

  /**
   * Parse and validate given URL
   *
   * @param  {string} url hostname
   * @return {object}     hostname on success or error
  */
  static parse_url(url) {
    let _url
    let domain

    try {
      _url   = new URL(url)
      if(_url.hostname.includes("www.")) {
        domain = _url.hostname.replace(/^[^.]+\./g, '')
      } else {
        domain = _url.hostname
      }
    } catch(error) {
      _url   = null
      domain = null
    }

    return {
      status: (_url && domain ? true : false),
      url: _url,
      domain: domain
    }
  }

  /**
   * Change badge text
   *
   * @param {string|integer} message
   */
  static set_badge(message) {
    browser.browserAction.setBadgeText({
      text: String(message)
    })
  }

  /**
   * Wait for a while
   *
   * @param  {integer} ms Time to wait in ms
   * @return {promise}
   */
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch current tab
   *
   * @return {object} Current tab information
   */
  static async get_current_tab() {
    return await browser.tabs.query({
      currentWindow: true, active: true
    }).then(tab => tab[0])
  }

  /**
   * Find status from settings database
   *
   * @return {object} current extension status and its row ID
   */
  static async get_extension_status() {
    // Get status
    const db     = await new SettingsDatabase().open()
    const key    = "status"
    const get    = await db.settings.get({ key: key })
    const status = get.value

    return Promise.resolve({
      status: status, id: get.id
    })
  }

}
