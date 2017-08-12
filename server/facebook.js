const EventEmitter = require('events');
const graph = require('fbgraph');
const PAGE_ID = '628490220508711';

exports.fetchExistingComments = (videoId, pageId = PAGE_ID, limit = 100, maxPages = 2, emitter = null) => {
  emitter = emitter || new EventEmitter();

  console.log('making graph request', `${pageId}/video_broadcasts`, { fields: ['id', 'status', 'video'].join(',') });
  graph.get(`${pageId}/video_broadcasts`, { fields: ['id', 'status', 'video'].join(',')}, (err, res) => {
    if (err) {
      return emitter.emit('error', err);
    }

    console.log(`searching for videoID ${videoId} amongst these IDs: ${res.data.map(broadcast => broadcast.video.id).join(' ')}`);

    const broadcast = res.data.filter(broadcast => broadcast.video.id === videoId).pop();

    console.log('found this broadcast', broadcast);

    if (!broadcast) {
      return emitter.emit('error', 'Could not find matching video');
    }

    graph.get(broadcast.id, { fields: [ 'id', 'live_views', 'status', 'planned_start_time', 'video{created_time}', `comments.limit(${limit}).order(reverse_chronological)`].join(',') }, (err, res) => {
      if (err) {
        return emitter.emit('error', err);
      }

      if (res.live_views) {
        emitter.emit('viewers', res.live_views);
      }
      
      const isScheduled = res.status === 'SCHEDULED_UNPUBLISHED' && res.planned_start_time
      if (isScheduled) {
        emitter.emit('startTime', res.planned_start_time);
      }
      
      if (!isScheduled && res.video && res.video.created_time) {
        emitter.emit('startTime', res.video.created_time);
      }

      if (res.comments && res.comments.data) {
        emitter.emit('comments', res.comments.data);
      }

      if (res.comments && res.comments.paging) {
        nextPage(emitter, res.comments.paging, maxPages-1);
      }
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
  console.log('access token set to', accessToken);
  graph.setAccessToken(accessToken);
}

exports.subscribeLatestComments = (videoId, pageId, emitter) => {
  return setInterval(this.fetchExistingComments.bind(this, videoId, pageId, 20, 1, emitter), 2000);
}

exports.stopEmitter = (emitter) => {
  emitter._stop();
}

exports.fetchComments = (videoId, pageId) => {
  console.log('fetching comments', videoId, pageId);
  const emitter = this.fetchExistingComments(videoId, pageId);
  const timerId = this.subscribeLatestComments(videoId, pageId, emitter);  

  emitter._stop = function() {
    clearInterval(timerId);
  }

  return emitter;
}
