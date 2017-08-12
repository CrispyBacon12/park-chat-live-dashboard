import React from 'react';
import axios from 'axios';
import { clientId } from '../services/youtube-embed';

export const STORAGE_KEY = 'GOOGLE_ACCESS_TOKEN';

export default () => {
  // have a look at the current url
  const queryString = location.hash.substring(1);

  const params = {};
  const regex = /([^&=]+)=([^&]*)/g;
  let m;

  while (m = regex.exec(location.hash.substring(1))) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }

  validateAccessToken(params);

  return (
    <p>Connecting your account &hellip;</p>
  )
}

function validateAccessToken(params) {
  const oauth2Endpoint = 'https://www.googleapis.com/oauth2/v3/tokeninfo';

  if (params.access_token) {
    axios.get(oauth2Endpoint, {
      params: {
        access_token: params.access_token
      }
    })
    .then(response => response.data)
    .then(response => {
      if (response.aud !== clientId) {
        throw new Error('Response does not match client ID. This may be an attack.');
      }

      return response;
    })
    .then(response => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(params));

      throw new Error('Could not provide access token to parent window. Is this an orphan?');
    });
  }
}
