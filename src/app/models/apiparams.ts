export class APIRequestParams {
  constructor(public start: string, public end: string) {}
}

export class APIRequestUser extends APIRequestParams {
  constructor(public start: string, public end: string, public profile: string) {
    super(start, end)
  }
}

export class APIRequestRespuesta extends APIRequestUser {
  constructor(
    public start: string,
    public end: string,
    public profile: string,
    public pregunta: string
  ) {
    super(start, end, profile)
  }
}
