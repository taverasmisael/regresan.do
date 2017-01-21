import { GaugeSegment, GaugeLabel } from 'ng2-kw-gauge';
import * as tinycolor from 'tinycolor2';

import { updateObject } from './objects';
import { GaugeOptions } from '../models/gauge-options'

const basicOptions = {
  bgRadius: 65,
  bgColor: 'transparent',
  rounded: false,
  reverse: false,
  animationSecs: 1,
  labels: [],
  segments: []
}

const whiteColor = '#FFF';

export const createGauge = (data: DataGauge, options = {}): GaugeOptions => {
  const localOptions: GaugeOptions = updateObject(basicOptions, options);

  const currentColor = tinycolor(data.color);
  const textColor = currentColor.clone().darken(15);

  localOptions.bgColor = 'transparent';

  localOptions.labels = [
    new GaugeLabel({
      color: textColor.toString(),
      text: data.text,
      x: 0,
      y: 30,
      fontSize: '1em'
    }),
    new GaugeLabel({
      color: textColor.toString(),
      text: data.value + '%',
      x: 0,
      y: 0,
      fontSize: '1.5em'
    })
  ];

  localOptions.segments = [
    new GaugeSegment({
      value: data.value,
      color: currentColor.toString(),
      borderWidth: 20,
      rounded: true
    }),
    new GaugeSegment({
      value: 100,
      color: currentColor.clone().setAlpha(0.38).toString(),
      borderWidth: 20
    })
  ]

  return new GaugeOptions(localOptions);
}

export interface DataGauge {
  value: number,
  text: string,
  color: string
}
