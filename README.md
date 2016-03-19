# osc-requests
Javascript wrapper for open camera APIs such as the Theta S. https://developers.theta360.com/en/docs/v2/api_reference/

# Installation
opencamera-requests can be installed via npm with
`npm install osc-requests`

The bulk of the project can be in imported in code as follows

Ecmascript2015+

`import OSCRequests from 'osc-requests'`

Standard node common modules

`var OSCRequests = require('osc-requests');`

# Basic usage
Most basic usage of the library will revolve around instantiating OSCRequests with the IP of your camera (defaults to THETA S 
http://192.168.1.1) and then manipulating the [OSCRequests.commands](commands) objects. 

The following is a simple example of taking a photo

```
import OSCRequests from 'osc-requests'

const theCamera = new OSCRequests() //assumes theta
theCamera.commands.startSession().then(({results: {sessionId}}) => {
  return theCamera.commands.takePicture(sessionId)
})
```

# API

***OSCRequests***

* **constructor**(cameraUrl = http://192.168.1.1)
* **info**() 
```
@returns Promise with camera info json
      Example output:
       {
        "manufacturer": "RICOH",
        "model": "RICOH THETA S",
        "serialNumber": "00001234",
        "firmwareVersion": "1.0.0",
        "supportUrl": "https://theta360.com/en/support/",
        "endpoints": {
            "httpPort": 80,
            "httpUpdatesPort": 80
        },
        "gps": false,
        "gyro": false,
        "uptime": 67,
        "api": [
            "/osc/info",
            "/osc/state",
            "/osc/checkForUpdates",
            "/osc/commands/execute",
            "/osc/commands/status"
        ]
     }
```
     
* **state**() - returns information about the camera state
```
      @returns Promise with current camera state information
      Example output:
      {
       "fingerprint": "12EGA33",
        "state": {
          "sessionId": "12ABC3",
          "batteryLevel": 0.33,
          "storageChanged": false,
          "_captureStatus": "idle",
          "_recordedTime": 0,
          "_recordableTime": 0,
          "_latestFileUri": "100RICOH/R0010015.JPG",
          "_batteryState": "disconnect"
        }
       }
```
* **status**(jobId) - retrieves the status of a job (such as taking a picture)
```
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
```
* **commands** - [OSCCommands](#commands) object 

# [OSCCommands](#commands)

Commands to preform on the spherical camera. All commands come with a response formatted as written below:

> {
>     "name": "camera.command",
>     "state": "done",
>     "id": "093ujkldsjf",
>     "progress": "{},
>     "errors": {},
>     "results": {
>       "options": {
>         "exposureProgram": 2,
>         "exposureProgramSupport": [1, 2, 4, 9]
>       }
>     } }

Where the results object differs depending on the command. To see what the expected returns for each command is, please check the annotated source.

The follow commands are available:

* startSession
* updateSession
* closeSession
* finishWlan
* takePicture
* startCapture
* stopCapture
* listImages
* listAll
* delete
* getImage
* getVideo
* getLivePreview [TODO]
* getMetadata
* getOptions
* setOptions

