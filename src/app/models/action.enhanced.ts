import { Action } from '@ngrx/store';
import { RequestError } from '@models/request-error';

export interface ActionEnhanced extends Action {
  section: string,
  message?: string,
  error?: RequestError
};
