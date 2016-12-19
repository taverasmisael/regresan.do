import { createReducer } from '../utilities/reducers';
import { updateObject } from '../utilities/objects';
import { AuthState } from '../models/authstate';
import AuthReducer, { INITIAL_STATE } from './auth.reducer';

const initialState: AuthState = INITIAL_STATE; // TODO crear el verdadero estado de la app

const reducers = updateObject({}, AuthReducer); // TODO agregar los otros reducers que se creen

const RootReducer = createReducer(initialState, reducers);

export default RootReducer;
export { RootReducer };
