import { APIRequestParams } from '@models/apiparams'

export class QuestionFilter extends APIRequestParams {
  constructor(
    public start: string,
    public end: string,
    public profile: string,
    public pregunta ?: string,
    public answer?: string
  ) {
    super(start, end)
  }
}
