import { expect, } from 'chai'
import OSCRequests from '../src/index'
import { onFetch, } from '../src-dev/spies'
import { spy, } from 'sinon'

const infoResults = {
  
}

describe('OSCRequests', () => {
  const request = new OSCRequests()
  const thetaURL = 'http://192.168.1.1'
  
  describe('info', () => {
    it('should call the info route with GET',  onFetch(Promise.resolve(infoResults))
       (() => {
         request.info()
         expect(global.fetch.calledWith('http://192.168.1.1/osc/info', { method: 'get' })).to.be.ok
       }))
  })
})
