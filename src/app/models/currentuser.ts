import { User as user } from '@models/user'
import { UserProfile } from '@models/userprofile'
export class CurrentUser {
  constructor(
    public $id: string,
    public Code: number,
    public Success: boolean,
    public Message: string,
    public User: user,
    public Profiles: UserProfile[]
  ) {}
}
