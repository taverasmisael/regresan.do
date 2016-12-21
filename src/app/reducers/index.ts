import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { createReducer } from '../utilities/reducers';
import { updateObject } from '../utilities/objects';
import { AppState } from '../models/appstate';
import { AuthReducer, INITIAL_STATE } from './auth.reducer';

const initialState: AppState = {
  auth: INITIAL_STATE
}; // TODO ir agregando los demas estados en el mainstate

const reducers = updateObject({}, AuthReducer()); // TODO agregar los otros reducers que se creen
const authReducer = createReducer(initialState, reducers);
const RootReducer = compose(localStorageSync(['auth'], true))(authReducer);

export { RootReducer };
