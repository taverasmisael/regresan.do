import { DateFilter } from '@models/filter-date'

export default class QuestionFilter extends DateFilter {
  public question?: string;
  public answer?: string;
  public profile?: string;
}
