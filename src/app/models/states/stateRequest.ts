import { RequestError } from '@models/request-error'

export class StateRequest {
  constructor(
    public error?: RequestError,
    public isLoading?: boolean,
    public text?: string,
    public id?: string
  ) {}
}
