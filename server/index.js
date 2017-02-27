const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const events = require('./events');
const facebook = require('./facebook');
const youtube = require('./youtube');

app.use(express.static(path.resolve(__dirname, '../public')));
app.get('/*', (req,res) => {
  res.sendfile(path.join(__dirname, '../index.html'));
});

io.on('connection', (socket) => {
  
  socket.on(events.CONNECT_TO_STREAM, ({videoId, accessToken}) => {
    socket.broadcast.emit(events.FACEBOOK_VIDEO_CONNECTION, videoId);

    facebook.setAccessToken(accessToken);
    
    const commentsEmitter = facebook.fetchComments(videoId);

    commentsEmitter.on('comments', (res) => {
      socket.emit(events.SEND_COMMENTS, res);
    });

    commentsEmitter.on('error', (err) => {
      console.error(err);
    });
  });

  socket.on(events.CONNECT_TO_YOUTUBE, ({videoId, accessToken}) => {
    socket.broadcast.emit(events.YOUTUBE_VIDEO_CONNECTION, videoId);

    youtube.setAccessToken(accessToken);

    const commentsEmitter = youtube.fetchComments(videoId);

    commentsEmitter.on('comments', (res) => {
      socket.emit(events.SEND_COMMENTS, res);
    });

    commentsEmitter.on('error', (err) => {
      console.error(err);
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on(events.APPROVE_COMMENT, (comment) => {
    socket.broadcast.emit(events.APPROVE_COMMENT, comment);
  });

  socket.on(events.DISAPPROVE_COMMENT, (comment) => {
    socket.broadcast.emit(events.DISAPPROVE_COMMENT, comment);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
