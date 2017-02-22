import React from 'react';
import facebook from '../services/facebook-embed';
import FacebookPlayer from 'react-facebook-player';
import uuid from 'uuid';

export default ({ videoId }) => {
  console.log('rendering with', videoId);

  if (!videoId) {
    return videoNotConnected();
  }

  return videoEmbed(videoId);
};

function videoNotConnected() {
  return (
    <div className="video-player mt-4 d-flex justify-content-center align-items-center embed-responsive embed-responsive-16by9">
      <p>The video is not yet connected.</p>
    </div>
  );
}

function videoEmbed(videoId) {
  return (
    <div className="video-player mt-4 embed-responsive embed-responsive-16by9">
      <FacebookPlayer
        appId="673351099519084"
        id={uuid()}
        videoId={ videoId }
        className="embed-responsive-item"
        allowfullscreen="true"
        autoplay="true"
        width={1280}
        onReady={ noop }
        onStartedPlaying={ noop }
        onPaused={ noop }
        onFinishedPlaying={ noop }
        onStartedBuffering={ noop }
        onFinishedBuffering={ noop }
        onError={ noop }
        />
    </div>
  );
}

function noop() {}
