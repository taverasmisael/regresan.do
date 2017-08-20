import { GaugeSegment, GaugeLabel } from 'ng2-kw-gauge'

export class GaugeOptions {
  constructor(
    public rounded = true,
    public reverse = false,
    public animationSecs = 0.5,
    public bgRadius = 80,
    public bgColor = '#00a4a3',
    public labels: GaugeLabel[],
    public segments: GaugeSegment[]
  ) {}
}
