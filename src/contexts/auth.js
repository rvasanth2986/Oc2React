import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getUser, signIn as sendSignInRequest } from '../api/auth';
import { authenticate, checkAutoLogin, runLogoutTimer, saveTokenInLocalStorage } from '../services/AuthService';
import { loginConfirmedAction, loginFailedAction, logout } from '../store/actions/AuthActions';


function AuthProvider(props) {
  const dispatch = useDispatch();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const result = await checkAutoLogin(dispatch,props.history);
      if (result.isOk) {
        setUser(result.data);
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

  const signOut = useCallback(() => {
    dispatch(logout(props.history));
    setUser();
  }, []);


  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }} {...props} />
  );
}

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }
