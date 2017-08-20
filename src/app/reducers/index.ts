import { compose } from '@ngrx/core/compose'
import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store'
import { localStorageSync } from 'ngrx-store-localstorage'

import { createReducer } from '@utilities/reducers'
import { updateObject } from '@utilities/objects'
import { AppState } from '@models/states/app'
import { AuthReducer, INITIAL_STATE as AuthState } from './auth.reducer'
import { BranchCases, INITIAL_STATE as BranchState } from './branch.reducer'

const authReducer = createReducer(AuthState, AuthReducer())
const branchReducer = createReducer(BranchState, BranchCases())

export const Reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  currentBranch: branchReducer
}
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['auth'],
    rehydrate: true,
    storageKeySerializer(k) {
      return `Regresan.do__${k}`
    }
  })(reducer)
}
export const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer]
