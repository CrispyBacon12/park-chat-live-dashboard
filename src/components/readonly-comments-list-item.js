import React, { Component } from 'react';
import TimeAgo from 'react-timeago'

export default class ReadOnlyCommentsListItem extends Component {
  render() {
    const { comment } = this.props;

    return (
      <li className="list-group-item">
        <div className="d-flex w-100 justify-content-between">
          <p className="mb-1 text-primary">{comment.from.name}</p>
          <small><TimeAgo date={comment.created_time} /></small>
        </div>
        <p className="mb-1">{comment.message}</p>
      </li>
    );
  }
}
