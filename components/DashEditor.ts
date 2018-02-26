import m from 'mithril'
import { Level } from '../lib/levels'
import { DashRun } from '../lib/dash'
import { standardMap } from '../lib/keys'
import { objMap } from '../lib/util'

declare const CodeMirror: any

type Attrs = {
  level: Level
  dashMode: () => string,
  onkeystroke: (ks: string) => void
  onprogress: (mod: number) => void
  ref: (vcr: VCR) => void
  class?: string
}
type State = {
  level: Level
  mode: 'live' | 'playback'
  run: DashRun
  editor: any
  errorMsg: null | string
}

export type VCR = {
  playback: (level: Level, run: DashRun) => void
}


export default {
  oninit({ state, attrs }) {
    // Store in state to ensure it doesn't change under our feet.
    state.level = attrs.level
    state.mode = 'live'

    attrs.ref({
      playback: (level, run) => {
        state.mode = 'playback'
        state.editor.unlock()
        state.editor.doc.setValue(level.map)
        state.editor.lock()
        runPlayback(state.editor, run)
      }
    })
  },

  oncreate({ state, attrs, dom }) {
    // Restrict available keybindings
    CodeMirror.keyMap['training'] = objMap(attrs.level.keys, v => v.cmd)

    var editor = state.editor = CodeMirror.fromTextArea(dom.children[1], {
      lineNumbers: true,
      mode: "text/html",
      theme: "blackboard",
      keyMap: "training",
    })

    editor.lock = function () {
      editor.on('keyHandled', handleKey)
      editor.on('beforeChange', validateChange)
      editor.on('mousedown', restrictMouse)
    }
    editor.unlock = function () {
      editor.off('keyHandled', handleKey)
      editor.off('beforeChange', validateChange)
      editor.off('mousedown', restrictMouse)
    }

    editor.lock()

    var pendingProgress: number | null = null

    //
    // keystrokes trigger after validation
    //
    function handleKey (_editor: any, name: string) {
      attrs.onkeystroke(name)
      if ( pendingProgress ) {
        attrs.onprogress(pendingProgress)
        pendingProgress = null
      }
    }

    function restrictMouse (editor: any, e: Event) {
      e.preventDefault()
      if ( attrs.dashMode() === 'pending' ) {
        editor.focus()
        editor.setCursor(0,0)
      }
    }

    function validateChange (editor: any, change: any) {
      if (change.text[0]) {
        state.errorMsg = `Invalid keystroke (${change.text[0]})`
        change.cancel()
        return
      }
      var deletingChars = editor.doc.getRange(change.from, change.to)
      if (deletingChars.match(/[^x]/)) {
        state.errorMsg = `You can only delete x characters`
        change.cancel()
        return
      }

      state.errorMsg = null
      pendingProgress = deletingChars.split('x').length - 1
    }
  },

  onbeforeremove({ state, dom }) {
    state.editor.unlock()
    state.editor.toTextArea()
  },

  view({ state, attrs }) {
    return m('.dash-editor', { class: attrs.class },
      m('.toast', state.errorMsg || m.trust('&nbsp;')),
      m('textarea', state.level.map)
    )
  }
} as m.Component<Attrs,State>


function runPlayback (editor: any, run: DashRun) {
  editor.focus()
  editor.setCursor(0,0)

  var groups = []
  while (run.length) {
    var group = takeWhile(run, it => typeof it !== 'number')
    run = run.slice(group.length)
    groups.push(group)
  }

  for (var i=0; i < groups.length; i++) {
    for (var k=0; k < groups[i].length; k++) {
      var event = groups[i][k]
      if ( typeof event === 'number' ) {
        // Do nothing
      }
      else if ( 'progressMod' in event ) {
        // Indicate point
      }
      else {
        let cmd = standardMap[event.ks].cmd
        setTimeout(() => editor.execCommand(cmd), event.d)
      }
    }
  }
}

function takeWhile<T>(array: T[], cond: (item:T) => boolean) {
  var results = []
  for (var i=0; i < array.length; i++) {
    results.push(array[i])
    if ( ! cond(array[i]) ) break;
  }
  return results
}
