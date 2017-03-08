import { SET_YOUTUBE_VIEWERS, SET_FACEBOOK_VIEWERS } from '../actions';

export function ViewersReducer(state = {youtube: 0, facebook: 0}, action) {
  switch(action.type) {
    case SET_YOUTUBE_VIEWERS: return setYoutubeViewers(state, action)
    case SET_FACEBOOK_VIEWERS: return setFacebookViewers(state, action)
  }

  return state;
}

function setFacebookViewers(state, action) {
  return {
    youtube: state.youtube,
    facebook: Number(action.payload)
  };
}

function setYoutubeViewers(state, action) {
  return {
    youtube: Number(action.payload),
    facebook: state.facebook
  };
}
