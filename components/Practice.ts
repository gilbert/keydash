import m from 'mithril'
import { Level } from '../lib/levels'
import Dash, { Stats } from '../lib/dash'
import layout from '../lib/layout'

import DashEditor from './DashEditor'


type Attrs = {
  level: Level
}
type State = {
  dash: any
  editor: any
}

export default {
  oninit({ state, attrs }) {
    state.dash = Dash(attrs.level.goal)
    state.dash.map(m.redraw)

    state.editor = null
  },
  view({ state, attrs }) {
    var {level} = attrs
    var stats = state.dash.stats

    return layout(
      m('.p-2', [
        m('dl',
          m('dt', 'Level'),
          m('dd', level.name),
          m('dt', 'Stats'),
          m('dd',
            `Status: ${stats.mode}`,
            m('br'),
            stats.mode !== 'pending' && [
              `Time: ${timeElapsed(stats)}`,
              m('br'),
            ],
            `Progress: ${Math.round(stats.progress / stats.goal * 100)}%`,
            m('br'),
            `Strokes: ${stats.strokeCount}`,
            stats.mode === 'win' && [
              m('br'),
              m('button.btn.btn-success', "Playback")
            ]
          ),
        ),
        m('p', "Available shortcuts:"),
        m('ul',
          Object.keys(level.keys).sort().map(k =>
            m('li', JSON.stringify(k))
          )
        )
      ]),
      [
        m(DashEditor, {
          // key: level.id,
          level: level,
          ref: (editor: any) => {
            state.editor = editor
          },
          onkeystroke: (name: string) => {
            if ( state.dash.stats.mode === 'pending' ) {
              state.dash.start()
            }
            state.dash.update({ keystroke: name })
          },
          onprogress: (amount: number) => {
            state.dash.update({ progressMod: amount })
          }
        })
      ])
  }
} as m.Component<Attrs,State>


function timeElapsed (stats: Stats) {
  var totalSeconds = stats.seconds
  var minutes = Math.floor(totalSeconds / 60)
  var seconds = (totalSeconds % 60)
  var formatted = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds

  if (stats.mode === 'win') {
    var ms = (stats.stopTime! - stats.startTime) % 1000
    formatted += "." + ms
  }
  return formatted
}
