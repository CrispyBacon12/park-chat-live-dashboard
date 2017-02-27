import React, { Component } from 'react';
import TimeAgo from 'react-timeago'

export default class YouTubeCommentsListItem extends Component {
  render() {
    const { comment } = this.props;
    const className = `list-group-item ${this.makeApprovedClassName()}`;

    return (
      <li className={className} onClick={event => this.props.onClick(comment) }>
        <div className="col-sm-12">
          <div className="d-flex w-100 justify-content-between">
            <p className="mb-1 text-danger">{comment.authorDetails.displayName}</p>
            <small><TimeAgo date={comment.snippet.publishedAt} /></small>
          </div>
          <p className="mb-1">{comment.snippet.displayMessage}</p>
        </div>
      </li>
    );
  }

  makeApprovedClassName() {
    const { comment, approvedComments } = this.props;

    const commentIsApproved = approvedComments.some(approvedComment => approvedComment.id === comment.id);

    return commentIsApproved ? 'youtube-list-item bg-success' : 'youtube-list-item';
  }
}
