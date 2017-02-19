import { RequestError } from '@models/request-error';

export class StateRequest {
  error: RequestError;
  isLoading: boolean;
  text: string;

  constructor(error: RequestError, loading: boolean, text: string) {
    this.error = error;
    this.isLoading = loading;
    this.text = text;
  }
};
