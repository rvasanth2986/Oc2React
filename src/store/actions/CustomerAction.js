import { getCustomers, getCustomers_new } from "../../services/CustomerServcie";

import { sendRequest,DeleteRequest,sendProbesRequest,DeleteProbesRequest } from "../../services/ProbesConfigService";

export const CUSTOMER_LOAD_ACTION = '[customer action] customer load';
export const CUSTOMER_SELECT_ACTION = '[customer action] customer select';
export const CUSTOMER_REGIONANDDEST_LOAD = '[customer action] region and destination load';

export const FETCH_PENDING = 'FETCH_PENDING';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_ERROR = 'FETCH_ERROR';
export const SAVING_PENDING = 'SAVING_PENDING';
export const SAVING_SUCCESS = 'SAVING_SUCCESS';
export const SAVING_PROBES_SUCCESS='SAVING_PROBES_SUCCESS';
export const UPDATE_PROBES_SUCCESS ='UPDATE_PROBES_SUCCESS';
export const DELETE_PROBES_SUCCESS='DELETE_PROBES_SUCCESS';
export const UPDATE_SUCCESS = 'UPDATE_SUCCESS';
export const DELETE_SUCCESS='DELETE_SUCCESS';
export const SAVING_ERROR = 'SAVING_ERROR';
export const SAVING_CANCEL = 'SAVING_CANCEL';
export const SET_CHANGES = 'SET_CHANGES';
export const SET_EDIT_ROW_KEY = 'SET_EDIT_ROW_KEY';

export const SET_RESET_STATE = '[customer action] Reset State';


export function CustomerResetState(){
  return {
      type: SET_RESET_STATE,
  }
};
export function customerloadAction(data) {
    return {
        type: CUSTOMER_LOAD_ACTION,
        payload: data,
    };
}
export function customerselectAction(data) {
    return {
        type: CUSTOMER_SELECT_ACTION,
        payload: data,
    };
}
export function regionanddestinationAction(data) {
    return {
        type: CUSTOMER_REGIONANDDEST_LOAD,
        payload: data,
    };
}
export function getCustomerAction(idToken) {
    return (dispatch, getState) => {
        getCustomers(idToken).then((response) => {
            dispatch(customerloadAction(response));
        });
    };
}
export async function saveChange(dispatch, change,insertdata,token) {
    if (change && change.type) {
      let data;
  
      dispatch({ type: SAVING_PENDING });
  
      try {
          
       
  
        change.data = data;
        if (change.type=="insert"){
          data = await sendChange(token, change,insertdata,'POST');
          dispatch({
            type: SAVING_SUCCESS,
            payload: {
                region: insertdata.regionName,
                description: insertdata.description,
                probes:[]
              },
          });
        }
        else if(change.type=="update"){
          data = await sendChange(token, change,insertdata,'PUT');
          dispatch({
            type: UPDATE_SUCCESS,
            payload: {
                customerId: insertdata.customerId,
                description: insertdata.description,
                pregion_old: insertdata.pregion_old,
                pregion_new: insertdata.pregion_new,
                probes:[]
              },
          });
        }
        else if(change.type=="remove"){
          data = await sendChange(token, change,insertdata);
          dispatch({
            type: DELETE_SUCCESS,
            payload: {
               regionId:insertdata.regionId
              },
          });
        }
  
        return data;
      } catch (err) {
        dispatch({ type: SAVING_ERROR });
        throw err;
      }
    } else {
      dispatch({ type: SAVING_CANCEL });
      return null;
    }
  }
  
export async function saveProbesChange(dispatch, change,insertdata,token) {
  if (change && change.type) {
    let data;

    dispatch({ type: SAVING_PENDING });

    try {
        
      

      change.data = data;
      if (change.type=="insert"){
        data = await sendProbesChange(token, change,insertdata,'POST');
        dispatch({
          type: SAVING_PROBES_SUCCESS,
          payload: {
            
            customerId:insertdata.customerId,
            probeId:insertdata.probeId,
            probeName:insertdata.probeName,
            localIP:insertdata.localIP,
            natIP:insertdata.natIP,
            pregion:insertdata.pregion,
            ptype:insertdata.ptype
            },
        });
      }
      else if(change.type=="update"){
        data = await sendProbesChange(token, change,insertdata,'POST');
        dispatch({
          type: UPDATE_PROBES_SUCCESS,
          payload: {
            ptype:insertdata.ptype,
            pregion:insertdata.pregion,
            probeId:insertdata.probeId,
            probeName:insertdata.probeName,
            localIP:insertdata.localIP,
            natIP:insertdata.natIP,
            customerId:insertdata.customerId
            },
        });
      }
      else if(change.type=="remove"){
        data = await sendProbesChange(token, change,insertdata);
        dispatch({
          type: DELETE_PROBES_SUCCESS,
          payload: {
            probeId:insertdata.probeId
            },
        });
      }

      return data;
    } catch (err) {
      dispatch({ type: SAVING_ERROR });
      throw err;
    }
  } else {
    dispatch({ type: SAVING_CANCEL });
    return null;
  }
} 
  async function sendChange(token, change,insertdata) {
    switch (change.type) {
      case 'insert':
        return sendRequest(token,insertdata,"POST");
      case 'update':
        return sendRequest(token,insertdata,"PUT");
      case 'remove':
        //return sendRequest(`${url}/DeleteOrder`, 'DELETE', { key: change.key });
        return DeleteRequest(token,insertdata,"DELETE");
      default:
        return null;
    }
  }
  async function sendProbesChange(token, change,insertdata) {
    switch (change.type) {
      case 'insert':
        return sendProbesRequest(token,insertdata,"POST");
      case 'update':
        return sendProbesRequest(token,insertdata,"PUT");
      case 'remove':
        //return sendRequest(`${url}/DeleteOrder`, 'DELETE', { key: change.key });
        return DeleteProbesRequest(token,insertdata,"DELETE");
      default:
        return null;
    }
  }