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

export const gamaRegresando = () => {
  return [
    'rgba(91, 77, 183, 1)',
    'rgba(244, 67, 54, 1)',
    'rgba(32, 143, 229, 1)',
    'rgba(250, 87, 35, 1)',
    'rgba(253, 193, 10, 1)',
    'rgba(160, 24, 24, 1)',
    'rgba(224, 145, 35, 1)',
    'rgba(220, 87, 84, 1)',
    'rgba(154, 66, 221, 1)',
    'rgba(0, 191, 105, 1)',
    'rgba(152, 199, 61, 1)',
    'rgba(84, 19, 136, 1)',
    'rgba(217, 3, 104, 1)',
    'rgba(119, 224, 0, 1)',
    'rgba(63, 81, 181, 1)',
    'rgba(255, 212, 0, 1)',
    'rgba(255, 99, 43, 1)',
    'rgba(0, 177, 247, 1)',
    'rgba(0, 173, 34, 1)',
    'rgba(224, 145, 35, 1)',
    'rgba(0, 255, 93, 1)',
    'rgba(0, 144, 255, 1)',
    'rgba(237, 73, 33, 1)',
    'rgba(198, 59, 108, 1)',
    'rgba(42, 0, 255, 1)',
    'rgba(214, 42, 42, 1)',
    'rgba(220, 129, 5, 1)',
    'rgba(37, 137, 95, 1)',
    'rgba(0, 155, 193, 1)',
    'rgba(232, 195, 49, 1)',
    'rgba(43, 147, 191, 1)',
    'rgba(255, 99, 43, 1)',
    'rgba(0, 177, 247, 1)',
    'rgba(0, 173, 34, 1)',
    'rgba(160, 24, 24, 1)',

  ]
}

export const ratingPalette = (asObject: boolean): any | string[] => {
  const palette =  {
    'Excelente': '#166499',
    'Si': '#166499',
    'Bueno': '#00A4A3',
    'Muy Bueno': '#00A4A3',
    'Muy Buena': '#00A4A3',
    'Regular': '#F8AA19',
    'Deficiente': '#E54128',
    'Malo': '#E54128',
    'No': '#E54128'
  };

  const paletteArray = [
    '#166499',
    '#00A4A3',
    '#F8AA19',
    '#E54128',
    '#002f41'
  ];

  return asObject ? palette : paletteArray;
}
