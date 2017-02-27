import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import { Router, Route, browserHistory } from 'react-router';

import ConnectBar from './components/connect-bar';
import CommentsList from './components/comments-list';
import PresenterRoot from './components/presenter-root';
import GoogleCallback from './components/google-callback';
import { rootReducer } from './reducers';
import facebookConnector from './services/facebook';
import youtubeConnector from './services/youtube';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore);

class App extends Component {
  render() {
    const facebook = facebookConnector();
    const youtube = youtubeConnector();

    return (
      <div className="container">
        <div className="row mt-4">
          <div>
            <ConnectBar facebook={facebook} youtube={youtube} />
          </div>
          <div className="row mt-4">
            <CommentsList facebook={facebook} />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(rootReducer)}>
    <Router history={browserHistory}>
      <Route path="/" component={App} />
      <Route path="/presenter" component={PresenterRoot} />
      <Route path="/gcallback" component={GoogleCallback} />
    </Router>
  </Provider>
  , document.querySelector('.mount'));
  