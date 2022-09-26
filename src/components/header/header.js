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
  // const [active, setActive] =  useState("");
  //const [selectcustomer, setselectcustomer] = useState("");
 
  const dispatch = useDispatch();

  const handleChange = evt => {   
    let newValue = evt.value;
    //setselectcustomer(newValue);
    dispatch(customerselectAction(newValue));
  }

  useEffect(() => {
    if (authstate.auth.isauthenticated && customers.length == 0 ) {
      getCustomers(authstate.auth.idToken).then((response) => {
        dispatch(customerloadAction(response));
         setcustomers(response);
   });
 
    }
  },[])
  useEffect(()=>{
    console.log("Customer loading....");
    if (custstate.customer.length>0){
      //setActive(custstate.customer[0].customerName);
      //setselectcustomer(custstate.customer[0].customerId);
      dispatch(customerselectAction(custstate.customer[0].customerId));
      
     }
  },[custstate.customer])
  useEffect(() => {
    if (custstate.selectedCustomer && custstate.selectedCustomer !== "" ) {
      console.log("Propes Load event");
       getRegionsProbesByCustomer(custstate.selectedCustomer,authstate.auth.idToken,dispatch).then((response) => {
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

