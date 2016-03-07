import { GET,
         POST, } from './http-methods'

import OpenCameraCommands from './commands'
import {sorts, options, imageTypes } from './camera-constants'

const THETA_URL = "http://192.168.1.1"

/**
 * General requests to an OpenCamera object
 *
 * @param (cameraUrl) IP of the OpenCamera. Defaults to http://192.168.1.1 the THETA S IP
 *
 */
class OpenCameraRequests {

    static sorts = sorts
    static options = options
    static imageTypes = imageTypes

    constructor(cameraUrl = THETA_URL) {
        this.cameraUrl = cameraUrl
        this.commands = new OpenCameraCommands(cameraUrl)
    }

    /**
     *
     * @returns Promise with camera info json
     * Ex:
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
        })
    }

    /**
     *
     * @returns Promise with current camera state information
     * Ex:
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
            body: {}
        })
    }

    status(id) {
        return fetch(`${this.cameraUrl}/osc/comamnds/status`, {
            method: POST,
            body: { id }
        })
    }

}

export default OpenCameraRequests