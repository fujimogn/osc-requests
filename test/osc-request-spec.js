import { expect, } from 'chai'
import OSCRequests from '../src/index'
import { onFetch, } from '../src-dev/spies'
import { spy, } from 'sinon'

const infoResults = {}
const stateResults = {}
const statusResults = {}

describe('OSCRequests', () => {
  const testUrl = 'http://192.168.1.101'  
  const request = new OSCRequests(testUrl)

  
  describe('info', () => {
    it('should call the info route with GET',  onFetch(Promise.resolve(infoResults))
       (() => {
         request.info()
         expect(global.fetch.calledWith('http://192.168.1.101/osc/info', { method: 'get' })).to.be.ok
       }))
  })

  describe('state', () => {
    it('should call the state route with POST', onFetch(Promise.resolve(stateResults))(() => {
      request.state()
      expect(global.fetch.calledWith('http://192.168.1.101/osc/state', { method: 'post'})).to.be.ok
    }))
  })

  describe('status', () => {
    it('should call the status route with POST', onFetch(Promise.resolve(statusResults))(() => {
      request.status('sldkjfslkdjfds')
      expect(global.fetch.calledWith('http://192.168.1.101/osc/commands/status',
                                     { method: 'post', body: '{"id":"sldkjfslkdjfds"}' })).to.be.ok
    }))
  })

  describe('commands', () => {
    it('should be associated with the url that is passed in', () => {
      expect(request.commands.cameraUrl).to.equal(testUrl)
    })
  })
})
