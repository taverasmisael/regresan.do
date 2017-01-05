import * as tinycolor from 'tinycolor2';

export const createPalette = (colors: string[], alpha = 1): ChartJsColor[] => {
  const white = tinycolor('white');

  return colors.reduce((prev, curr) => {
    const currentColor = tinycolor(curr);
    const currentHover = currentColor.lighten();

    const newColor: ChartJsColor = {
      backgroundColor: tinycolor(curr).setAlpha(alpha).toString(),
      borderColor: currentColor.toString(),
      pointBorderColor: white.toString(),
      pointBackgroundColor: currentColor.toString(),
      pointHoverBackgroundColor: white.toString(),
      pointHoverBorderColor: currentColor.toString(),
    }

    return [...prev, newColor];
  }, []);
}

export const createCirularPalette = (colors: ChartJsColor[]) => {
  return colors.reduce((prev, curr) => {
    prev[0] = prev[0] || {backgroundColor: []};
    let backgrounds = prev[0]['backgroundColor'];
    prev[1] = prev[1] || {borderColor: []};
    let borders = prev[1]['borderColor'];

    prev[0]['backgroundColor'] = [...backgrounds, curr.backgroundColor];
    prev[1]['borderColor'] = [...borders, curr.borderColor];

    return prev;
  }, [])
}
export interface ChartJsColor {
  backgroundColor: string,
  borderColor: string,
  pointBackgroundColor: string,
  pointBorderColor: string,
  pointHoverBackgroundColor: string,
  pointHoverBorderColor: string,
}
