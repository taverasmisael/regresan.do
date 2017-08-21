import * as moment from 'moment'

export const merge = (prev, curr) => [...prev, ...curr]
export const sum = (prev, curr) => prev + curr
export const groupBy = (array: any[], f: (el: any) => any[]) => {
  let groups = {}
  array.forEach(function(o) {
    let group = JSON.stringify(f(o))
    groups[group] = groups[group] || []
    groups[group].push(o)
  })
  return Object.keys(groups).map(group => groups[group])
}
export const sortResDate = (prev, curr) =>
  moment(prev.Fecha).isSameOrAfter(moment(curr.Fecha)) ? 1 : -1
export const findByObjectId = <T>(list: T[], id: number | string): T =>
  list.find(el => el['id'] === id)
