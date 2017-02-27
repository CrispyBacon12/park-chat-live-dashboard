import facebookConnector from '../services/facebook';

export const ADD_FACEBOOK_COMMENTS = 'ADD_FACEBOOK_COMMENTS';
export function addFacebookComments(comments) {
  return {
    type: ADD_FACEBOOK_COMMENTS,
    payload: comments
  };
}

export const ADD_YOUTUBE_COMMENTS = 'ADD_YOUTUBE_COMMENTS';
export function addYouTubeComments(comments) {
  return {
    type: ADD_YOUTUBE_COMMENTS,
    payload: comments
  };
}

export const APPROVE_COMMENT = 'APPROVE_COMMENT';
export function approveComment(comment) {
  return {
    type: APPROVE_COMMENT,
    payload: comment
  }
}

export const DISAPPROVE_COMMENT = 'DISAPPROVE_COMMENT';
export function disapproveComment(comment) {
  return {
    type: DISAPPROVE_COMMENT,
    payload: comment
  }
}

export function toggleCommentApproval(comment, approvedComments, cb) {
  const commentIsApproved = approvedComments.some(approvedComment => approvedComment.id === comment.id);

  cb(commentIsApproved);

  if (commentIsApproved) {
    return disapproveComment(comment);
  }

  return approveComment(comment);
}

export const SET_FACEBOOK_VIDEO_ID = 'SET_FACEBOOK_VIDEO_ID';
export function updateFacebookVideo(videoId, cb) {
  return {
    type: SET_FACEBOOK_VIDEO_ID,
    payload: videoId
  };
}

export const SET_YOUTUBE_VIDEO_ID = 'SET_YOUTUBE_VIDEO_ID';
export function updateYoutubeVideo(videoId, cb) {
  return {
    type: SET_YOUTUBE_VIDEO_ID,
    payload: videoId
  }
}
