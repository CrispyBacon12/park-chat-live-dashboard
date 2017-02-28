const EventEmitter = require('events');
const graph = require('fbgraph');

exports.fetchExistingComments = (videoId, limit = 100, maxPages = 2, emitter = null) => {
  emitter = emitter || new EventEmitter();

  graph.get(videoId, { fields: ['id', `comments.limit(${limit}).order(reverse_chronological)`, 'live_views'].join(',') }, (err, res) => {
    if (err) {
      return emitter.emit('error', err);
    }

    console.log("fetched", res);

    emitter.emit('comments', res.comments.data);
    emitter.emit('viewers', res.live_views);
    nextPage(emitter, res.comments.paging, maxPages-1);
  });

  return emitter;
}

function nextPage(emitter, paging, numRecursions) {
  // was this the last page?
  if (!paging.next || numRecursions <= 0) {
    return;
  }

  // otherwise get the next page and emit it on success
  graph.get(paging.next, (err, res) => {
    if (err) {
      return emitter.emit('error', err);
    }

    emitter.emit('comments', res.data);
    nextPage(emitter, res.paging, --numRecursions);
  });
}

exports.setAccessToken = (accessToken) => {
  graph.setAccessToken(accessToken);
}

exports.subscribeLatestComments = (videoId, emitter) => {
  return setInterval(this.fetchExistingComments.bind(this, videoId, 20, 1, emitter), 2000);
}

exports.stopEmitter = (emitter) => {
  emitter._stop();
}

exports.fetchComments = (videoId) => {
  console.log('fetching comments', videoId);
  const emitter = this.fetchExistingComments(videoId);
  const timerId = this.subscribeLatestComments(videoId, emitter);
  
  emitter._stop = function() {
    clearInterval(timerId);
  }

  return emitter;
}
