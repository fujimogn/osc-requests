import { POST } from './http-methods'
import { isNumber } from './util'
import { sorts,
        imageTypes,
        options, } from './camera-constants'

function validType(type) {
    if (type && imageTypes.indexOf(type) === -1) {
        throw new Error(`Unrecognized image type of ${_type}. Must be one of ${", ".join(imageTypes)}`)
    }
    return true
}

function validOptions(options) {
    const offendingOptions = options.reduce((options, option) => {
        if (options.indexOf(option) === -1) {
            options.push(option)
        }
        return options
    }, [])
    if (offendingOptions.length > 0) {
        throw new Error (`Options ${", ".join(offendingOptions)} are not recognized options. Must be one of ${", ".join(options)}`)
    }
    return true;
}

class OpenCameraCommands {

    constructor(cameraUrl) {
        this.cameraUrl = cameraUrl
    }

    _execute(command, parameters) {
        return fetch(`${this.cameraUrl}/osc/commands/execute`, {
            method: POST,
            body: JSON.stringify({
                name: command,
                parameters: parameters || {}
            })
        }).then((response) => {
            if (response.status > 300) {
                try {
                    throw new Error(response.json())
                } catch (exc) {
                    throw new Error(response)
                }
            }

            const parsedResults = response.json()
            if (parsedResults.state == 'error') {
                throw new Error(parsedResults.error)
            }
            return parsedResults
        })
    }

    startSession() {
        return this._execute('camera.startSession')
    }

    updateSession(sessionId) {
        return this._execute('camera.updateSession', { sessionId })
    }

    closeSession(sessionId) {
        return this._execute('camera.closeSession', { sessionId })
    }

    _finishWlan() {
        return this._execute('camera._finishWlan')
    }

    takePicture(sessionId) {
        return this._execute('camera.takePicture', { sessionId })
    }

    _startCapture(sessionId) {
        return this._execute('camera._startCapture', { sessionId })
    }

    _stopCapture(sessionId) {
        return this._execute('camera._stopCapture', { sessionId })
    }

    listImages(entryCount, continuationToken, maxSize) {
        const params = {
            entryCount,
            continuationToken,
            maxSize,
            includeThumb: isNumber(maxSize)
        }
        return this._execute('camera.listImages', params)
    }

    _listAll(entryCount, continuationToken, detail, sort) {
        if (sort && sorts.indexOf(sort) === -1) {
            throw new Error(`Sort type of ${sort} is unrecognized. Must be one of ${", ".join(sorts)}`)
        }
        const params = {
            entryCount,
            continuationToken,
            detail: detail,
            sort: sort || 'newest'
        }

        return this._execute('camera._listAll', params)
    }

    _delete(fileUri) {
        return this._execute('camera.delete', { fileUri })
    }

    getImage(fileUri, _type) {
        if (validType(_type)) {
            const params = {
                fileUri,
                _type: _type || 'full'
            }

            return fetch(`${this.cameraUrl}/osc/commands/execute`, {
                method: POST,
                body: JSON.stringify({
                    name: 'camera.getImage',
                    parameters: { fileUri, _type, }
                })
            }).then((response) => {
                if (response.status > 300) {
                    throw new Error(response)
                }
                return response.blob();
            })
        }
    }

    _getVideo(fileUri, type) {
        if (validType(type)) {
            const params = {
                fileUri,
                type: type || 'full'
            }
            return this._execute('camera._getVideo', params)
        }
    }

    _getLivePreview(sessionId) {
        throw new Error("Live preview not yet supported")
    }

    getMetaData(fileUri) {
        return this._execute('camera.getMetaData', { fileUri })
    }

    getOptions(sessionId, optionNames) {
        if (validOptions(optionNames)) {
            return this._execute('camera.getOptions', {sessionId, optionNames })
        }
    }

    setOptions(sessionId, options) {
        if (validOptions(Object.keys(options))) {
            return this._execute('camera.setOptions', {sessionId, options})
        }
    }

}

export default OpenCameraCommands
