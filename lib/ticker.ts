import stream, {Stream} from 'mithril/stream'

type ExtendedStream<T> = Stream<T> & {
  when: <F>(cond: (tick: number) => boolean, f: () => F) => Stream<F>
}


const ticker = stream(0) as ExtendedStream<number>

setInterval(() => ticker(ticker() + 1), 1000)

ticker.when = (cond, f) => {
  return ticker.map(() => cond(ticker()) ? f() : stream.HALT)
}

export default ticker
