// import ReactDOM from 'react-dom';
import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { connect, useDispatch, useSelector } from "react-redux";
import ProbesRegionConfigComponent  from '../../components/probe-config/ProbesRegionConfigComponent';
import StatusHeader from "../../components/status-header/StatusHeader";
// import { usePageContainerStyles } from "../utils/usePageContainerStyles";
//import ProbesTestHeader from "../components/ProbesTestHeader";
// import Header  from '../components/Header';
// import { getCustomers, getRegionsProbesByCustomer } from "../services/CustomerServcie";
// import { store } from "../store/store";
// import {probesGridData, states} from '../SampleDataSet/probesgrid';

export default () => {
    const custstate = useSelector((state) => state.cust);
    // const pageContainerStyle = usePageContainerStyles();
    return(
       <React.Fragment>
            <div className={'responsive-paddings-new'}>
            <StatusHeader props={custstate} />
            </div>

                 <ProbesRegionConfigComponent/>  
       </React.Fragment>
    // <Grid className={pageContainerStyle.root} container justifyContent="space-between" alignItems="center" spacing={0}>
    //     <Grid item xs={12}>
    //         <StatusHeader props={custstate} />
    //     </Grid>
    //       <ProbesRegionConfigComponent  ></ProbesRegionConfigComponent>
    //     <br></br>
      
        
    // </Grid>

        
    );
};

