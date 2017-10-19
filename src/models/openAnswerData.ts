import { OpenAnswerDataEntry } from '@models/openAnswerDataEntry'

export class OpenAnswerData {
  constructor(public id: string, public answers: OpenAnswerDataEntry[]) {}
}
