import React, { Component } from 'react';
import TimeAgo from 'react-timeago'
import { YOUTUBE_COMMENT_TYPE } from '../services/youtube';

export default class CommentsListItem extends Component {
  render() {
    const { comment } = this.props;
    const className = `list-group-item ${this.makeApprovedClassName()}`;
    const providerClass = (comment.type === YOUTUBE_COMMENT_TYPE) ? 'text-danger': 'text-primary';

    return (
      <li className={className} onClick={event => this.props.onClick(comment) }>
        <div className="col-sm-12">
          <div className="d-flex w-100 justify-content-between">
            <p className={providerClass + ' mb-1'}>{comment.from.name}</p>
            <small><TimeAgo date={comment.created_time} /></small>
          </div>
          <p className="mb-1">{comment.message}</p>
        </div>
      </li>
    );
  }

  makeApprovedClassName() {
    const { comment, approvedComments } = this.props;

    const commentIsApproved = approvedComments.some(approvedComment => approvedComment.id === comment.id);

    return commentIsApproved ? 'bg-success' : '';
  }
}
