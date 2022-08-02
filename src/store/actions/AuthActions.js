import {
    formatError,
    authenticate,
    saveTokenInLocalStorage
} from '../../services/AuthService';
import { GetCustomers, getCustomers_new } from '../../services/CustomerServcie';

export const SIGNUP_CONFIRMED_ACTION = '[signup action] confirmed signup';
export const SIGNUP_FAILED_ACTION = '[signup action] failed signup';
export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';

export function loginAction(email, password, history) {
    return (dispatch) => {
        authenticate(email, password)
            .then((response) => {
                console.log("Login response",response);
                saveTokenInLocalStorage(response);
                // runLogoutTimer(
                //     dispatch,
                //     response.data.expiresIn * 1000,
                //     history,
                // );

                dispatch(loginConfirmedAction(response));
                history.push('/');
               // GetCustomers(response.idToken);
             // getCustomers_new(response.idToken);
                
            })
            .catch((error) => {
                console.log("Error",error);
                const errorMessage = error.message;
                dispatch(loginFailedAction(errorMessage));
            });
    };
}
export function logout(history) {
    localStorage.removeItem('userDetails');
   // history.push('/login');
    return {
        type: LOGOUT_ACTION,
    };
}
export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

export function loginConfirmedAction(data) {
    return {
        type: LOGIN_CONFIRMED_ACTION,
        payload: data,
    };
}
export function loadingToggleAction(status) {
    return {
        type: LOADING_TOGGLE_ACTION,
        payload: status,
    };
}