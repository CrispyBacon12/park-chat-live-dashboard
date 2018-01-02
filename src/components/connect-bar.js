import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addComments, updateFacebookVideo, updateYoutubeVideo, updateFacebookPage, setLiveVideos } from '../actions';
import { VideoSelector } from './video-selector';

export class ConnectBar extends Component {
  constructor(props) {
    super(props);

    this.state = {facebookVideoId: '', facebookPageId: '628490220508711', youtubeVideoId: ''};
    this.facebook = this.props.facebook;
    this.youtube = this.props.youtube;

    this.onFacebookSubmit = this.onFacebookSubmit.bind(this);
    this.onYoutubeSubmit = this.onYoutubeSubmit.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.selectedVideo = this.selectedVideo.bind(this);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <form className="form-inline col-sm-6" onSubmit={this.onFacebookSubmit}>
            <input className="form-control mr-2" type="text" value={this.state.facebookPageId} onChange={event => this.setState({facebookPageId: event.target.value})} />
            <button type="submit" className="btn btn-primary">Connect Facebook!</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={this.onLogoutClick}>Logout</button>
          </form>

          <form className="form-inline col-sm-6" onSubmit={this.onYoutubeSubmit}>
            <input className="form-control mr-2" type="text" value={this.state.youtubeVideoId} onChange={event => this.setState({youtubeVideoId: event.target.value})} />
            <button type="submit" className="btn btn-danger">Connect YouTube!</button>
          </form>
        </div>

        <VideoSelector videos={this.props.videos} selectedVideo={video => this.selectedVideo(video)} />
      </div>
    );
  }

  selectedVideo(video) {
    this.props.setLiveVideos([]);

    this.facebook.connectToStream(video.id, this.state.facebookPageId, (comments) => {
      const parsedComments = comments.map(this.props.facebook.transformComment)
      console.log('Got some fb comments', comments, parsedComments);
      this.props.addComments(parsedComments);
    });
  }

  onFacebookSubmit(event) {
    event.preventDefault();
    
    this.props.updateFacebookVideo(this.state.facebookVideoId);
    this.props.updateFacebookPage(this.state.facebookPageId);

    const connection = this.facebook.fetchLiveVideos(this.state.facebookPageId, (videos) => {
      this.props.setLiveVideos(videos.data);
       
    });
  }

  onYoutubeSubmit(event) {
    event.preventDefault();

    this.props.updateYoutubeVideo(this.state.youtubeVideoId);

    const connection = this.youtube.connectToStream(this.state.youtubeVideoId, (comments) => {
      const parsedComments = comments.map(this.props.youtube.transformComment);
      console.log("Got some yt comments", comments, parsedComments);
      this.props.addComments(parsedComments);
    });
  }

  onLogoutClick(event) {
    this.facebook.logout();
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addComments, updateFacebookVideo, updateYoutubeVideo, updateFacebookPage, setLiveVideos}, dispatch);
}

function mapStateToProps({ liveVideos }) {
  return { videos: liveVideos };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectBar)
