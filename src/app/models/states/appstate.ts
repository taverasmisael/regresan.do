import { AuthState } from './authstate';
import { SucursalState } from './sucursalstate';

export class AppState {
  auth: AuthState;
  currentSucursal: SucursalState;
};
