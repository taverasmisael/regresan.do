import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { createReducer } from '../utilities/reducers';
import { updateObject } from '../utilities/objects';
import { AppState } from '../models/appstate';
import { AuthReducer, INITIAL_STATE as StateAuth } from './auth.reducer';
import { SucursalesCases, INITIAL_STATE as StateSucursal } from './sucursal.reducer';

const authReducer = createReducer(StateAuth, AuthReducer());
const sucursalesReducer = createReducer(StateSucursal, SucursalesCases());

const RootReducer = compose(
  localStorageSync(['auth'], true),
  combineReducers)({auth: authReducer, currentSucursal: sucursalesReducer});

export { RootReducer };
