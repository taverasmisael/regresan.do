import { createReducer } from '../utilities/reducers';
import { updateObject } from '../utilities/objects';
import { AppState } from '../models/appstate';
import AuthReducer, { INITIAL_STATE } from './auth.reducer';

const initialState: AppState = {
  auth: INITIAL_STATE
}; // TODO ir agregando los demas estados en el mainstate

const reducers = updateObject({}, AuthReducer()); // TODO agregar los otros reducers que se creen

const RootReducer = createReducer(initialState, reducers);
export default RootReducer;
export { RootReducer };
