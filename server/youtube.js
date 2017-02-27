const EventEmitter = require('events');
const google = require('googleapis');


const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2();

exports.fetchExistingComments = (videoId, limit = 50, maxPages = 2, emitter = null) => {
  emitter = emitter || new EventEmitter();

  // get broadcast list
  const youtube = google.youtube('v3');
  const list = youtube.liveBroadcasts.list({
    part: 'snippet',
    broadcastStatus: 'all',
    maxResults: limit,
  }, (err, result) => {
    if (err) {
      return console.error(err);
    }

    console.log(result.items);
    emitter.emit('comments', result.items);
  });

  return emitter;
};

exports.setAccessToken = (accessToken) => {
  oauth2Client.setCredentials(accessToken);
  google.options({
    auth: oauth2Client
  });
}

exports.subscribeLatestComments = (videoId, emitter) => {
  setInterval(this.fetchExistingComments.bind(this, videoId, 20, 1, emitter), 5000);
}

exports.fetchComments = (videoId) => {
  const emitter = this.fetchExistingComments(videoId);
  // this.subscribeLatestComments(videoId, emitter);

  return emitter;
}
