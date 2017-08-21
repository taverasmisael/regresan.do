import { APIRequestParams } from '@models/apiparams'

export class QuestionFilter extends APIRequestParams {
  constructor(
    public start: string,
    public end: string,
    public profile: string,
    public pegunta?: string,
    public answer?: string
  ) {
    super(start, end)
  }
}
