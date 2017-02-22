import React, {Component} from 'react';
import facebookConnector from '../services/facebook';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { approveComment, disapproveComment, updateFacebookVideo } from '../actions';

import PresenterCommentsList from './presenter-comments-list';
import VideoPlayer from './video-player';

class PresenterRoot extends Component {
  constructor(props) {
    super(props);

    this.facebook = facebookConnector();
    this.facebook.subscribeApprovals(comment => {
      this.props.approveComment(comment);
    });

    this.facebook.subscribeDisapproves(comment => {
      this.props.disapproveComment(comment);
    });

    this.facebook.subscribeVideoConnection(videoId => {
      this.props.updateFacebookVideo(videoId);
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-4 fixed">
            <VideoPlayer videoId={this.props.videoConnections.facebook} />
          </div>
          <div className="col-sm-4"></div>
          <div className="col-sm-8">
            <PresenterCommentsList approvedComments={this.props.approvedComments} />
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({approveComment, disapproveComment, updateFacebookVideo}, dispatch);
}

function mapStateToProps({ approvedComments, videoConnections }) {
  return { approvedComments, videoConnections };
}

export default connect(mapStateToProps, mapDispatchToProps)(PresenterRoot)
