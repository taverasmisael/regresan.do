import { StandardRequest } from '@models/standardRequest'

export class OpenAnswerRequest extends StandardRequest {
  constructor(
    public start: string,
    public end: string,
    public profile: string,
    public question: string
  ) {
    super(start, end, profile)
  }
}
