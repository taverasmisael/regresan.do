import { UserProfile } from './userprofile';
import { Pregunta } from './pregunta';
import * as moment from 'moment';

export interface SucursalState {
  info: UserProfile,
  closeQuestions: any[],
  openQuestions: any[],
  openAnswers: any[],
  closeAnswers: Pregunta[],
  filters: any[],
  dates: moment.Moment[],
  lastQuery: string,
  lastResult: SucursalState,
  currentAction: string,
  loading: boolean
};

