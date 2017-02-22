import React from 'react';
import ReadOnlyCommentsListItem from './readonly-comments-list-item';

export default ({ approvedComments }) => {
  return (
    <ul className="mt-4 mb-4 list-group presenter-comments-list">
      { approvedComments.map(comment => <ReadOnlyCommentsListItem key={comment.id} comment={comment} />) }
    </ul>
  );
};
