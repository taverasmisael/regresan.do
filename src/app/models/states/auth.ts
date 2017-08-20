import { JWT } from '@models/jwt'
import { User } from '@models/user'
import { UserProfile } from '@models/userProfile'
import { CurrentUser } from '@models/currentUser'
export class AuthState {
  constructor(
    public currentUser?: CurrentUser,
    public token?: JWT,
    public error?: string,
    public loading?: boolean
  ) {}
}
