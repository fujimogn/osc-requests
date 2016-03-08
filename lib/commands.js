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
                name: command,
                parameters: parameters || {}
            }).then(function (response) {
                if (response.status > 300) {
                    throw new Error(response);
                }

                var parsedResults = response.json();
                if (parsedResults.state == 'error') {
                    throw new Error(parsedResults.error);
                }
                return parsedResults;
            });
        }
    }, {
        key: 'startSession',
        value: function startSession() {
            return this._execute('camera.startSession');
        }
    }, {
        key: 'updateSession',
        value: function updateSession(sessionId) {
            return this._execute('camera.updateSession', { sessionId: sessionId });
        }
    }, {
        key: 'closeSession',
        value: function closeSession(sessionId) {
            return this._execute('camera.closeSession', { sessionId: sessionId });
        }
    }, {
        key: '_finishWlan',
        value: function _finishWlan() {
            return this._execute('camera._finishWlan');
        }
    }, {
        key: 'takePicture',
        value: function takePicture(sessionId) {
            return this._execute('camera.takePicture', { sessionId: sessionId });
        }
    }, {
        key: '_startCapture',
        value: function _startCapture(sessionId) {
            return this._execute('camera._startCapture', { sessionId: sessionId });
        }
    }, {
        key: '_stopCapture',
        value: function _stopCapture(sessionId) {
            return this._execute('camera._stopCapture', { sessionId: sessionId });
        }
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
    }, {
        key: '_listAll',
        value: function _listAll(entryCount, continuationToken, detail, sort) {
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
    }, {
        key: '_delete',
        value: function _delete(fileUri) {
            return this._execute('camera.delete', { fileUri: fileUri });
        }
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
                    parameters: { fileUri: fileUri, _type: _type }
                }).then(function (response) {
                    if (response.status > 300) {
                        throw new Error(response);
                    }
                    return response.blob();
                });
            }
        }
    }, {
        key: '_getVideo',
        value: function _getVideo(fileUri, type) {
            if (validType(type)) {
                var params = {
                    fileUri: fileUri,
                    type: type || 'full'
                };
                return this._execute('camera._getVideo', params);
            }
        }
    }, {
        key: '_getLivePreview',
        value: function _getLivePreview(sessionId) {
            throw new Error("Live preview not yet supported");
        }
    }, {
        key: 'getMetaData',
        value: function getMetaData(fileUri) {
            return this._execute('camera.getMetaData', { fileUri: fileUri });
        }
    }, {
        key: 'getOptions',
        value: function getOptions(sessionId, optionNames) {
            if (validOptions(optionNames)) {
                return this._execute('camera.getOptions', { sessionId: sessionId, optionNames: optionNames });
            }
        }
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