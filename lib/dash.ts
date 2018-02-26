import stream, {Stream} from 'mithril/stream'
import ticker from './ticker'


export type Mode = 'pending' | 'running' | 'win' | 'stopped'

export type DashRun = Array<
  { ks: string, d: number } |
  { progressMod: number } |
  number
>

export type Stats = {
  mode: Mode,
  history: DashRun,
  progress: number,
  goal: number,
  strokeCount: number,
  seconds: number,
  startTime: number,
  stopTime: null | number,
}

export default function Dash (goal: number) {
  var t = 0

  var initialState: Stats = {
    mode: 'pending',
    history: [],
    progress: 0,
    goal: goal,
    strokeCount: 0,
    seconds: 0,
    startTime: 0,
    stopTime: null,
  }

  type Update
    = { mode: Mode, stats: Partial<Stats> }
    | { keystroke: string }
    | { progressMod: number }
    | { tick: true }

  var updateState = (state: Stats, update: Update): Stats => {
    if ( 'mode' in update ) {
      state = { ...state, ...update.stats, mode: update.mode }
    }
    else if ( 'keystroke' in update ) {
      state.strokeCount += 1
      state.history.push({ ks: update.keystroke, d: Date.now() - state.startTime })
    }
    else if ( 'progressMod' in update ) {
      state.progress += update.progressMod
      state.history.push({ progressMod: update.progressMod })

      if ( state.progress === state.goal ) {
        state.mode = 'win'
        state.stopTime = Date.now()
      }
    }
    else if ( update.tick ) {
      state.seconds += 1
      state.history.push(state.seconds)
    }
    return state
  }

  var updates = stream<Update>()
  var state: Stream<Stats> = stream.scan(
    updateState,
    initialState,
    updates.map(u => 'mode' in u || state().mode === 'running' ? u : stream.HALT)
  )

  // Tick every second while dashing
  var tickStream = ticker.when(
    () => state().mode === 'running',
    () => updates({ tick: true })
  )

  var api = {
    tick: function () {
      updates({ tick: true })
    },
    start: function () {
      updates({ mode: 'running', stats: { stopTime: null, seconds: 0, startTime: Date.now() } })
    },
    stop: function () {
      updates({ mode: 'stopped', stats: {} })
    },
    update: (x: Update) => updates(x),
    map: <T>(f: (s:Stats)=>T) => state.map(f),
    get stats() { return state() },
  }
  return api
}
