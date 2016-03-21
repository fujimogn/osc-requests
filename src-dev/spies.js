import { stub, } from 'sinon'

export function onFetch(results) {
  return (fn) => {
    return () => {
      global.fetch = stub().returns(results)
      return fn.apply(this, arguments)
    }
  }
}
