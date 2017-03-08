import { SET_FACEBOOK_START_TIME } from '../actions';

export function TimesReducer(state = {facebook: null}, action) {
  switch(action.type) {
    case SET_FACEBOOK_START_TIME: return setFacebookStartTime(state, action)
  }

  return state;
}

function setFacebookStartTime(state, action) {
  return {
    facebook: new Date(action.payload)
  };
}
