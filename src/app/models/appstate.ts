import { AuthState } from './authstate';

export interface AppState {
  auth: AuthState,
  data: any[]
};
