import { SET_FACEBOOK_VIDEO_ID } from '../actions';

export function VideoConnectionsReducer(state = {facebook: '', youtube: ''}, action) {
  switch(action.type) {
    case SET_FACEBOOK_VIDEO_ID: return setFacebookVideoId(state, action)
  }

  return state;
}

function setFacebookVideoId(state, action) {
  return Object.assign({}, state, {
    facebook: action.payload
  });
}
