import { RequestError } from '@models/request-error';

export class StateRequest {
  error: RequestError;
  id?: string;
  isLoading: boolean;
  text: string;

  constructor(error: RequestError, loading: boolean, text: string, id?: string) {
    this.error = error;
    this.isLoading = loading;
    this.text = text;
    this.id = id;
  }
};
