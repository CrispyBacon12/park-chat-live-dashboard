export const clientId = '68413012446-cuj5lq0hng6p5ak2bra63fh3r2i60b1r.apps.googleusercontent.com';

export default new Promise((resolve, reject) => {
  window.start = function() {
    gapi.client.init({
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
      apiKey: 'AIzaSyBhTTHkNrFTYozHrjUxeWjeVF6LW1JJlss',
      clientId,
      scope: [
        'profile',
        'https://www.googleapis.com/auth/youtube'
      ].join(' ')
    })
    .then(() => resolve(gapi));
  }
});

export function getUrl(options) {
  options = Object.keys(options).reduce((acc, key) => {
    acc[key] = encodeURIComponent(options[key]);
    return acc;
  }, {});

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${options.clientId}&redirect_uri=${options.redirectUrl}&response_type=token&scope=${options.scope}&include_granted_scopes=true`;
}

gapi.load('client:auth2', start);
