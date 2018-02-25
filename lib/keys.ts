
export type Keys = Record<string,string>

export const standardMap: Keys = {
  "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown",
  "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd",
  "Ctrl-V": "goPageDown", "Alt-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore",
  "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars"
}

export function expandKeys (ctrls: string, alts: string): Keys {
  var keystrokes =
    ctrls.split('').map(ch => `Ctrl-${ch}`).concat(
      alts.split('').map(ch => `Alt-${ch}`)
    )
  return pick(standardMap, keystrokes)
}

function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const ret: any = {};
  keys.forEach(key => {
    ret[key] = obj[key];
  })
  return ret;
}
