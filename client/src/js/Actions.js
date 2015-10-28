import fetch from "isomorphic-fetch";

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGGEDIN = 'USER_LOGEDIN';

export function userLogin(userName , password) {
  return dispatch => {
    fetch('http://localhost:5000/login',
    {
      method:'post',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body:JSON.stringify({"username":userName,"password":password})
    }).then(response => response.json())
    .then(json => dispatch(userLoggedIn(json)));
    // .then(response => {
    //   if(response.status == 200) {
    //     dispatch(userLoggedIn(response.json()));
    //   }else{
    //     dispatch(userLoggedIn(response.json()));
    //   }
    // });
  }
}

export function userLoggedIn(json) {
  console.log(json);

  return { type: USER_LOGGEDIN, json };
}
