import { AuthState } from '@models/states/auth'
import { BranchState } from '@models/states/branch'

export class AppState {
  public auth: AuthState
  public currentBranch: BranchState
}
