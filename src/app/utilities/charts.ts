import * as tinycolor from 'tinycolor2';

export const createPalette = (colors: string[]): ChartJsColor[] => {
  const white = tinycolor('white');

  return colors.reduce((prev, curr) => {
    const currentColor = tinycolor(curr);
    const currentHover = currentColor.lighten();

    const newColor: ChartJsColor = {
      backgroundColor: tinycolor(curr).setAlpha(0.4).toString(),
      borderColor: currentColor.toString(),
      pointBorderColor: white.toString(),
      pointBackgroundColor: currentColor.toString(),
      pointHoverBackgroundColor: white.toString(),
      pointHoverBorderColor: currentColor.toString(),
    }

    return [...prev, newColor];
  }, []);
}

export interface ChartJsColor {
  backgroundColor: string,
  borderColor: string,
  pointBackgroundColor: string,
  pointBorderColor: string,
  pointHoverBackgroundColor: string,
  pointHoverBorderColor: string,
}
