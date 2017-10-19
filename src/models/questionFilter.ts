import { BasicRequest } from '@models/basicRequest'

export class QuestionFilter extends BasicRequest {
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
