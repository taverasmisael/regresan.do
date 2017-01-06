export const updateObject = <T, U> (oldObject: T, newValues: U): T & U => Object.assign({}, oldObject, newValues);

export const updateItemInArray = <T> (array: T[], itemId: number, updateItemCallback: Function): Array<T> => {
  return array.map(item => (item['id'] !== itemId) ? item : updateItemCallback(item));
};

export const removeArrayItem = (array, index): Array<any> => {
  const length = array.length;
  return [
    ...array.slice(0, index),
    ...array.slice(index + 1, length)
  ];
};
