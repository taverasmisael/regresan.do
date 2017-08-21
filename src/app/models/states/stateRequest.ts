import { RequestError } from '@models/requestError'

export class StateRequest {
  constructor(
    public error?: RequestError,
    public isLoading?: boolean,
    public text?: string,
    public id?: string
  ) {}
}
