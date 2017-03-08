import React, {Component} from 'react';
import facebookConnector from '../services/facebook';
import youtubeConnector from '../services/youtube';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
  approveComment, 
  disapproveComment, 
  updateFacebookVideo, 
  setFacebookViewers, 
  setYoutubeViewers,
  setFacebookStartTime 
} from '../actions';

import ViewerCounts from './viewer-counts';
import PresenterCommentsList from './presenter-comments-list';
import VideoPlayer from './video-player';
import Clock from './clock';

class PresenterRoot extends Component {
  constructor(props) {
    super(props);

    this.facebook = facebookConnector();
    this.youtube = youtubeConnector();

    this.facebook.subscribeApprovals(comment => {
      this.props.approveComment(comment);
    });

    this.facebook.subscribeDisapproves(comment => {
      this.props.disapproveComment(comment);
    });

    this.facebook.subscribeVideoConnection(videoId => {
      this.props.updateFacebookVideo(videoId);
    });

    this.facebook.subscribeViewers(viewers => {
      console.log("Got facebook info");
      this.props.setFacebookViewers(viewers);
    });

    this.youtube.subscribeViewers(viewers => {
      console.log("Got youtube info");
      this.props.setYoutubeViewers(viewers);
    });

    this.facebook.subscribeStartTime(startTime => {
      console.log("Got facebook start time", startTime);
      this.props.setFacebookStartTime(startTime);
    });
  }

  render() {
    return (
      <div className="container-fluid tv-container">
        <div className="row">
          <div className="col-sm-5 fixed">
            <VideoPlayer videoId={this.props.videoConnections.facebook} />

            <ViewerCounts viewers={this.props.viewers} />

            <Clock facebookStartTime={this.props.times.facebook} />
          </div>
          <div className="col-sm-5"></div>
          <div className="col-sm-7 comments-column">
            <PresenterCommentsList approvedComments={this.props.approvedComments} />
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    approveComment, 
    disapproveComment, 
    updateFacebookVideo, 
    setFacebookViewers, 
    setYoutubeViewers,
    setFacebookStartTime
  }, dispatch);
}

function mapStateToProps({ approvedComments, videoConnections, viewers, times }) {
  return { approvedComments, videoConnections, viewers, times };
}

export default connect(mapStateToProps, mapDispatchToProps)(PresenterRoot)
