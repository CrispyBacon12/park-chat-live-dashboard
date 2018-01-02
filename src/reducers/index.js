import { combineReducers } from 'redux';
import { CommentsReducer } from './comments-reducer';
import { ApprovedCommentsReducer } from './approved-comments-reducer';
import { VideoConnectionsReducer } from './video-connections-reducer';
import { ViewersReducer } from './viewers-reducer';
import { TimesReducer } from './times-reducer';
import { ErrorsReducer } from './errors-reducer';
import { LiveVideosReducer } from './live-videos-reducer';

export const rootReducer = combineReducers({
  comments: CommentsReducer,
  approvedComments: ApprovedCommentsReducer,
  videoConnections: VideoConnectionsReducer,
  viewers: ViewersReducer,
  times: TimesReducer,
  errors: ErrorsReducer,
  liveVideos: LiveVideosReducer
});
