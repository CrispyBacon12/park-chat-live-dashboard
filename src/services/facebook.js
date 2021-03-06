import io from 'socket.io-client';
import * as events from '../../server/events';
import facebook from './facebook-embed';

export const FACEBOOK_COMMENT_TYPE = 'FACEBOOK';

class Facebook {
  constructor() {
    this.socket = io();
  }

  logout() {
    return new Promise((resolve, reject) => {
      facebook.then(fb => {
        fb.logout(response => {
          console.log('logged out');
          return resolve(response);
        });
      });
    })
  }

  login() {
    return new Promise((resolve, reject) => {
      facebook.then(fb => {
        fb.getLoginStatus(response => {
          // already logged in, great!
          if (response.status === 'connected') {
            console.log('already logged in with access token', response.authResponse.accessToken);
            return resolve(response.authResponse.accessToken);
          }

          // not logged in to either facebook or app (or both)
          fb.login(response => {
            if (response.status === 'connected') {
              console.log('logged in with access token', response.authResponse.accessToken);
              return resolve(response.authResponse.accessToken);
            }

            // after trying to log in, the user declined or the app was found to be blocked
            return reject(response);
          });
        })
      });
    });    
  }

  connectToStream(videoId, pageId, cb) {
    this.login().then(accessToken => {
      this.clearCommentsHandler();
      console.log("sending socket", events.CONNECT_TO_STREAM);

      this.socket.emit(events.CONNECT_TO_STREAM, {videoId, accessToken, pageId});
      this.setCommentsHandler(cb);
    });
  }

  fetchLiveVideos(pageId, cb) {
    this.login().then(accessToken => {
      this.clearLiveVideosHandler();
      console.log('requesting live videos', events.REQUEST_VIDEOS_LIST);

      this.socket.emit(events.REQUEST_VIDEOS_LIST, {accessToken, pageId});
      this.setLiveVideosHandler(cb);
    });
  }

  clearCommentsHandler() {
    if (this.commentsHandler) {
      this.socket.removeListener(events.SEND_COMMENTS, this.commentsHandler);
    }
  }

  setCommentsHandler(cb) {
    this.commentsHandler = cb;
    this.socket.on(events.SEND_COMMENTS, cb);
  }

  clearLiveVideosHandler() {
    if (this.liveVideosHandler) {
      this.socket.removeListener(events.SEND_VIDEOS_LIST, this.liveVideosHandler);
    }
  }

  setLiveVideosHandler(cb) {
    this.liveVideosHandler = cb;
    this.socket.on(events.SEND_VIDEOS_LIST, cb);
  }

  broadcastApproveComment(comment) {
    console.log("Approving comment on socket", this.socket);
    this.socket.emit(events.APPROVE_COMMENT, comment);
  }

  broadcastDisapproveComment(comment) {
    console.log('Disapproving comment on socket', this.socket);
    this.socket.emit(events.DISAPPROVE_COMMENT, comment);
  }

  subscribeApprovals(cb) {
    this.socket.on(events.APPROVE_COMMENT, cb);
  }

  subscribeDisapproves(cb) {
    this.socket.on(events.DISAPPROVE_COMMENT, cb);
  }

  subscribeVideoConnection(cb) {
    this.socket.on(events.FACEBOOK_VIDEO_CONNECTION, cb);
  }

  subscribeViewers(cb) {
    this.socket.on(events.UPDATE_FACEBOOK_VIEWERS, cb);
  }

  subscribeStartTime(cb) {
    this.socket.on(events.FACEBOOK_VIDEO_START_TIME, cb);
  }

  subscribeErrors(cb) {
    this.socket.on(events.FACEBOOK_ERROR, (err) => {
      console.log('received a facebook error', err);
      cb(err);
    });
  }

  transformComment(comment) {
    return {
      id: comment.id,
      from: {
        name: comment.from.name
      },
      created_time: comment.created_time,
      message: comment.message,
      type: FACEBOOK_COMMENT_TYPE
    };
  }
}

export default function() {
  return new Facebook();
}
