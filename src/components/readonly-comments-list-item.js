import React, { Component } from 'react';
import TimeAgo from 'react-timeago'
import { YOUTUBE_COMMENT_TYPE } from '../services/youtube';

export default class ReadOnlyCommentsListItem extends Component {
  render() {
    const { comment } = this.props;
    const providerClass = (comment.type === YOUTUBE_COMMENT_TYPE) ? 'text-danger': 'text-primary';

    return (
      <li className="list-group-item">
        <div className="d-flex w-100 justify-content-between comment-heading mb-3">
          <p className={providerClass}><small>{comment.from.name}</small></p>
          <p className="text-muted"><small><TimeAgo date={comment.created_time} /></small></p>
        </div>
        <p className="mb-1">{comment.message}</p>
      </li>
    );
  }
}
