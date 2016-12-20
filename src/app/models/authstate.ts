import {JWT} from './jwt';

export interface AuthState {
  currentUser: {
    fullName: String,
    usuername: String,
    role: number,
    UID: string,
    image: string,
    message: string,
    lastLogon: string
  }
  token: JWT,
  error: string,
  loading: boolean
}
