import React from 'react';
import ReadOnlyCommentsListItem from './readonly-comments-list-item';
import ReadOnlyYouTubeCommentsListItem from './readonly-youtube-comments-list-item';

export default ({ approvedComments }) => {
  const items = approvedComments.map(comment => {
      if (comment.kind === 'youtube#liveChatMessage') {
        return (
          <ReadOnlyYouTubeCommentsListItem 
            key={comment.id} 
            comment={comment} />
        );
      }

      return (
        <ReadOnlyCommentsListItem 
          key={comment.id} 
          comment={comment} />
      );
    });

  return (
    <ul className="mt-4 mb-4 list-group presenter-comments-list">
      { items }
    </ul>
  );
};
