import { compose } from '@ngrx/core/compose'
import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store'
import { localStorageSync } from 'ngrx-store-localstorage'

import { createReducer } from '@utilities/reducers'
import { updateObject } from '@utilities/objects'
import { AppState } from '@models/states/app'
import { AuthReducer as auth } from './auth.reducer'
import { BranchReducer as currentBranch } from './branch.reducer'

export const Reducers: ActionReducerMap<AppState> = { auth, currentBranch }
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
