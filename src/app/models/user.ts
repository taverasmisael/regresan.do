export class User {
  constructor(
    public $id: string,
    public Id: number,
    public UniqueID: string,
    public Username: string,
    public FullName: string,
    public Role: number,
    public Status: number,
    public LastLogon: string,
    public UserImage: string,
  ) {}
}
