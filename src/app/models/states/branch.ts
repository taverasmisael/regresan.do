import { UserProfile } from '@models/userProfile'
import { Question } from '@models/question'
import { StandardRequest } from '@models/standardRequest'
import { KPI } from '@models/kpi'
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
    public filterQuestions: { open: Question[]; close: Question[] } = { open: [], close: [] },
    public historicData: HistoricEntry[] = [],
    public staffRanking: StaffRanking[] = [],
    public currentQuery: QuestionFilter | StandardRequest = new StandardRequest('', '', '')
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
