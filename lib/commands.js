'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpMethods = require('./http-methods');

var _util = require('./util');

var _cameraConstants = require('./camera-constants');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function validType(type) {
    if (type && _cameraConstants.imageTypes.indexOf(type) === -1) {
        throw new Error('Unrecognized image type of ' + _type + '. Must be one of ' + ", ".join(_cameraConstants.imageTypes));
    }
    return true;
}

function validOptions(options) {
    var offendingOptions = options.reduce(function (options, option) {
        if (options.indexOf(option) === -1) {
            options.push(option);
        }
        return options;
    }, []);
    if (offendingOptions.length > 0) {
        throw new Error('Options ' + ", ".join(offendingOptions) + ' are not recognized options. Must be one of ' + ", ".join(options));
    }
    return true;
}

var OpenCameraCommands = function () {
    function OpenCameraCommands(cameraUrl) {
        _classCallCheck(this, OpenCameraCommands);

        this.cameraUrl = cameraUrl;
    }

    _createClass(OpenCameraCommands, [{
        key: '_execute',
        value: function _execute(command, parameters) {
            return fetch(this.cameraUrl + '/osc/commands/execute', {
                method: _httpMethods.POST,
                body: JSON.stringify({
                    name: command,
                    parameters: parameters || {}
                })
            }).then(function (response) {
                if (response.status > 300) {
                    try {
                        throw new Error(response.json());
                    } catch (exc) {
                        throw new Error(response);
                    }
                }

                var parsedResults = response.json();
                if (parsedResults.state == 'error') {
                    throw new Error(parsedResults.error);
                }
                return parsedResults;
            });
        }

        /**
         * Start a session on the camera
         * @returns Promise with session info
         * {
         *  "name": "camera.startSession",
         *  "state": "done",
         *  "results": {
         *      sessionId: "lsdkjfsdkljf",
         *      timeout: 180
         *     }
         *   }
         */

    }, {
        key: 'startSession',
        value: function startSession() {
            return this._execute('camera.startSession');
        }

        /**
         * Update a session to expire later
         * @param sessionId - the id of the session to update
         * @returns Promise with session info
         * {
         *  "name": "camera.updateSession",
         *  "state": "done",
         *  "results": {
         *      sessionId: "lsdkjfsdkljf",
         *      timeout: 180
         *     }
         *   }
         */

    }, {
        key: 'updateSession',
        value: function updateSession(sessionId) {
            return this._execute('camera.updateSession', { sessionId: sessionId });
        }

        /**
         * Disconnects the client from the camera.
         * @param sessionId - id of the session to close
         * @returns Promise when complete no results
         * {
         *  "name": "camera.closeSession",
         *  "state": "done",
         *  "results": {
         *   }
         */

    }, {
        key: 'closeSession',
        value: function closeSession(sessionId) {
            return this._execute('camera.closeSession', { sessionId: sessionId });
        }

        /**
         * Turns the wireless LAN off.
         * @returns Promise when complete with no results
         * {
         *  "name": "_finishWlan",
         *  "state": "done",
         *  "results": {
         *   }
         */

    }, {
        key: 'finishWlan',
        value: function finishWlan() {
            return this._execute('camera._finishWlan');
        }

        /**
         * Captures an equirectangular image, saving lat/long coordinates to EXIF (if your camera
         * features its own GPS or GPS is enabled on connected mobile phones). Call setOptions prior to this command call if needed.
         * @param sessionId - the id of the session to use
         * @returns Promise with picture info
         * {
         *  "name": "camera.takePicture",
         *  "state": "inProgress",
         *  "results": {
         *       "fileUri": "file URI"
         *     }
         *   }
         */

    }, {
        key: 'takePicture',
        value: function takePicture(sessionId) {
            return this._execute('camera.takePicture', { sessionId: sessionId });
        }

        /**
         * Starts interval or video shooting.
         * The shooting method differs depending on the shooting mode (captureMode) settings.
         * Interval shooting starts when the mode is set to still image capture mode.
         * Video shooting starts when the mode is set to video capture mode.
         * @param sessionId
         * @returns Promise with no results
         * {
         *  "name": "camera._startCapture",
         *  "state": "inProgress",
         *  "results": {}
         *  }
         */

    }, {
        key: 'startCapture',
        value: function startCapture(sessionId) {
            return this._execute('camera._startCapture', { sessionId: sessionId });
        }

        /**
         * Stops interval or video shooting. Use listAll to retrieve
         * @param sessionId
         * @returns Promise with no results
         * * {
         *  "name": "camera._stopCapture",
         *  "state": "done",
         *  "results": {}
         *  }
         */

    }, {
        key: 'stopCapture',
        value: function stopCapture(sessionId) {
            return this._execute('camera._stopCapture', { sessionId: sessionId });
        }

        /**
         * Acquires the still image file list. SET maxSize to retrieve a thumbnail
         * @param entryCount - No. of still image files to be acquired
         * @param continuationToken - Token for reading the continuation from the previous listImages.
         * @param maxSize - Fixed value for maximum size of thumbnails: 160 Required parameter when includeThumb is true
         * @returns
         * {
         *  "name": "camera.listImages",
         *  "state": "done",
         *  "results": {
         * {
         *  "name": "camera._listAll",
         *  "state": "done",
         *  "results":  {
         * "entries": [
         *   {
         *       "name": "R0010016.JPG",
         *       "uri": "100RICOH/R0010016.JPG",
         *       "size": 4214389,
         *       "dateTimeZone": "2015:07:10 11:00:35+09:00",
         *       "width": 5376,
         *       "height": 2688
         *   },
         *   {
         *       "name": "R0010015.JPG",
         *       "uri": "100RICOH/R0010015.JPG",
         *       "size": 4217265,
         *       "dateTimeZone": "2015:07:10 11:00:34+09:00",
         *       "width": 5376,
         *       "height": 2688
         *   },
         *   {
         *       "name": "R0010014.JPG",
         *       "uri": "100RICOH/R0010014.JPG",
         *       "size": 4052147,
         *       "dateTimeZone": "2015:07:10 11:00:13+09:00",
         *       "width": 5376,
         *       "height": 2688
         *   }
         * ],
         * "totalEntries": 16,
         * "continuationToken": "12"
         *   }
         *  }
         *
         */

    }, {
        key: 'listImages',
        value: function listImages(entryCount, continuationToken, maxSize) {
            var params = {
                entryCount: entryCount,
                continuationToken: continuationToken,
                maxSize: maxSize,
                includeThumb: (0, _util.isNumber)(maxSize)
            };
            return this._execute('camera.listImages', params);
        }

        /**
         * Acquires the still image and video file list.
         * @param entryCount - No. of still images and video files to be acquired
         * @param continuationToken - Token for reading the continuation from the previous _listAll. (optional)
         * @param detail - Whether or not file details are acquired true is acquired by default Only values that can be acquired when false is specified are "name", "uri", "size" and "dateTime"
         * @param sort - Specify the sort order
         *               newest (dateTime descending order)/ oldest (dateTime ascending order)
         *               Default is newest
         * @returns Promise with
         {
             "entries": [
                 {
                     "name": "R0010017.MP4",
                     "uri": "100RICOH/R0010017.MP4",
                     "size": 5135574,
                     "dateTimeZone": "2015:07:10 11:05:18+09:00",
                     "width": 1920,
                     "height": 1080,
                     "recordTime": 2
                 },
                 {
                     "name": "R0010016.JPG",
                     "uri": "100RICOH/R0010016.JPG",
                     "size": 4214389,
                     "dateTimeZone": "2015:07:10 11:00:35+09:00",
                     "width": 5376,
                     "height": 2688
                 },
                 {
                     "name": "R0010015.JPG",
                     "uri": "100RICOH/R0010015.JPG",
                     "size": 4217265,
                     "dateTimeZone": "2015:07:10 11:00:34+09:00",
                     "width": 5376,
                     "height": 2688
                 }
             ],
             "totalEntries": 16,
             "continuationToken": "12"
         }
         *  }
         */

    }, {
        key: 'listAll',
        value: function listAll(entryCount, continuationToken, detail, sort) {
            if (sort && _cameraConstants.sorts.indexOf(sort) === -1) {
                throw new Error('Sort type of ' + sort + ' is unrecognized. Must be one of ' + ", ".join(_cameraConstants.sorts));
            }
            var params = {
                entryCount: entryCount,
                continuationToken: continuationToken,
                detail: detail,
                sort: sort || 'newest'
            };

            return this._execute('camera._listAll', params);
        }

        /**
         * Deletes still image or video files.
         * @param fileUri
         * @returns Promise with no results
         * * {
         *  "name": "camera.delete",
         *  "state": "done",
         *  "results": {}
         *  }
         */

    }, {
        key: 'delete',
        value: function _delete(fileUri) {
            return this._execute('camera.delete', { fileUri: fileUri });
        }

        /**
         * Returns a full-size or scaled image given its URI. Input parameters include resolution
         * @param fileUri
         * @param _type - Type of file to be acquired Specify "thumb" or "full" Set to "full" by default if unspecified (thumb: Thumbnail image, full: Original size image)
         * @returns Promise with binary data of image
         *
         */

    }, {
        key: 'getImage',
        value: function getImage(fileUri, _type) {
            if (validType(_type)) {
                var params = {
                    fileUri: fileUri,
                    _type: _type || 'full'
                };

                return fetch(this.cameraUrl + '/osc/commands/execute', {
                    method: _httpMethods.POST,
                    body: JSON.stringify({
                        name: 'camera.getImage',
                        parameters: { fileUri: fileUri, _type: _type }
                    })
                }).then(function (response) {
                    if (response.status > 300) {
                        throw new Error(response);
                    }
                    return response.blob();
                });
            }
        }

        /**
         * Acquires video.
         * @param fileUri
         * @param type - Type of file to be acquired Specify "thumb" or "full" Set to "full" by default if unspecified (thumb: Thumbnail image, full: Original size video)
         * @returns Promise with binary data of thumbnail (JPEG) or video (MP4)
         */

    }, {
        key: 'getVideo',
        value: function getVideo(fileUri, type) {
            if (validType(type)) {
                var params = {
                    fileUri: fileUri,
                    type: type || 'full'
                };
                return this._execute('camera._getVideo', params);
            }
        }

        /**
         * Acquires the Live View. Can only be executed in still image capture mode.
         *   Data acquisition is finished when the camera is operated, shooting starts or the shooting mode is switched.
         * @param sessionId
         */

    }, {
        key: 'getLivePreview',
        value: function getLivePreview(sessionId) {
            throw new Error("Live preview not yet supported");
        }

        /**
         * Shows the meta information for the specified still image.
         * @param fileUri
         * @returns Promise with
         * * {
         *  "name": "camera.getMetaData",
         *  "state": "done",
        "results": {
            "exif": {
                ...
                "ImageWidth": 2000,
                "ImageLength": 1000,
                ...
            },
            "xmp": {
                "ProjectionType": "equirectangular",
            "UsePanoramaViewer": true,
                ...
            }
        }
         *  }
         */

    }, {
        key: 'getMetaData',
        value: function getMetaData(fileUri) {
            return this._execute('camera.getMetaData', { fileUri: fileUri });
        }

        /**
         * Returns current settings for requested properties.
         * @param sessionId
         * @param optionNames - Options must be one of [
         'aperture',
         '_captureInterval',
         'captureMode',
         '_captureNumber',
         'dateTimeZone',
         'exposureCompensation',
         'exposureProgram',
         'fileFormat',
         '_filter',
         'gpsInfo',
         '_HDMIreso',
         'iso',
         'isoSupport',
         'offDelay',
         'remainingPictures',
         'remainingSpace',
         '_remainingVideos',
         'shutterSpeed',
         '_shutterVolume',
         'sleepDelay',
         'totalSpace',
         'whiteBalance',
         '_wlanChannel'
         ]
         * @returns Promise with
         * {
         *  "name": "camera.getOptions",
         *  "state": "done",
         *  "results": {
         *   "options": {
         *   "iso": 200,
         *   ... (options you requested)
         *  }
         */

    }, {
        key: 'getOptions',
        value: function getOptions(sessionId, optionNames) {
            if (validOptions(optionNames)) {
                return this._execute('camera.getOptions', { sessionId: sessionId, optionNames: optionNames });
            }
        }

        /**
         * Property settings for shooting, the camera, etc.
         *
         * Check the properties that can be set and specifications by the API v2 reference options category or camera.getOptions.
         * @param sessionId
         * @param options - options and values to set  [
         'aperture',
         '_captureInterval',
         'captureMode',
         '_captureNumber',
         'dateTimeZone',
         'exposureCompensation',
         'exposureProgram',
         'fileFormat',
         '_filter',
         'gpsInfo',
         '_HDMIreso',
         'iso',
         'isoSupport',
         'offDelay',
         'remainingPictures',
         'remainingSpace',
         '_remainingVideos',
         'shutterSpeed',
         '_shutterVolume',
         'sleepDelay',
         'totalSpace',
         'whiteBalance',
         '_wlanChannel'
         ]
         * @returns Promise with None
         *
         * * {
         *  "name": "camera.setOptions",
         *  "state": "done",
         *  "results": {}
         *  }
         */

    }, {
        key: 'setOptions',
        value: function setOptions(sessionId, options) {
            if (validOptions(Object.keys(options))) {
                return this._execute('camera.setOptions', { sessionId: sessionId, options: options });
            }
        }
    }]);

    return OpenCameraCommands;
}();

exports.default = OpenCameraCommands;