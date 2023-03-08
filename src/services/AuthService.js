import { AuthenticationDetails, CognitoRefreshToken, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import axios from 'axios';
import { loginConfirmedAction, logout } from '../store/actions/AuthActions';
import { CustomerResetState } from '../store/actions/CustomerAction';
import { PathResetState } from '../store/actions/TraceDiagramAction';
// import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../UserPool";


// export function authenticate(Username, Password) {
//   const user = new CognitoUser({
//     Username: Username,
//     Pool: UserPool
//   });
//   // const authDetails = new AuthenticationDetails({ Username, Password })
//   const authDetails = new AuthenticationDetails({
//     Username: Username,
//     Password: Password
//   });
//   user.authenticateUser(authDetails, {
//     onSuccess: (data) => {
//       console.log('onSuccess:', data)
//       const auth = {
//         email: Username,
//         idToken: data.getIdToken().getJwtToken(),
//         localId: '',
//         expiresIn: '',
//         refreshToken:  data.getRefreshToken().getToken(),
//     }
//       return auth;
//     },

//     onFailure: (err) => {
//       console.error('onFailure:', err)
//       return err;
//     },
//   });
// }


export const getSession = async () =>
await new Promise((resolve, reject) => {
  const user = UserPool.getCurrentUser();
  if (user) {
    user.getSession((err, session) => {
      if (err) {
        reject(err);
      } else {
        resolve(session);
      }
    });
  } else {
    reject();
  }
});

export const authenticate = async (Username, Password) =>
await new Promise((resolve, reject) => {
  // const user = new CognitoUser({ Username, Pool })
  // const authDetails = new AuthenticationDetails({ Username, Password })
  const user = new CognitoUser({
    Username: Username,
    Pool: UserPool
  });
  // const authDetails = new AuthenticationDetails({ Username, Password })
  const authDetails = new AuthenticationDetails({
    Username: Username,
    Password: Password
  });
  user.authenticateUser(authDetails, {
    onSuccess: (data) => {
      console.log('onSuccess:', data)
      const auth = {
        email: Username,
        idToken: data.getIdToken().getJwtToken(),
        localId: '',
        expiresIn: data.getIdToken().getExpiration(),
        refreshToken:  data.getRefreshToken().getToken(),
        isauthenticated: true,
    }
      resolve(auth)
    },

    onFailure: (err) => {
      console.error('onFailure:', err.message)
      reject(err)
    },

    newPasswordRequired: (data) => {
      console.log('newPasswordRequired:', data)
      resolve(data)
    },
  })
})

export async function checkAutoLogin(dispatch, history) {
    const tokenDetailsString = localStorage.getItem('userDetails');
    let tokenDetails = '';
    if (!tokenDetailsString) {
        dispatch(logout(history));
        return {
            isOk: false
          };
    }
    tokenDetails = JSON.parse(tokenDetailsString);
  
    let expireDate = new Date(tokenDetails.expireDate);
    let todaysDate = new Date();

    if (todaysDate > expireDate) {
        // dispatch(logout(history));
        refreshsession(dispatch,tokenDetails.refreshToken,tokenDetails.email,history)
        return;
    }

    const timer = expireDate.getTime() - todaysDate.getTime();

    runLogoutTimer(dispatch, timer, tokenDetails.refreshToken, tokenDetails.email,history);

    runSignoutTimer(dispatch, history);

    dispatch(loginConfirmedAction(tokenDetails));
    return {
        isOk: true,
        data: tokenDetails
      };

    //const timer = expireDate.getTime() - todaysDate.getTime();
    //runLogoutTimer(dispatch, timer, history);
}
export async function cognitoUserSignOut(dispatch, history) {
  const tokenDetailsString = localStorage.getItem('userDetails');
  let tokenDetails = '';
  if (!tokenDetailsString) {
      dispatch(logout(history));
      return {
          isOk: false
        };
  }
  tokenDetails = JSON.parse(tokenDetailsString);

  // Initialize the CognitoUser object
  const user = new CognitoUser({
    Pool: UserPool, // The Cognito User Pool where the user is registered
    Username: tokenDetails.email // The user's username
  });

  // Call the signOut method to log the user out
  user.signOut();

  return {
    isOk: false
  };

}
export function runSignoutTimer(dispatch, history) {
  setTimeout(() => {
    CheckToken(dispatch, history);
  }, 5000);
}
export function runLogoutTimer(dispatch, timer, refreshToken, Username,history) {
  setTimeout(() => {
    refreshsession(dispatch, refreshToken, Username,history);
  }, timer);
}

export function CheckToken(dispatch, history) {
 
   const tokenDetailsString = localStorage.getItem('userDetails');
  let tokenDetails = '';
  if (!tokenDetailsString) {
      //  AuthContext.signOut();
      dispatch(PathResetState());
      dispatch(CustomerResetState());
      cognitoUserSignOut(dispatch, history);
      
  }
  else {
    runSignoutTimer(dispatch, history);
  }
}

export const refreshsession = async (dispatch, refreshToken, Username, history) =>
  await new Promise((resolve, reject) => {
            const user = new CognitoUser({
              Username: Username,
              Pool: UserPool
            });
            var token = new CognitoRefreshToken({ RefreshToken: refreshToken })
            user.refreshSession(token, (err, session) => 
            { 
              if (err) 
                {
                  console.log(err);
                  dispatch(PathResetState());
                  dispatch(CustomerResetState());
                  dispatch(logout(history));
                  reject();
                } 
              else {
                console.log('session: ' + JSON.stringify(session)) 
                const auth = {
                  email: Username,
                  idToken: session.getIdToken().getJwtToken(),
                  localId: '',
                  expiresIn: session.getIdToken().getExpiration(),
                  refreshToken:  session.getRefreshToken().getToken(),
                  isauthenticated: true,
              }
              runLogoutTimer(dispatch, (session.getIdToken().getExpiration() / 1000), auth.refreshToken, Username);
              saveTokenInLocalStorage(auth);
              dispatch(loginConfirmedAction(auth));
              resolve();
            }

            });
});

// export async function getUser() {
//     try {
//       // Send request
  
//       return {
//         isOk: true,
//         data: defaultUser
//       };
//     }
//     catch {
//       return {
//         isOk: false
//       };
//     }
//   }
export function login(email, password) {
    const postData = {
        email,
        password
    };

    const user = new CognitoUser({
        Username: email,
        Pool: UserPool
      });
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password
      });
  
      user.authenticateUser(authDetails, {
        onSuccess: data => {
          console.log("onSuccess:", data);
        },
  
        onFailure: err => {
          console.error("onFailure:", err);
        },
  
        newPasswordRequired: data => {
          console.log("newPasswordRequired:", data);
        }
      });
}
export function formatError(errorResponse) {
  switch (errorResponse.error.message) {
      case 'EMAIL_EXISTS':
          return 'Email already exists';

      case 'EMAIL_NOT_FOUND':
          return 'Email not found';
      case 'INVALID_PASSWORD':
          return 'Invalid Password';
      case 'USER_DISABLED':
          return 'User Disabled';

      default:
          return '';
  }
}
export function saveTokenInLocalStorage(tokenDetails) {
  localStorage.removeItem('userDetails');
  tokenDetails.expireDate = new Date(
      new Date().getTime() + (tokenDetails.expiresIn / 1000),
  );
  localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
}

