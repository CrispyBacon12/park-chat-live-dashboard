import { ADD_FACEBOOK_COMMENTS, ADD_YOUTUBE_COMMENTS } from '../actions';

export function CommentsReducer(state = [], action) {
  switch(action.type) {
    case ADD_FACEBOOK_COMMENTS: return addFacebookComments(state, action);
    case ADD_YOUTUBE_COMMENTS: return addYouTubeComments(state, action);
  }

  return state;
}

function addComments(state, action, sortFn) {
  // we want to merge with the existing state, excluding any comments that are being overriden
  // by this new payload, to avoid duplicates.
  const stateDifference = state.filter(comment => {
    return !action.payload.some(value => value.id === comment.id);
  });
  
  return [...stateDifference, ...action.payload].sort(sortFn);
}

function addFacebookComments(state, action) {
  return addComments(state, action, (a, b) => {
    return (a.created_time < b.created_time) ? 1 : (a.created_time > b.created_time) ? -1 : 0;
  });
}

function addYouTubeComments(state, action) {
  return addComments(state, action, (a, b) => {
    return (a.snippet.publishedAt < b.snippet.publishedAt) ? 1 : (a.snippet.publishedAt > b.snippet.publishedAt) ? -1 : 0;
  });
}
