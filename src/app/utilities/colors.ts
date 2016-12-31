export const mdlPalette = (tone = '500', onlyValues = false) => {

  const palette = {
    colors500: {
      red: '#F44336',
      pink: '#E91E63',
      purple: '#9C27B0',
      deep_purple: '#673AB7',
      indigo: '#3F51B5',
      blue: '#2196F3',
      light_blue: '#03A9F4',
      cyan: '#00BCD4',
      teal: '#009688',
      green: '#4CAF50',
      light_green: '#8BC34A',
      lime: '#CDDC39',
      yellow: '#FFEB3B',
      amber: '#FFC107',
      orange: '#FF9800',
      deep_orange: '#FF5722',
      brow: '#795548',
      grey: '#9E9E9E',
      blue_grey: '#607D8B'
    },
    colorsA700: {
      red: '#D50000',
      pink: '#C51162',
      purple: '#AA00FF',
      deep_purple: '#6200EA',
      indigo: '#304FFE',
      blue: '#2962FF',
      light_blue: '#0091EA',
      cyan: '#00B8D4',
      teal: '#00BFA5',
      green: '#00C853',
      light_green: '#64DD17',
      lime: '#AEEA00',
      yellow: '#FFD600',
      amber: '#FFAB00',
      orange: '#FF6D00',
      deep_orange: '#DD2C00'
    }
  }

  if (onlyValues) {
    return (<any>Object).values(palette[`colors${tone}`]);
  } else {
    return palette[`colors${tone}`];
  }
}


export const rating = (name) => {
  const palette =  {
    excelente: '#166499',
    bueno: '#00A4A3',
    regular: '#F8AA19',
    malo: '#E54128'
  };

  return (typeof name === 'boolean' && name === true) ? (<any>Object).values(palette) : palette[name];
}
