import m from 'mithril'
import levels from './lib/levels'
import Practice from './components/Practice'

var level = levels.find(l => l.id === 'updown')!

m.mount(document.getElementById('app')!, {
  view() {
    return m(Practice, { level: level })
  }
})
