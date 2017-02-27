import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleCommentApproval } from '../actions';

import CommentsListItem from './comments-list-item';
import YouTubeCommentsListItem from './youtube-comments-list-item';

class CommentsList extends Component {
  constructor(props) {
    super(props);

    this.onCommentClick = this.onCommentClick.bind(this);
    this.facebook = props.facebook;
  }

  render() {
    const items = this.props.comments.map(comment => {
      if (comment.kind === 'youtube#liveChatMessage') {
        return (
          <YouTubeCommentsListItem 
            key={comment.id}
            comment={comment}
            approvedComments={this.props.approvedComments} 
            onClick={this.onCommentClick} />
        );
      }

      return (
        <CommentsListItem 
          key={comment.id} 
          comment={comment} 
          approvedComments={this.props.approvedComments} 
          onClick={this.onCommentClick} />
      );
    });

    return (
      <ul className="mt-4 mb-4 list-group">
        { items }
      </ul>
    );
  }

  onCommentClick(comment) {
    this.props.toggleCommentApproval(comment, this.props.approvedComments, (approved) => {
      if (approved) {
        this.facebook.broadcastDisapproveComment(comment);
      } else {
        this.facebook.broadcastApproveComment(comment);
      }
    });
  }
}

function mapStateToProps({comments, approvedComments}) {
  return { comments, approvedComments };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({toggleCommentApproval}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsList)
