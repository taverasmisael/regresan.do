import { GaugeSegment, GaugeLabel } from 'ng2-kw-gauge';

export class GaugeOptions {
  rounded = true; // whether linecap should be rounded
  reverse = false; // segments are sorted by value. whether drawing order should be sorted
  animationSecs = 0.5; // animation of lines when changing values
  bgRadius = 80; // radius of background circle
  bgColor = '#00a4a3'; // color of background circle
  labels: GaugeLabel[]; // labels to be displayed
  segments: GaugeSegment[] // info to be displayed

  constructor(options: GaugeOptions) {
    this.rounded = options.rounded;
    this.reverse = options.reverse;
    this.animationSecs = options.animationSecs;
    this.bgRadius = options.bgRadius;
    this.bgColor = options.bgColor;
    this.labels = options.labels;
    this.segments = options.segments;
  }
}
