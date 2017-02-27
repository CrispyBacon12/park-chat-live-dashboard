const EventEmitter = require('events');
const google = require('googleapis');

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2();

exports.subscribeLatestComments = (videoId, limit = 50, nextPageToken = null, emitter = null) => {
  emitter = emitter || new EventEmitter();

  const youtube = google.youtube('v3');
  
  new Promise((resolve, reject) => {
    youtube.videos.list({
      part: 'liveStreamingDetails',
      id: videoId
    }, (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result.items);
    });
  })
  .then(items => items[0])
  .then(item => item.liveStreamingDetails)
  .then(liveStreamingDetails => {
    emitter.emit('viewers', liveStreamingDetails.concurrentViewers);
    return liveStreamingDetails.activeLiveChatId;
  })
  .then(activeLiveChatId => {
    return new Promise((resolve, reject) => {
      youtube.liveChatMessages.list({
        part: 'id,snippet,authorDetails',
        liveChatId: activeLiveChatId,
        nextPageToken
      }, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  })
  .then(liveChatMessages => {
    emitter.emit('comments', liveChatMessages.items);
    return setTimeout(() => {
      this.subscribeLatestComments(videoId, limit, liveChatMessages.nextPageToken, emitter);
    }, liveChatMessages.pollingIntervalMillis);
  });

  return emitter;
};

exports.setAccessToken = (accessToken) => {
  oauth2Client.setCredentials(accessToken);
  google.options({
    auth: oauth2Client
  });
}


exports.fetchComments = (videoId) => {
  // const emitter = this.fetchExistingComments(videoId);
  const emitter = this.subscribeLatestComments(videoId);

  return emitter;
}
