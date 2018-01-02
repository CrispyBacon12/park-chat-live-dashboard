import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
  setLiveVideos
} from '../actions';

export class VideoSelector extends Component {
  constructor(props) {
    super(props);

    this.selectVideo = this.selectVideo.bind(this);
  }

  render() {
    const videos = [...this.props.videos];

    return (
      <div className="row">
        { videos.filter(video => video.status !== 'UNPUBLISHED').slice(0, 5).map(video => getVideo(video, this.selectVideo)) }
      </div>
    );
  }

  selectVideo(video) {
    console.log('selected video', video);
  
    this.props.selectedVideo(video);
  }
}

function getVideo(video, selectVideo) {
  return (
    <div key={video.id} className="col-sm-3" onClick={(event) => selectVideo(video)}>
      { videoContent(video) }
    </div>
  )
}

function videoContent(video) {
  console.log(video);

  switch (video.status) {
    case 'SCHEDULED_UNPUBLISHED':
      return scheduledUnpublishedDescriptor(video);
    case 'VOD':
      return vodDescriptor(video);
    case 'LIVE':
    case 'SCHEDULED_LIVE':
      return scheduledLive(video);
    default:
      return defaultDescriptor(video);
  }
}

function scheduledUnpublishedDescriptor(video) {
  const title = video.title ? video.title : video.description;
  const body = video.title ? video.description : '';

  return (
    <div className="card">
      <img className="card-img-top" src={video.video.picture} alt={title} />
      <div className="card-block">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{video.status}</h6>
        <p className="card-text">Scheduled Start Time: {video.planned_start_time}</p>
        <p className="card-text">{body}</p>
      </div>
    </div>
  );
}

function vodDescriptor(video) {
  const title = video.title ? video.title : video.description;
  const body = video.title ? video.description : '';

  return (
    <div className="card">
      <img className="card-img-top" src={video.video.picture} alt={title} />
      <div className="card-block">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{video.status}</h6>
        <p className="card-text">Originally scheduled: {video.planned_start_time}</p>
        <p className="card-text">{body}</p>
      </div>
    </div>
  )
}

function scheduledLive(video) {
  const title = video.title ? video.title : video.description;
  const body = video.title ? video.description : '';

  return (
    <div className="card">
      <img className="card-img-top" src={video.video.picture} alt={title} />
      <div className="card-block">
        <h5 className="card-title text-success">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{video.status}</h6>
        <p className="card-text">LIVE NOW!</p>
        <p className="card-text">{body}</p>
      </div>
    </div>
  )
}

function defaultDescriptor(video) {
  return JSON.stringify(video);
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setLiveVideos
  }, dispatch);
}

export default connect(null, null)(VideoSelector)