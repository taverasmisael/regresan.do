export class UserProfile {
  constructor(
    public $id: string,
    public Id: number,
    public Title: string,
    public OldProfileId: number,
    public NewUserId: number
  ) {}
}
