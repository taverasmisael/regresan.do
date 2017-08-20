import { Action } from '@ngrx/store'
import { RequestError } from '@models/requestError'

export class EnhancedAction implements Action {
  constructor(
    public type: string,
    public section?: string,
    public message?: string,
    public payload?: any,
    error?: RequestError
  ) {}
}
