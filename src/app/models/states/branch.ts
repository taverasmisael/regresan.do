import { UserProfile } from '@models/userprofile';
import { Pregunta } from '@models/pregunta';
import { KPI } from '@models/kpi';
import { Filter } from '@models/filter';
import { HistoricEntry } from '@models/historic-entry';
import { StaffRanking } from '@models/staff-ranking';
import { OpenAnswer } from '@models/answer.open';
import { CloseAnswer } from '@models/answer.close';
import { StateRequest } from '@models/states/state-request';
import { APIRequestUser } from '@models/apiparams';

import * as moment from 'moment';

export class BranchState {
  info: UserProfile
  openQuestions: Pregunta[]
  closeQuestions: Pregunta[]
  openAnswers: OpenAnswer[]
  closeAnswers: CloseAnswer[]
  kpis: KPI[]
  historicData: HistoricEntry[]
  staffRanking: StaffRanking[]
  requests: {
    ACLOSE: StateRequest[],
    AOPEN: StateRequest[],
    QUESTIONS: StateRequest,
    KPI: StateRequest,
    STAFF: StateRequest,
    HISTORIC: StateRequest
  }
  filters: Filter;
  currentQuery: APIRequestUser

  constructor(info?, cq?, oq?, ca?, oa?, filters?, loading?) {
    this.info = info || new UserProfile();
    this.closeQuestions = cq || [];
    this.openQuestions = oq || [];
    this.closeAnswers = ca || [];
    this.openAnswers = oa || [];
    this.filters = filters || [];
    this.historicData = [];
    this.staffRanking = [];
    this.kpis = [];
    this.requests = {
      ACLOSE: [],
      AOPEN: [],
      QUESTIONS: new StateRequest(undefined, false, ''),
      KPI: new StateRequest(undefined, false, ''),
      STAFF: new StateRequest(undefined, false, ''),
      HISTORIC: new StateRequest(undefined, false, '')
    }
  }
};
