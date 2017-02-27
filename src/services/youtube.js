import io from 'socket.io-client';
import * as events from '../../server/events';
import { getUrl, clientId } from './youtube-embed';
import { STORAGE_KEY } from '../components/google-callback';

export const YOUTUBE_COMMENT_TYPE = 'YOUTUBE';

class YouTube {
  constructor() {
    this.socket = io();
    this.accessToken = null;
  }

  login() {
    return new Promise((resolve, reject) => {
      const url = getUrl({
        clientId,
        scope: [
          'profile',
          'https://www.googleapis.com/auth/youtube'
        ].join(' '),
        redirectUrl: 'http://localhost:8080/gcallback'
      });

      const child = window.open(url, '', 'width=800, height=600');
      window.addEventListener('storage', e => {
        if (e.key === STORAGE_KEY) {
          child.close();
          return resolve(JSON.parse(e.newValue));
        }
      });
    });
  }

  setGoogleToken(token) {
    console.log("Received token!", token);
    this.accessToken = token;
  }

  updateSigninStatus(cb, isSignedIn) {
    console.log("Signed in?", isSignedIn, cb);
    if (isSignedIn) {
      // great, already logged in!
      return cb();
    }

    if (this.loginAttempts >= 1) {
      // we've been here before :(
        return cb('Not signed in');
    }

    // not logged in, try to do that now
    
    this.loginAttempts++;
  }

  connectToStream(videoId, cb) {
    this.login().then(accessToken => {
      this.clearCommentsHandler();

      this.socket.emit(events.CONNECT_TO_YOUTUBE, { videoId, accessToken });
      this.setCommentsHandler(cb);
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

  transformComment(comment) {
    return {
      id: comment.id,
      from: {
        name: comment.authorDetails.displayName
      },
      created_time: comment.snippet.publishedAt,
      message: comment.snippet.displayMessage,
      type: YOUTUBE_COMMENT_TYPE
    };
  }
}

export default function() {
  return new YouTube();
}
