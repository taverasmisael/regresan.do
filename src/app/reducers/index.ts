import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { createReducer } from '../utilities/reducers';
import { updateObject } from '../utilities/objects';
import { AppState } from '../models/states/appstate';
import { AuthReducer, INITIAL_STATE as StateAuth } from './auth.reducer';
import { BranchCases, INITIAL_STATE as BranchState } from './branch.reducer';

const authReducer = createReducer(StateAuth, AuthReducer());
const branchReducer = createReducer(BranchState, BranchCases());

const RootReducer = compose(
  localStorageSync({
    keys: ['auth'],
    rehydrate: true
  }),
  combineReducers)({auth: authReducer, currentBranch: branchReducer});

export { RootReducer };
