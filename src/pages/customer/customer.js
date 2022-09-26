import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import CustomerConfigComponent  from '../../components/customer/CustomerConfigComponent';
import StatusHeader from "../../components/status-header/StatusHeader";

export default () => {
    const custstate = useSelector((state) => state.cust);
    return(
       <React.Fragment>
            <div className={'responsive-paddings-new'}>
            <StatusHeader props={custstate} />
            </div>
                 <CustomerConfigComponent/>  
       </React.Fragment>
    );
};

