import { AuthState } from './authstate';
import { SucursalState } from './sucursalstate';

export interface AppState {
  auth: AuthState,
  currentSucursal: SucursalState
};
