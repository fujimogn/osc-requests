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

TODO

