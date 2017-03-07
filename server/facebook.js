const EventEmitter = require('events');
const graph = require('fbgraph');

exports.fetchExistingComments = (videoId, limit = 100, maxPages = 2, emitter = null) => {
  emitter = emitter || new EventEmitter();
  const PAGE_ID = '628490220508711';

  graph.get(`${PAGE_ID}/video_broadcasts`, { fields: ['id', 'status', 'video'].join(',')}, (err, res) => {
    if (err) {
      return emitter.emit('error', err);
    }

    const broadcast = res.data.filter(broadcast => broadcast.video.id === videoId).pop();

    if (!broadcast) {
      return emitter.emit('error', 'Could not find matching video');
    }

    graph.get(broadcast.id, { fields: [ 'id', 'live_views', `comments.limit(${limit}).order(reverse_chronological)`].join(',') }, (err, res) => {
      if (err) {
        return emitter.emit('error', err);
      }

      emitter.emit('viewers', res.live_views);

      emitter.emit('comments', res.comments.data);
      nextPage(emitter, res.comments.paging, maxPages-1);
    });
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
