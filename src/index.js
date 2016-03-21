import { GET,
         POST, } from './http-methods'

import OSCCommands from './commands'
import {
  sorts,
  options,
  imageTypes, } from './camera-constants'

const THETA_URL = "http://192.168.1.1"

/**
 * General requests to an OpenCamera object
 *
 * @param (cameraUrl) IP of the OpenCamera. Defaults to http://192.168.1.1 the THETA S IP
 *
 */
class OSCRequests {

  static sorts = sorts
  static options = options
  static imageTypes = imageTypes

  /**
   *
   * @param cameraUrl - URL of the spherical camera you are using. Defaults to http://192.168.1.1 the THETA S IP
   */
  constructor(cameraUrl = THETA_URL) {
    this.cameraUrl = cameraUrl
    this.commands = new OSCCommands(cameraUrl)
  }

  _formatResults(result) {
    try {
      const jsonResults = result.json()
      if (result.status >= 300) {
        throw new Error(jsonResults)
      }
      return result.json()
    } catch (error) {
      throw new Error(result)
    }
  }

  /**
   *
   * @returns Promise with camera info json
   * Example output:
   *  {
   *   "manufacturer": "RICOH",
   *   "model": "RICOH THETA S",
   *   "serialNumber": "00001234",
   *   "firmwareVersion": "1.0.0",
   *   "supportUrl": "https://theta360.com/en/support/",
   *   "endpoints": {
   *       "httpPort": 80,
   *       "httpUpdatesPort": 80
   *   },
   *   "gps": false,
   *   "gyro": false,
   *   "uptime": 67,
   *   "api": [
   *       "/osc/info",
   *       "/osc/state",
   *       "/osc/checkForUpdates",
   *       "/osc/commands/execute",
   *       "/osc/commands/status"
   *   ]
   *}
   */
  info() {
    return fetch(`${this.cameraUrl}/osc/info`, {
      method: GET
    }).then(this._formatResults)
  }

  /**
   *
   * @returns Promise with current camera state information
   * Example output:
   * {
   *  "fingerprint": "12EGA33",
   *   "state": {
   *     "sessionId": "12ABC3",
   *     "batteryLevel": 0.33,
   *     "storageChanged": false,
   *     "_captureStatus": "idle",
   *     "_recordedTime": 0,
   *     "_recordableTime": 0,
   *     "_latestFileUri": "100RICOH/R0010015.JPG",
   *     "_batteryState": "disconnect"
   *   }
   *  }
   **/
  state() {
    return fetch(`${this.cameraUrl}/osc/state`, {
      method: POST,
    }).then(this._formatResults)
  }


  /**
   *
   * @param id - the id of the job you are retrieving the status for. (like taking a picture)
   * @returns Promise with the state of the job
   *
   * Example output:
   * {
   * "name": "camera.takePicture",
   * "state": "done",
   * "results": {
   *    "fileUri": "100RICOH/R0010015.JPG"
   *  }
   * }
   */
  status(id) {
    return fetch(`${this.cameraUrl}/osc/commands/status`, {
      method: POST,
      body: JSON.stringify({ id })
    }).then(this._formatResults)
  }

}

export default OSCRequests
