import m from 'mithril'
import Practice from './components/Practice'

const tipsRoute = {
  onmatch() {
    return import('./components/Tips').then(mod => mod.default)
  }
}

m.route.prefix('')
var prefix = window.location.host.match('localhost') ? '' : '/keydash'

m.route(document.getElementById('app')!, prefix + '/', {
  [prefix + '/']: Practice,
  [prefix + '/tips']: tipsRoute,
  [prefix + '/tips/:key']: tipsRoute,
})
