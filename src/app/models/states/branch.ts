import { UserProfile } from '@models/userprofile';
import { Pregunta } from '@models/pregunta';
import { KPI } from '@models/kpi';
import { Filter } from '@models/filter';
import { HistoricEntry } from '@models/historic-entry';
import { StaffRanking } from '@models/staff-ranking';
import { RespuestaAbierta } from '@models/respuesta-abierta';
import { StateRequest } from '@models/states/state-request';

import * as moment from 'moment';

export class BranchState {
  info: UserProfile
  openQuestions: Pregunta[]
  closeQuestions: Pregunta[]
  openAnswers: RespuestaAbierta[]
  closeAnswers: Pregunta[]
  kpis: KPI[]
  staffRanking: StaffRanking[]
  historic: HistoricEntry[]
  requests: {
    ACLOSE: StateRequest,
    AOPEN: StateRequest,
    QCLOSE: StateRequest,
    QOPEN: StateRequest,
    KPI: StateRequest,
    STAFF_RANKING: StateRequest,
    HISTORIC: StateRequest
  }
  answerCharts: {[key: string]: any[][]}
  filters: Filter;

  constructor(info?, cq?, oq?, ca?, oa?, filters?, loading?) {
    this.info = info || new UserProfile();
    this.closeQuestions = cq || [];
    this.openQuestions = oq || [];
    this.closeAnswers = ca || [];
    this.openAnswers = oa || [];
    this.filters = filters || [];
    this.answerCharts = {};
    this.historic = []
    this.staffRanking = [];
    this.kpis = [];
  }
};
