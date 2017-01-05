export const merge = (prev, curr) => [...prev, ...curr];
export const sum = (prev, curr) => prev + curr;
export const groupBy = (array: any[], f: (el: any) => any[]) => {
    let groups = {};
    array.forEach(function (o) {
      let group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(group => groups[group])
  }
