export class IUserLoginCredentials {
  constructor(
    public username: any,
    public password: any,
    public grant_type?: string
  ) {}
}
