const EventEmitter = require('events');
const graph = require('fbgraph');
const PAGE_ID = '628490220508711';

graph.setVersion('2.11');

exports.fetchLiveVideos = (pageId = PAGE_ID, emitter) => {
  graph.get(`${pageId}/live_videos`, { fields: [
    'description',
    'id',
    'status',
    'title',
    'planned_start_time',
    'dash_preview_url',
    'creation_time',
    'from',
    'permalink_url',
    'stream_url',
    'video{description,picture}'
  ].join(',') }, (err, res) => {
    if (err) {
      return emitter.emit('error', err);
    }

    return emitter.emit('videosList', res);
  });

  return emitter;
}

exports.fetchExistingComments = (videoId, pageId = PAGE_ID, limit = 100, maxPages = 2, emitter = null) => {
  emitter = emitter || new EventEmitter();  

  graph.get(`${pageId}`, { fields: 'access_token'}, (err, res) => {
    if (err) {
      console.error(':(');
      return emitter.emit('error', err);
    }

      console.log('making graph request', `/${videoId}`, { fields: ['id', 'live_views', 'status', 'planned_start_time', 'video{created_time}', `comments.limit(${limit}).order(reverse_chronological)`].join(',') });
      graph.get(videoId, { fields: [ 'id', 'live_views', 'status', 'planned_start_time', 'video{created_time}', `comments.limit(${limit}).order(reverse_chronological)`].join(',') }, (err, res) => {
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

        if (res.video) {
          emitter.emit('updateVideoId', res.video.id);
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

exports.setAccessToken = (accessToken, pageId) => {
  console.log(`Using user access token ${accessToken} to fetch a page access token`);

  return new Promise((resolve, reject) => {
    graph.setAccessToken(accessToken);
    graph.get(`${pageId}`, { fields: 'access_token'}, (err, res) => {
      if (err) {
        return reject(err);
      }

      const pageAccessToken = res['access_token'];

      console.log(`Successfully received a page access token: ${pageAccessToken}`);
      graph.setAccessToken(pageAccessToken);

      return resolve(pageAccessToken);
    });
  });
}

exports.subscribeLatestComments = (videoId, pageId, emitter) => {
  return setInterval(this.fetchExistingComments.bind(this, videoId, pageId, 20, 1, emitter), 2000);
}

exports.stopEmitter = (emitter) => {
  if (emitter._stop) {
    emitter._stop();
  }
}

exports.fetchComments = (videoId, pageId, emitter) => {
  console.log('fetching comments', videoId, pageId);
  this.fetchExistingComments(videoId, pageId, null, null, emitter);
  const timerId = this.subscribeLatestComments(videoId, pageId, emitter);  

  emitter._stop = function() {
    clearInterval(timerId);
  }

  return emitter;
}
