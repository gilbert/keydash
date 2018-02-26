
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const ret: any = {};
  keys.forEach(key => {
    ret[key] = obj[key];
  })
  return ret;
}

export function objMap<A,B>(obj: Record<string,A>, f: (v:A, k:string) => B): Record<string,B> {
  var results: Record<string,B> = {}
  for (var prop in obj) {
    results[prop] = f(obj[prop], prop)
  }
  return results
}
