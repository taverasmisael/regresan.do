import { StandardRequest } from './standardRequest'
export class AnswerRequest extends StandardRequest {
  constructor(
    public start: string,
    public end: string,
    public profile: string,
    public question: string,
    public answer = '',
    public idQuestion = '0'
  ) {
    super(start, end, profile)
  }
}
