import React, { Component } from 'react';
import TimeAgo from 'react-timeago'

export default class ReadOnlyYouTubeCommentsListItem extends Component {
  render() {
    const { comment } = this.props;

    return (
      <li className="list-group-item youtube-list-item">
        <div className="d-flex w-100 justify-content-between comment-heading mb-3">
          <p className="text-danger"><small>{comment.authorDetails.displayName}</small></p>
          <p className="text-muted"><small><TimeAgo date={comment.snippet.publishedAt} /></small></p>
        </div>
        <p className="mb-1">{comment.snippet.displayMessage}</p>
      </li>
    );
  }
}
