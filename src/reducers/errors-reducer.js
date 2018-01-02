import { SET_ERROR } from '../actions';

export function ErrorsReducer(state = [], action) {
  switch(action.type) {
    case SET_ERROR: return addError(state, action)
  }

  return state;
}

function addError(state, action) {
  return [...state, action.payload];
}
