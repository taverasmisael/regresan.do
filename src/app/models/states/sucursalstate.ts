import { UserProfile } from '../userprofile';
import { Pregunta } from '../pregunta';
import { RespuestaAbierta } from '../respuesta-abierta';
import * as moment from 'moment';

export class SucursalState {
  info: UserProfile;
  closeQuestions: Pregunta[];
  openQuestions: Pregunta[];
  openAnswers: RespuestaAbierta[];
  closeAnswers: Pregunta[];
  filters: any[];
  dates: moment.Moment[];
  lastQuery: string;
  lastResult: SucursalState;
  currentAction: string;
  loading: boolean;
};

