import { UserProfile } from '@models/userProfile'
import { Question } from '@models/question'
import { APIRequestUser } from '@models/apiparams'
import { KPI } from '@models/kpi'
import { Filter } from '@models/filter'
import { HistoricEntry } from '@models/historicEntry'
import { StaffRanking } from '@models/staffRanking'
import { OpenAnswer } from '@models/openAnswer'
import { CloseAnswer } from '@models/closeAnswer'
import { StateRequest } from '@models/states/stateRequest'
import { QuestionFilter } from '@models/questionFilter'

export class BranchState {
  public requests: {
    ACLOSE: StateRequest[]
    AOPEN: StateRequest[]
    QUESTIONS: StateRequest
    KPI: StateRequest
    STAFF: StateRequest
    HISTORIC: StateRequest
  }
  constructor(
    public info?: UserProfile,
    public openQuestions: Question[] = [],
    public closeQuestions: Question[] = [],
    public openAnswers: OpenAnswer[] = [],
    public closeAnswers: CloseAnswer[][] = [],
    public kpis: KPI[] = [],
    public historicData: HistoricEntry[] = [],
    public staffRanking: StaffRanking[] = [],
    public filters?: Filter,
    public currentQuery: QuestionFilter | APIRequestUser = {start: '', end: '', profile: ''}
  ) {
    this.requests = {
      ACLOSE: [],
      AOPEN: [],
      QUESTIONS: new StateRequest(undefined, false, ''),
      KPI: new StateRequest(undefined, false, ''),
      STAFF: new StateRequest(undefined, false, ''),
      HISTORIC: new StateRequest(undefined, false, '')
    }
  }
}
