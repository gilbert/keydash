import { standardMap, expandKeys, Keys } from './keys'

export type Level = {
  id: string,
  name: string,
  keys: Keys,
  map: string,
  goal: number,
}

export default [
  {
    id: "updown",
    name: "Up & Down",
    keys: expandKeys('ADEHNP', ''),
    map: levelMap(`
x_____________x
x_____________x

`)
  },
  {
    id: "hourglass",
    name: "Hourglass",
    keys: expandKeys('ADEHNPBF', 'BF'),
    map: levelMap(`
x_____________x
 x___________x
  x_________x
   x_______x
    x_____x
   x_______x
  x_________x
 x___________x
x_____________x
`)
  },
  {
    id: "snake",
    name: "Snake!!",
    keys: standardMap,
    map: levelMap(`
      | |
    x__|__x
   x___|___x
  x_________x
 x__O_____O__x
x_____________x
 x___________x
  x_________x
   x_______x
    x_____x
   x_______x
  x_________x
 x___________x
x_____________x
x_____________x
 x___________x
  x_________x
   x_______x
    x_____x
     x_____x
      x_____x
       x_____x
        x_____x
       x_____x
      x_____x
     x_____x
    x_____x
   x_____x
  x_____x
  x_xx_x
    xxx
`)
  },
  {
    id: "scattered",
    name: "Scattered",
    keys: standardMap,
    map: levelMap(`
   _____ xx   x   x      x               _       _
  xx/ x___x_|  x  x  x x   x      xx       x   | |     | |x
 xx| |   xxx   __  _ __x   __ _ _x __ __ _x| |_x ___|x |
 | |    / _ x\\| '_ \\xxx / _\` x| '__/xx _\` | x__/ __|xx |x
 | x|x___| (_x)x xx| |x xx| |xxx (_|x |x | xx| (_|x | x|_\\__ \\_|
  x\\x__xx___\\___/|_| xx|_x|\\__,xx |_x|  \\__,_|\\_x_|___(_xx)
                xx x  x x __/ |xxx
 x x    x xx  xx    xx  xx  x xx xxx |___xx/xxx
`)
  }
]
  .map(def => {
    var level: Level = { ...def, goal: def.map.split('x').length - 1 }
    return level
  })

function levelMap (levelStr: string) {
  return levelStr.replace(/^\n+/, '').replace(/\n+$/, '') + '\n'
}
