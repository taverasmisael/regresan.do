import { UserProfile } from './userprofile';
import { Respuesta } from './respuesta';
import * as moment from 'moment';

export interface SucursalState {
  info: UserProfile,
  questions: any[],
  openQuestions: any[]
  answers: Respuesta[],
  filters: any[],
  dates: moment.Moment[],
  lastQuery: string,
  lastResult: SucursalState,
  currentAction: string,
  loading: boolean
};

