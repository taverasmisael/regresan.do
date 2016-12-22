export function DataReducer() {
  return {
    '[DATA]: LOAD': (state, action) => {
      console.log('Adding data to the state ', state);
      return [...state, action];
    }
  }
}
