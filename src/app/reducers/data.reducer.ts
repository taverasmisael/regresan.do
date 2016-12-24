export function DataReducer() {
  return {
    '[DATA]: LOAD': (state, action) => {
      return [...state, action];
    }
  }
}
