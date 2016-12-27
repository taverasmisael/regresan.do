import { UserProfile } from './userprofile';
import { Pregunta } from './pregunta';
import * as moment from 'moment';

export interface SucursalState {
  info: UserProfile,
  questions: any[],
  openQuestions: any[]
  answers: Pregunta[],
  filters: any[],
  dates: moment.Moment[],
  lastQuery: string,
  lastResult: SucursalState,
  currentAction: string,
  loading: boolean
};

