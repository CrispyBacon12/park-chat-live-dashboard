import { SET_LIVE_VIDEOS } from '../actions';

export function LiveVideosReducer(state = [], action) {
  switch(action.type) {
    case SET_LIVE_VIDEOS: return setLiveVideos(state, action)
  }

  return state;
}

function setLiveVideos(state, action) {
  return action.payload;
}
