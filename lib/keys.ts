import { pick } from './util'

type Key = {
  cmd: string,
  desc: string,
}

export type Keys = Record<string,Key>

export const standardMap: Keys = {
  'Ctrl-F': { cmd: 'goCharRight', desc: 'Go right one character' },
  'Ctrl-B': { cmd: 'goCharLeft', desc: 'Go left one character' },
  'Ctrl-P': { cmd: 'goLineUp', desc: 'Go up one line' },
  'Ctrl-N': { cmd: 'goLineDown', desc: 'Go down one line' },
  'Alt-F': { cmd: 'goWordRight', desc: 'Go right one word' },
  'Alt-B': { cmd: 'goWordLeft', desc: 'Go left one word' },
  'Ctrl-A': { cmd: 'goLineStart', desc: 'Go to beginning of line' },
  'Ctrl-E': { cmd: 'goLineEnd', desc: 'Go to end of line' },
  'Ctrl-V': { cmd: 'goPageDown', desc: 'Go down one page' },
  'Alt-V': { cmd: 'goPageUp', desc: 'Go up one page' },
  'Ctrl-D': { cmd: 'delCharAfter', desc: 'Delete one character forwards' },
  'Ctrl-H': { cmd: 'delCharBefore', desc: 'Delete one character backwards' },
  'Alt-D': { cmd: 'delWordAfter', desc: 'Delete one word forwards' },
  'Alt-Backspace': { cmd: 'delWordBefore', desc: 'Delete one word backwards' },
  'Ctrl-K': { cmd: 'killLine', desc: 'Delete from cursor to end of line' },
  'Ctrl-T': { cmd: 'transposeChars', desc: 'Switch characters' },
}

export function expandKeys (ctrls: string, alts: string): Keys {
  var keystrokes =
    ctrls.split('').map(ch => `Ctrl-${ch}`).concat(
      alts.split('').map(ch => `Alt-${ch}`)
    )
  return pick(standardMap, keystrokes)
}
