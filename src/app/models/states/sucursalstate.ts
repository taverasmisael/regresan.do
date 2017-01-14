import { UserProfile } from '../userprofile';
import { Pregunta } from '../pregunta';
import { RespuestaAbierta } from '../respuesta-abierta';
import * as moment from 'moment';

export class SucursalState {
  info: UserProfile;
  closeQuestions: Pregunta[];
  openQuestions: Pregunta[];
  openAnswers: RespuestaAbierta[];
  answerCharts: {[key: string]: any[][]};
  closeAnswers: Pregunta[];
  historicoEncuestas: {
    errorText?: string,
    labels: string[],
    data: any[],
    colors: string[],
    loading: boolean
  }
  filters: any[];
  dates: moment.Moment[];
  lastQuery: string;
  lastResult: SucursalState;
  currentAction: string;
  loading: boolean;

  constructor(info?, cq?, oq?, ca?, oa?, filters?, loading?) {
    this.info = info || new UserProfile();
    this.closeQuestions = cq || [];
    this.openQuestions = oq || [];
    this.closeAnswers = ca || [];
    this.openAnswers = oa || [];
    this.filters = filters || [];
    this.loading = loading || false;
    this.answerCharts = {};
    this.historicoEncuestas = {
      errorText: '',
      labels: [],
      data: [],
      colors: [],
      loading: false
    };
  }
};

