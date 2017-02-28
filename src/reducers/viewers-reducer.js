import { SET_YOUTUBE_VIEWERS } from '../actions';

export function ViewersReducer(state = {youtube: 0, facebook: 0}, action) {
  switch(action.type) {
    case SET_YOUTUBE_VIEWERS: return setYoutubeViewers(state, action)
  }

  return state;
}

function setYoutubeViewers(state, action) {
  return {
    youtube: action.payload,
    facebook: state.facebook
  };
}
