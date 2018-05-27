import m from 'mithril'
import Practice from './components/Practice'

// HACK: Make available for dynamically imported pages
window.m = m

const tipsRoute = {
  onmatch() {
    return import('./components/Tips').then(mod => mod.default)
  }
}

var prefix = window.location.host.match('localhost') ? '' : '/keydash'
var q = m.parseQueryString(window.location.search.slice(1))

if ( q.p ) {
  // Redirected via github pages' 404.html
  if ( window.history && window.history.pushState ) {
    window.history.replaceState({}, document.title, q.p + window.location.hash)
  }
  else {
    window.location.replace(prefix)
  }
}

m.route.prefix(prefix)

m.route(document.getElementById('app'), '/', {
  '/': Practice,
  '/tips': tipsRoute,
  '/tips/:key': tipsRoute,
})
