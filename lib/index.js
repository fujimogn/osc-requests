'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpMethods = require('./http-methods');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _cameraConstants = require('./camera-constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var THETA_URL = "http://192.168.1.1";

/**
 * General requests to an OpenCamera object
 *
 * @param (cameraUrl) IP of the OpenCamera. Defaults to http://192.168.1.1 the THETA S IP
 *
 */

var OpenCameraRequests = function () {
    function OpenCameraRequests() {
        var cameraUrl = arguments.length <= 0 || arguments[0] === undefined ? THETA_URL : arguments[0];

        _classCallCheck(this, OpenCameraRequests);

        this.cameraUrl = cameraUrl;
        this.commands = new _commands2.default(cameraUrl);
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


    _createClass(OpenCameraRequests, [{
        key: 'info',
        value: function info() {
            return fetch(this.cameraUrl + '/osc/info', {
                method: _httpMethods.GET
            });
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

    }, {
        key: 'state',
        value: function state() {
            return fetch(this.cameraUrl + '/osc/state', {
                method: _httpMethods.POST,
                body: {}
            });
        }
    }, {
        key: 'status',
        value: function status(id) {
            return fetch(this.cameraUrl + '/osc/comamnds/status', {
                method: _httpMethods.POST,
                body: JSON.stringify({ id: id })
            });
        }
    }]);

    return OpenCameraRequests;
}();

OpenCameraRequests.sorts = _cameraConstants.sorts;
OpenCameraRequests.options = _cameraConstants.options;
OpenCameraRequests.imageTypes = _cameraConstants.imageTypes;
exports.default = OpenCameraRequests;