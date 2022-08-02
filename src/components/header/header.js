import React, { useEffect, useState } from 'react';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';
import UserPanel from '../user-panel/user-panel';
import './header.scss';
import { Template } from 'devextreme-react/core/template';
import { useDispatch, useSelector } from 'react-redux';
import { customerloadAction, customerselectAction } from '../../store/actions/CustomerAction';
import { getcustNew, getCustomers, getRegionsProbesByCustomer } from '../../services/CustomerServcie';

export default function ({ menuToggleEnabled, title, toggleMenu }) { 

  const authstate = useSelector((state) => state.auth);
  const custstate = useSelector((state) => state.cust);
  const [customers, setcustomers] = useState([]);
   const [active, setActive] =  useState("");
  const [selectcustomer, setselectcustomer] = useState("");
  console.log("state",authstate);
  console.log("Custstate",custstate);
  const dispatch = useDispatch();

  const handleChange = evt => {   
    console.log("change customer evt",evt);
    let newValue = evt.value;
    console.log("change customer",newValue);
    setselectcustomer(newValue);
    dispatch(customerselectAction(newValue));
    
    }

  useEffect(() => {
    if (authstate.auth.isauthenticated && customers.length == 0 ) {
      console.log("Call cust")
     // dispatch(getCustomerAction(authstate.auth.idToken));

  //    getcustNew(authstate.auth.idToken).then((response) => {
  //     console.log("Fetch Response",response );
  //       dispatch(customerloadAction(response));
  //        setcustomers(response);
  //        // select the first option by default
  //        if (custstate.customer.length>0){
  //         setActive(custstate.customer[0].customerName);
  //        }
  // });

      getCustomers(authstate.auth.idToken).then((response) => {
        dispatch(customerloadAction(response));
         setcustomers(response);
         // select the first option by default
         if (custstate.customer.length>0){
          setActive(custstate.customer[0].customerName);
         }
         
        // const state = store.getState();
        // console.log("current stat",state);
    });
  //   getcustNew(authstate.auth.idToken).then((response) => {
  //     console.log("Header Comp Cust",response);
  //     // const state = store.getState();
  //     // console.log("current stat",state);
  // });
    }
  },[])

  useEffect(() => {
    if (custstate.selectedCustomer && custstate.selectedCustomer !== "" ) {
      console.log("Propes Load event")
     // dispatch(getCustomerAction(authstate.auth.idToken));
     getRegionsProbesByCustomer(custstate.selectedCustomer,authstate.auth.idToken,dispatch).then((response) => {
        //dispatch(customerloadAction(response));
         //setcustomers(response);
        // const state = store.getState();
        console.log("PropesRegin",response);
        // if (response) {
        //   dispatch(regionanddestinationAction(response));
        // }
        
       
    });
    }
  },[custstate.selectedCustomer])

  const selectBoxOptionsnew = {
    width: 240,
    valueExpr: 'customerId',
    displayExpr: 'customerName',
    placeholder:'Select Customer',
    dataSource: custstate.customer,
    value: custstate.selectedCustomer.length > 0 ? custstate.selectedCustomer : custstate.customer && custstate.customer.length > 0 ? custstate.customer[0].customerId:"",
    onValueChanged: handleChange,
  };

  return (
  <header className={'header-component'}>
    <Toolbar className={'header-toolbar'}>
      <Item
        visible={menuToggleEnabled}
        location={'before'}
        widget={'dxButton'}
        cssClass={'menu-button'}
      >
        <Button icon="menu" stylingMode="text" onClick={toggleMenu} />
      </Item>
      <Item
        location={'before'}
        cssClass={'header-title'}
        text={title}
        visible={!!title}
      />
       <Item location={'after'}
            locateInMenu={'auto'}
            widget={'dxSelectBox'}
            options={selectBoxOptionsnew}
             />
      <Item
        location={'after'}
        locateInMenu={'auto'}
        menuItemTemplate={'userPanelTemplate'}
      >
        <Button
          className={'user-button authorization'}
          width={210}
          height={'100%'}
          stylingMode={'text'}
        >
          <UserPanel menuMode={'context'} />
        </Button>
      </Item>
      <Template name={'userPanelTemplate'}>
        <UserPanel menuMode={'list'} />
      </Template>
    </Toolbar>
  </header>
)};

