export const updateObject = <T, U>(oldObject: T, newValues: U): T & U =>
  Object.assign({}, oldObject, newValues)

export const updateItemInArray = <T>(
  array: T[],
  itemId: string,
  updateItemCallback: Function
): Array<T> => {
  return array.map(item => (item[itemId] ? updateItemCallback(item) : item))
}

export const removeArrayItem = (array, index): Array<any> => {
  const length = array.length
  return [...array.slice(0, index), ...array.slice(index + 1, length)]
}

export const objectRest = (obj: any, keys: Array<string>) => {
  let target = {}
  for (let i in obj) {
    if (keys.indexOf(i) >= 0) {
      continue
    }
    if (!Object.prototype.hasOwnProperty.call(obj, i)) {
      continue
    }
    target[i] = obj[i]
  }
  return target
}
