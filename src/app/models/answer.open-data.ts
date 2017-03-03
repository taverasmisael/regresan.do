import { OpenAnswerDataEntry } from '@models/answer.open-data-entry';

export class OpenAnswerData {
  constructor(public id: string, public answers: OpenAnswerDataEntry[]) { }
}
