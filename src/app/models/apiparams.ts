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
    public question: string
  ) {
    super(start, end, profile)
  }
}

export class APIRequestQA extends APIRequestRespuesta {
  constructor(
    public start: string,
    public end: string,
    public profile: string,
    public question: string,
    public answer: string
  ) {
    super(start, end, profile, question)
  }
}
