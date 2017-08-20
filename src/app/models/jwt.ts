export class JWT {
  public '.issued': Date
  public '.expires': Date
  constructor(
    public access_token: string,
    public token_type: string,
    public expires_in: number,
    userName: string
  ) {}
}
