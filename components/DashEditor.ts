import m from 'mithril'
import { Level } from '../lib/levels'
import { DashRun } from '../lib/dash'

declare const CodeMirror: any

type Attrs = {
  level: Level
  onkeystroke: (ks: string) => void
  onprogress: (mod: number) => void
  ref: (vcr: VCR) => void
}
type State = {
  level: Level
  mode: 'live' | 'playback'
  run: DashRun
  editor: any
}

type VCR = {
  playback: (run: DashRun) => void
}


export default {
  oninit({ state, attrs }) {
    // Store in state to ensure it doesn't change under our feet.
    state.level = attrs.level
    state.mode = 'live'

    attrs.ref({
      playback: (run) => {
        state.run = run
        state.mode = 'playback'
      }
    })
  },

  oncreate({ state, attrs, dom }) {
    // Restrict available keybindings
    CodeMirror.keyMap['training'] = attrs.level.keys || {}

    var editor = state.editor = CodeMirror.fromTextArea(dom, {
      lineNumbers: true,
      mode: "text/html",
      theme: "blackboard",
      keyMap: "training",
    })

    editor.on('keyHandled', handleKey)
    editor.on('beforeChange', validateChange)
    editor.on('mousedown', restrictMouse)

    // editor.unlock = function () {
    //   editor.off('keyHandled', handleKey)
    //   editor.off('beforeChange', validateChange)
    //   editor.off('mousedown', restrictMouse)
    // }

    function handleKey (_editor: any, name: string) {
      attrs.onkeystroke(name)
    }

    function restrictMouse (editor: any, e: Event) {
      e.preventDefault()
      editor.focus()
      editor.setCursor(0,0)
      // editor.scrollCursorIntoView()
    }

    function validateChange (editor: any, change: any) {
      if (change.text[0]) {
        console.log("You can't add your own characters")
        change.cancel()
      }
      var deletingChars = editor.doc.getRange(change.from, change.to)
      if (deletingChars.match(/[^x]/)) {
        console.log("You can only delete x characters")
        change.cancel()
      }

      var mod = deletingChars.split('x').length - 1
      attrs.onprogress(mod)
    }
  },

  view({ state }) {
    return m('textarea', state.level.map)
  }
} as m.Component<Attrs,State>
