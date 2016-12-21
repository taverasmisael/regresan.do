import {JWT} from './jwt';
import { User } from './user';
import { UserProfile } from './userprofile';

export interface AuthState {
  currentUser: {
    $id: string,
    Code: number,
    Success: boolean,
    Message: string,
    User: User,
    Profiles: UserProfile[]
  }
  token: JWT,
  error: string,
  loading: boolean
}
