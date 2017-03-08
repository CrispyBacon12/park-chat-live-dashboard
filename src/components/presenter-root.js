import React, {Component} from 'react';
import facebookConnector from '../services/facebook';
import youtubeConnector from '../services/youtube';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { approveComment, disapproveComment, updateFacebookVideo, setFacebookViewers, setYoutubeViewers } from '../actions';

import ViewerCounts from './viewer-counts';
import PresenterCommentsList from './presenter-comments-list';
import VideoPlayer from './video-player';

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
  }

  render() {
    return (
      <div className="container-fluid tv-container">
        <div className="row">
          <div className="col-sm-4 fixed">
            <VideoPlayer videoId={this.props.videoConnections.facebook} />

            <ViewerCounts viewers={this.props.viewers} />
          </div>
          <div className="col-sm-4"></div>
          <div className="col-sm-7 offset-sm-1">
            <PresenterCommentsList approvedComments={this.props.approvedComments} />
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({approveComment, disapproveComment, updateFacebookVideo, setFacebookViewers, setYoutubeViewers}, dispatch);
}

function mapStateToProps({ approvedComments, videoConnections, viewers }) {
  return { approvedComments, videoConnections, viewers };
}

export default connect(mapStateToProps, mapDispatchToProps)(PresenterRoot)
