import { GaugeSegment, GaugeLabel } from 'ng2-kw-gauge';
import * as tinycolor from 'tinycolor2';

import { updateObject } from './objects';
import { GaugeOptions } from '../models/gauge-options'

const basicOptions = {
  bgRadius: 75,
  bgColor: 'transparent',
  rounded: true,
  reverse: false,
  animationSecs: 1,
  labels: [],
  segments: []
}

const whiteColor = '#FFF';

export const createGauge = (data: DataGauge, options = {}): GaugeOptions => {
  const localOptions: GaugeOptions = updateObject(basicOptions, options);
  localOptions.bgColor = whiteColor;
  localOptions.labels = [
    new GaugeLabel({
      color: tinycolor(data.color).toHexString(),
      text: data.text,
      x: 0,
      y: 20,
      fontSize: '1em'
    }),
    new GaugeLabel({
      color: tinycolor(data.color).toHexString(),
      text: data.value + '%',
      x: 0,
      y: 0
    })
  ];

  localOptions.segments = [
    new GaugeSegment({
      value: data.value,
      color: tinycolor(data.color).toHexString(),
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
