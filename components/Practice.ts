import m from 'mithril'
import levels, { Level } from '../lib/levels'
import Dash, { Stats } from '../lib/dash'
import layout from '../lib/layout'

import DashEditor, { VCR } from './DashEditor'


type Attrs = {}
type State = {
  level: Level
  dash: any
  vcr: any
}

export default {
  oninit({ state, attrs }) {
    var level = levels[0]
    state.dash = Dash(level.goal)
    state.dash.map(m.redraw)

    state.level = level
    state.vcr = null
  },

  view({ state }) {
    var level = state.level
    var stats = state.dash.stats

    return layout('.d-flex-v.no-overflow',
      m('.p-2', [
        m('dl',
          m('dt', 'Level'),
          m('dd',
            m('select', {
              value: level.id,
              onchange: (e:any) => selectLevel(state,e.target.value)
            }, levels.map(lv =>
              m('option', { value: lv.id }, lv.name)
            ))
          ),
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
              m('button.btn.btn-success', {
                onclick: () => state.vcr.playback(level, state.dash.stats.history)
              }, "Playback")
            ]
          ),
        ),
        m('p', "Available shortcuts:"),
        m('ul',
          Object.keys(level.keys).sort().map(k =>
            m('li', k, ": ", level.keys[k].desc)
          )
        )
      ]),
      m('.d-flex-v', [
        m('.h2.p-1', "Delete all the x's!"),
        [ // Fragment to make key-identity work
          m(DashEditor, {
            class: 'd-flex-v',
            key: level.id,
            level: level,
            dashMode: () => state.dash.stats.mode,
            ref: (vcr: VCR) => {
              state.vcr = vcr
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
        ]
      ])
    )
  }
} as m.Component<Attrs,State>


function selectLevel(state: State, id: string) {
  var level = levels.find(lv => lv.id === id)!
  state.level = level

  state.dash = Dash(level.goal)
  state.dash.map(m.redraw)
}

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
