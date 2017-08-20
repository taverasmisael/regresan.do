import { APIRequestRespuesta } from '@models/apiparams'

export default class QuestionFilter extends APIRequestRespuesta {
  constructor(
    public start: string,
    public end: string,
    public profile: string,
    public question: string,
    public answer: string
  ) {
    super(start, end, profile, question)
  }
}
