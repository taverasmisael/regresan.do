import { BasicRequest } from './basicRequest'

export class StandardRequest extends BasicRequest {
  constructor(public start: string, public end: string, public profile: string) {
    super(start, end)
  }
}
