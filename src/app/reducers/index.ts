import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { createReducer } from '../utilities/reducers';
import { updateObject } from '../utilities/objects';
import { AppState } from '../models/appstate';
import { AuthReducer, INITIAL_STATE } from './auth.reducer';
import { DataReducer } from './data.reducer';

const authReducer = createReducer(INITIAL_STATE, AuthReducer());
const dataReducer = createReducer([], DataReducer());

const RootReducer = compose(
  localStorageSync(['auth'], true),
  combineReducers)({auth: authReducer, data: dataReducer});

export { RootReducer };
