import {JWT} from '../jwt';
import { User } from '../user';
import { UserProfile } from '../userprofile';

export class AuthState {
  currentUser: {
    $id: string,
    Code: number,
    Success: boolean,
    Message: string,
    User: User,
    Profiles: UserProfile[]
  };
  token: JWT;
  error: string;
  loading: boolean;

  constructor(cu?, token?, error?, loading?) {
    this.currentUser = cu || {};
    this.token = token || '';
    this.error = error || '';
    this.loading = loading || false;
  }
}
