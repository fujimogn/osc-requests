# opencamera-requests
Javascript wrapper for open camera APIs such as the Theta S. https://developers.theta360.com/en/docs/v2/api_reference/

# Installation
opencamera-requests can be installed via npm with
`npm install opencamera-requests`

The bulk of the project can be in imported in code as follows

Ecmascript2015+

`import OpencameraRequests from 'opencamera-requests'`

Standard node common modules

`var OpencameraRequests = require('opencamera-requests');`

# Basic usage
Most basic usage of the library will revolve around instantiating OpencameraRequests with the IP of your camera (defaults to THETA S 
http://192.168.1.1) and then manipulating the OpencameraRequests.commands objects. 

The following is a simple example of taking a photo

```
import OpencameraRequests from 'opencamera-requests'

const theCamera = new OpencameraRequests() //assumes theta
theCamera.commands.startSession().then(({results: {sessionId}}) => {
  return theCamera.commands.takePicture(sessionId)
})
```

# API

**OpencameraRequests**

* constructor(cameraUrl = http://192.168.1.1)
* info() 
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
     
* state() - returns information about the camera state
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
* status(jobId) - retrieves the status of a job (such as taking a picture)
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
* commands - [OpencameraCommands](#commands) object 

<a href="commands"></a>**OpencameraCommands**

* 


