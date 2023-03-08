import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getUser, signIn as sendSignInRequest } from '../api/auth';
import { authenticate, checkAutoLogin, cognitoUserSignOut, getSession, runLogoutTimer, saveTokenInLocalStorage } from '../services/AuthService';
import { loginConfirmedAction, loginFailedAction, logout } from '../store/actions/AuthActions';
import { CustomerResetState } from '../store/actions/CustomerAction';
import { PathResetState } from '../store/actions/TraceDiagramAction';


function AuthProvider(props) {
  const dispatch = useDispatch();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const result = await checkAutoLogin(dispatch,props.history);
      if (result != undefined){
        if (result.isOk) {
          setUser(result.data);
          runSignoutTimerNew(dispatch, props.history);
        }
      }
      

      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (email, password,history) => {
    const auth = {
      isOk: false,
      data: null,
      message: '',
  }
  await  authenticate(email, password)
    .then((response) => {
        console.log("Login response",response);
        saveTokenInLocalStorage(response);
        // runLogoutTimer(
        //     dispatch,
        //     response.data.expiresIn * 1000,
        //     history,
        // );

        runLogoutTimer(
          dispatch,
          response.expiresIn / 1000,
          response.refreshToken,response.email,history
      );
        runSignoutTimerNew(dispatch, history);
        dispatch(loginConfirmedAction(response));
        //history.push('/');
       // GetCustomers(response.idToken);
     // getCustomers_new(response.idToken);
        setUser(response);
        auth.isOk =  true;
        auth.data = response;
        
    })
    .catch((error) => {
        console.log("Error",error);
        const errorMessage = error.message;
        dispatch(loginFailedAction(errorMessage));

        auth.isOk =  false;
        auth.data = errorMessage;
    });

    // const result = await authenticate(email, password);
    // if (result.isOk) {
    //   setUser(result.data);
    // }

     return auth;
  }, []);


const runSignoutTimerNew = useCallback((dispatch, history) => {
     setTimeout(() => {
    CheckToken(dispatch, history);
  }, 5000);
  }, []);

const CheckToken = useCallback((dispatch, history) => {
    const tokenDetailsString = localStorage.getItem('userDetails');
  let tokenDetails = '';
  if (!tokenDetailsString) {
      //  AuthContext.signOut();
      signOut();
      
  }
  else {
    runSignoutTimerNew(dispatch, history);
  }
  }, []);


  const getUserSession = useCallback(async () => {
    const auth = {
      isOk: false,
      data: null,
      message: '',
    }
      await getSession()
      .then((response) => {
        console.log("Get Session response",response);
        auth.isOk =  true;
        auth.data = response;
      })
      .catch((error) => {
        console.log("Get Session Error",error);
        const errorMessage = (error) ? error.message : "";
        dispatch(logout(props.history));
        setUser();
        auth.isOk =  false;
        auth.data = errorMessage;
      });
      return auth;
  }, []);

  const signOut = useCallback(() => {
    (async function () {
      const result = await cognitoUserSignOut(dispatch,props.history);
      if (result != undefined){
        if (!result.isOk) {
          dispatch(PathResetState());
          dispatch(CustomerResetState());
          dispatch(logout(props.history));
          setUser();
        }
      }
      

      setLoading(false);
    })();

  }, []);



  return (
    <AuthContext.Provider value={{ user, signIn, signOut, getUserSession, loading }} {...props} />
  );
}

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }
