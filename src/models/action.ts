import { Action as A } from '@ngrx/store'

export class Action implements A {
  constructor(public type: string, public payload?: any) {}
}
