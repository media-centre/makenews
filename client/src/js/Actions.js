import fetch from "isomorphic-fetch";

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';

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
    })
    .then(response => response.json())
    .then(responseJson => {
      if(responseJson.status === "success") {
        dispatch(loginSuccess());
      }else{
        dispatch(loginFailed(responseJson.message));
      }
    }).catch(err => {

    });
  };
}

export function loginSuccess() {
  return { type: LOGIN_SUCCESS };
}

export function loginFailed(responseMessage) {
  return { type: LOGIN_FAILED, responseMessage };
}
