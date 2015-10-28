export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGGEDIN = 'USER_LOGEDIN';

export function userLogin(userName , password) {
  return dispatch => {
    fetch('http://localhost:5000/login',
    {
      method:'post',
      body:{username:userName,password:password}
    })
      .then(response => response.json())
      .then(json => dispatch(userLoggedIn(json)));
  }
}

export function userLoggedIn(json) {
  console.log(json);
  return { type: USER_LOGGEDIN, json };
}
