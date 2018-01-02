const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const EventEmitter = require('events');

const events = require('./events');
const facebook = require('./facebook');
const youtube = require('./youtube');

app.use(express.static(path.resolve(__dirname, '../public')));
app.get('/*', (req,res) => {
  res.sendfile(path.join(__dirname, '../index.html'));
});

io.on('connection', (socket) => {  
  console.log('user connected');
  const facebookEmitter = new EventEmitter();

  facebookEmitter.on('error', (err) => {
    socket.emit(events.FACEBOOK_ERROR, err);
    facebook.stopEmitter(facebookEmitter);
    console.error(err);
  });

  socket.on(events.REQUEST_VIDEOS_LIST, ({accessToken, pageId}) => {
    console.log('request videos list');
    facebook.setAccessToken(accessToken, pageId)
    .then(() => {
      facebook.fetchLiveVideos(pageId, facebookEmitter);

      facebookEmitter.on('videosList', (videos) => {
        socket.emit(events.SEND_VIDEOS_LIST, videos);
      });
    })
    .catch(err => {
      socket.broadcast.emit(events.FACEBOOK_ERROR, err);
      console.error(err);
    });
  });

  socket.on(events.CONNECT_TO_STREAM, ({videoId, accessToken, pageId}) => {
    socket.broadcast.emit(events.FACEBOOK_VIDEO_CONNECTION, videoId, pageId);

    facebook.setAccessToken(accessToken, pageId)
    .then(() => {
      facebook.fetchComments(videoId, pageId, facebookEmitter);

      facebookEmitter.on('comments', (res) => {
        socket.emit(events.SEND_COMMENTS, res);
      });
  
      facebookEmitter.on('viewers', (viewers) => {
        socket.broadcast.emit(events.UPDATE_FACEBOOK_VIEWERS, viewers);
      });
  
      facebookEmitter.on('startTime', (startTime) => {
        socket.broadcast.emit(events.FACEBOOK_VIDEO_START_TIME, startTime);
      });
    })
    .catch(err => {
      socket.broadcast.emit(events.FACEBOOK_ERROR, err);
      console.error(err);
    });

    socket.on('disconnect', () => {
      console.log('facebook socket disconnected');
      facebook.stopEmitter(facebookEmitter);
    });
  });

  socket.on(events.CONNECT_TO_YOUTUBE, ({videoId, accessToken}) => {
    socket.broadcast.emit(events.YOUTUBE_VIDEO_CONNECTION, videoId);

    youtube.setAccessToken(accessToken);

    const youtubeEmitter = youtube.fetchComments(videoId);

    youtubeEmitter.on('comments', (res) => {
      socket.emit(events.SEND_COMMENTS, res);
    });

    youtubeEmitter.on('viewers', (viewers) => {
      socket.broadcast.emit(events.UPDATE_YOUTUBE_VIEWERS, viewers);
    });

    youtubeEmitter.on('error', (err) => {
      console.error(err);
    });

    socket.on('disconnect', () => {
      console.log('youtube socket disconnected');
      youtube.stopEmitter(youtubeEmitter);
    });
  });

  socket.on(events.APPROVE_COMMENT, (comment) => {
    socket.broadcast.emit(events.APPROVE_COMMENT, comment);
  });

  socket.on(events.DISAPPROVE_COMMENT, (comment) => {
    socket.broadcast.emit(events.DISAPPROVE_COMMENT, comment);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
