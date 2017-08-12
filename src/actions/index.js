import facebookConnector from '../services/facebook';

export const ADD_COMMENTS = 'ADD_COMMENTS';
export function addComments(comments) {
  return {
    type: ADD_COMMENTS,
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

export const SET_FACEBOOK_PAGE_ID = 'SET_FACEBOOK_VIDEO_ID';
export function updateFacebookPage(pageId, cb) {
  return {
    type: SET_FACEBOOK_VIDEO_ID,
    payload: pageId
  };
}

export const SET_YOUTUBE_VIDEO_ID = 'SET_YOUTUBE_VIDEO_ID';
export function updateYoutubeVideo(videoId, cb) {
  return {
    type: SET_YOUTUBE_VIDEO_ID,
    payload: videoId
  }
}

export const SET_YOUTUBE_VIEWERS = 'SET_YOUTUBE_VIEWERS';
export function setYoutubeViewers(viewers) {
  return {
    type: SET_YOUTUBE_VIEWERS,
    payload: viewers
  }
}

export const SET_FACEBOOK_VIEWERS = 'SET_FACEBOOK_VIEWERS';
export function setFacebookViewers(viewers) {
  return {
    type: SET_FACEBOOK_VIEWERS,
    payload: viewers
  }
}

export const SET_FACEBOOK_START_TIME = 'SET_FACEBOOK_START_TIME';
export function setFacebookStartTime(startTime) {
  return {
    type: SET_FACEBOOK_START_TIME,
    payload: startTime
  }
}
