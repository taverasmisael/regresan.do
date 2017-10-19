import { EnhancedAction } from '@models/enhancedAction'
export function createReducer<S, A extends EnhancedAction>(
  initialState: S,
  handlers: { [key: string]: (state: S, action: A) => S }
) {
  return function reducer(state = initialState, action: A): S {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}
