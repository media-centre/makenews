export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGGEDIN = 'USER_LOGEDIN';

export function userLogin(userDetails) {
  return dispatch => {
    return fetch('https://www.reddit.com/r/funny.json')
      .then(req => req.json())
      .then(json => dispatch(receivePosts(reddit, json)));
  };
}

export function userLoggedIn(json) {
  return { type: USER_LOGEDIN, json };
}
