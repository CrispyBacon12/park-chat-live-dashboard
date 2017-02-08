import { Injectable } from '@angular/core';
import { WindowService } from '../window/window.service';

interface InitParams {
  appId: string;
  xfbml: boolean;
  version: string;
}

interface AuthResponse {
  status: string;
}

interface ApiParams {

}

interface FacebookSDK {
  init: (initParams: InitParams) => void;
  login: (cb: (authResponse: AuthResponse) => void) => void;
  api: (path: string, method: string, params: ApiParams, callback: (response: any) => void) => void;
  AppEvents: {
    logPageView: () => void;
  };
}

@Injectable()
export class FacebookService {
  public FB: Promise<FacebookSDK>;

  constructor(private window: WindowService) { 
    this.FB = new Promise((resolve) => {
      window.fbAsyncInit = function() {
        resolve(window.FB);
      };
    });

    this.FB.then((FB) => {
      FB.init({
        appId      : '673351099519084',
        xfbml      : true,
        version    : 'v2.8'
      });
      FB.AppEvents.logPageView();
    });
  }

  login() {
    return this.FB.then((FB) => {
      return new Promise<FacebookSDK>((resolve, reject) => {
        FB.login((authResponse) => {
          if (authResponse.status === 'connected') {
            return resolve(FB);
          }

          return reject();
        });
      });
    })
  }

  getVideoList() {
    return this.login()
    .then((FB) => {
      return new Promise<any>((resolve, reject) => {
        FB.api('/628490220508711?fields=live_videos', 'get', {
          broadcast_status: 'LIVE'
        }, (response) => {
          resolve(response);
        });
      });
    });
  }
}