import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PathTraceDiagram from '../../components/charts/PathTraceDiagram';
import ProbesTestHeader from "../../components/status-header/ProbesTestHeader";
import { DataFilterChange, TraceMatrixLoad, TraceMatrixReset } from '../../store/actions/TraceDiagramAction';
import { GetTraceMatricsData } from "../../services/TraceMatricsDataService";
import { Chip, Grid, makeStyles, Paper } from '@material-ui/core';
import StatusHeader from '../../components/status-header/StatusHeader';
import {
    Card,
    Row,
    Col,
    Form,
    FormControl,
    InputGroup,
  } from "react-bootstrap";
import { useAuth } from '../../contexts/auth';
const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
        width: '100vw',
        paddingLeft: '120px',
        paddingRight: '60px',
        paddingTop: '30px',
        paddingBottom: '50px',
        [theme.breakpoints.down("xs")]: {
            margin: 'auto',
            width: '100vw',
            paddingLeft: '10%',
            paddingRight: '10%',
            paddingTop: '30px',
            paddingBottom: '50px',
        }
    },
  }));
  export default () => {

     const classes = useStyles();
    const authstate = useSelector((state) => state.auth);
    const custstate = useSelector((state) => state.cust);
    const path = useSelector((state) => state.path);
    const { getUserSession } = useAuth();

    const dispatch = useDispatch();

    const [metricsData, setmetricsData] = useState([]);
    const [showresult, setshowresult] = useState(false);
    const mockDataRequestFilters = {
        sourceProbeId: "5940",
        destinationProbeId: "ddev-vpc-us-west-2",
        checkType: "TraceRt",
        startTime: "2022-03-15T18:30:00Z",
        endTime: "2022-03-28T18:30:00Z"
    }
    useEffect(() => {
        if (custstate.selectedCustomer && custstate.selectedCustomer !== "" ) {
        changeStateValue("sourceProbeId", "");
        changeStateValue("destinationIds", []);
        changeStateValue("sourceProbeIdError", false);
        changeStateValue("destinationIdsError", false);
       // submit();
        }
    }, [custstate.selectedCustomer]);

    // Changes a single value (field) in the dataRequestFiltersState object.
    function changeStateValue(fieldName, newValue) {
        dispatch(DataFilterChange(fieldName, newValue));
    }
 useEffect(() => {
     if(path.MatrixData && path.MatrixData.length > 0){
        for (let destinationData of path.MatrixData) {
            // If the destinationData only has a flag property called destinationIdWithNoData, then do not include it in the treeData.
            if (Object.keys(destinationData[0])[0] !== "destinationIdWithNoData") {
                setshowresult(true);
            }
     } 
     } else {
        setshowresult(false);
     }

    
 }, [path.MatrixData]);

//  useEffect(() => {
//     const result = getUserSession();
//     console.log("session Result",result);
//     // if (!result.isOk) {
//     //   notify(result.data, 'error', 2000);
//     // }
//     // getUserSession()
//     //   .then(session => {
//     //     console.log('Session:', session);
//     //   })
//   }, []);
    function submit() {
             dispatch(TraceMatrixReset([]));   // Reset the probe metrics data state.

            // Set the properties with Results suffix to be display as search result filters.
            changeStateValue("sourceProbeIdResults", mockDataRequestFilters.sourceProbeId);
            changeStateValue("destinationIdsResults", mockDataRequestFilters.destinationIds);
            // changeStateValue("startDateResults", dateFormat(new Date(mockDataRequestFilters.startTime), "ddd mmm dd yyyy h:MM:ss TT Z"));
            // changeStateValue("endDateResults", dateFormat(new Date(mockDataRequestFilters.endTime), "ddd mmm dd yyyy h:MM:ss TT Z"));

            changeStateValue("startDateResults", mockDataRequestFilters.startTime);
            changeStateValue("endDateResults", mockDataRequestFilters.endTime);

            // Set the data request filters to be sent to the back-end.
            // let dataRequestFilters = {
            //     sourceProbeId: dataRequestFiltersState.sourceProbeId,
            //     destinationProbeId: "",
            //     checkType: "TraceRt",
            //     startTime: dataRequestFiltersState.startDate,
            //     endTime: dataRequestFiltersState.endDate
            // }

            // GetTra

            // GetTraceMatricsDat(authstate.auth.idToken).then((response) => {
            //     dispatch(customerloadAction(response));
            //      setcustomers(response);
            //     // const state = store.getState();
            //     // console.log("current stat",state);
            // });
            GetTraceMatricsData(mockDataRequestFilters).then((response) => {
                // let data = [];
                // data = path.MatrixData;
                // let actdata = [];
                // actdata = data.push(response);
                // console.log("actdata",actdata);
                dispatch(TraceMatrixLoad(response));
                setmetricsData(response);
            });
            // for (let destination of dataRequestFiltersState.destinationIds) {
            //     dataRequestFilters.destinationProbeId = destination;
            //    getProbeMetrics(readProbeMetricsData, dataRequestFilters);
            // }
    }
   // const pageContainerStyle = usePageContainerStyles();
    return (

        <React.Fragment>

<div className={'responsive-paddings-new'}>
            <StatusHeader props={custstate} />
            </div>

            <h2 className={'content-block'}>Path Per Probe</h2> 

            <div className={'content-block dx-card-new responsive-paddings-new row__fromdate'}>
                 <ProbesTestHeader checkType = "TraceRt" />  
            </div>

            { showresult && <div className={'responsive-paddings-new'}> <Grid item xs={12} style={{ marginTop: '1em' }}>
                <div className="m-portlet m-portlet--head-sm ">
                <div class="m-portlet__head">
                    <div class="m-portlet__head-caption">
                        <div class="m-portlet__head-title">
                            <h4 class="m-portlet__head-text" style={{ fontWeight : '400', fontSize: '16px'}} >Showing results for </h4>
                        </div>
                        </div>
                </div>
                <div class="m-portlet__body">
                <Grid container>
                    <Grid item xs={12} style={{ marginBottom: '1em', marginLeft: '2em' }}>
                        <p style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}> Source Probe: </p>
                        <Chip label={path.MatrixDataRequestFiltersState.sourceProbeIdResults} />
                        <br />
                        <p style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}> Destination Probe(s): </p>
                        {path.MatrixDataRequestFiltersState.destinationIdsResults && path.MatrixDataRequestFiltersState.destinationIdsResults.map((destination, index) =>
                            <Chip key={index} label={destination} />
                        )}
                        <br />
                        <p style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}> Start Date: </p>
                        <Chip label={path.MatrixDataRequestFiltersState.startDate} />
                        <br />
                        <p style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}> End Date: </p>
                        <Chip label={path.MatrixDataRequestFiltersState.endDate} />
                    </Grid>
                </Grid>
                </div>
                </div>
            </Grid> </div> }

            {/* { !showresult && <div className={'responsive-paddings-new'}>
                    <h4 class="m-portlet__head-text" style={{ fontWeight : '400', fontSize: '16px', textAlign: 'center'}} > No Data </h4>
                </div>} */}

{ path.MatrixData.length !== 0 && !showresult && <div className={'responsive-paddings-new'}> <Grid item xs={12} style={{ marginTop: '1em' }}>
                <div className="m-portlet m-portlet--head-sm">
                <div class="m-portlet__head">
                    <div class="m-portlet__head-caption">
                        <div class="m-portlet__head-title">
                            <h4 class="m-portlet__head-text" style={{ fontWeight : '400', fontSize: '16px'}} > No data available for </h4>
                        </div>
                        </div>
                </div>
                <div class="m-portlet__body">
                <Grid container>
                    {/* <Grid item xs={12} style={{ marginBottom: '1em', marginLeft: '2em' }}>
                        <p className="header1-style" style={{textAlign: 'left'}}>Showing results for: </p>
                    </Grid> */}
                    <Grid item xs={12} style={{ marginBottom: '1em', marginLeft: '2em' }}>
     
                        {path.MatrixData.length !== 0 && path.MatrixData.map((dataSet, index) => {
                       if (Object.keys(dataSet[0])[0] == "destinationIdWithNoData") {
                        return (
                            //<div>
                            <p class="m-badge m-badge--secondary m-badge--wide pade" >{path.MatrixDataRequestFiltersState.sourceProbeIdResults} &#8594; {dataSet[0].destinationIdWithNoData}.</p>
                            //</div>
                            
                            // <Chip key={index} label={dataSet[0].destinationIdWithNoData} /> )
                        )
                       }
                        })}

                    </Grid>
                </Grid>
                </div>
                </div>
            </Grid> </div> }

            {path.MatrixData && path.MatrixData.length !== 0 &&
                        <PathTraceDiagram
                            sourceProbeId={path.MatrixDataRequestFiltersState.sourceProbeIdResults}
                            metricsData={path.MatrixData}
                        />
                    }

        </React.Fragment>

//             <Grid container  justifyContent="flex-start" alignItems="flex-start" spacing={0}>
//                 <Grid item xs={12}>
//                     <StatusHeader props={custstate} />
//                 </Grid>
//                 <Col className="main-content">
 
//  <Card className="mt-5">
//      <Card.Header className="p-3 font-weight-semi d-flex align-items-center justify-content-between">
//      PATH PER PROBE
//          <Col xs={10} md={2}>
//          </Col>
//      </Card.Header>
//      <Card.Body>
//                     <Grid item xs={12}>
//                     <Paper className={classes.paper}>
//                          <ProbesTestHeader checkType = "TraceRt" />
//                     </Paper>
                     
//                 </Grid>
                
//                 {/* <Grid item xs={12}>
//                     <hr className="title-line" style={{ marginTop: -10, width: '100%' }} />
//                 </Grid> */}
//                 <br></br>
//                 { path.MatrixData.length !== 0 && <Grid item xs={12} style={{ marginTop: '1em' }}>
//                 <div className="m-portlet m-portlet--head-sm">
//                 <div class="m-portlet__head">
//                     <div class="m-portlet__head-caption">
//                         <div class="m-portlet__head-title">
//                             <h4 class="m-portlet__head-text" style={{ fontWeight : '400', fontSize: '16px'}}>Showing results for </h4>
//                         </div>
//                         </div>
//                 </div>
//                 <div class="m-portlet__body">
//                 <Grid container>
//                     {/* <Grid item xs={12} style={{ marginBottom: '1em', marginLeft: '2em' }}>
//                         <p className="header1-style" style={{textAlign: 'left'}}>Showing results for: </p>
//                     </Grid> */}
//                     <Grid item xs={12} style={{ marginBottom: '1em', marginLeft: '2em' }}>
//                         <p style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}><strong style={{ fontWeight: '700', lineHeight: '24px'}}>Source Probe: </strong></p>
//                         <Chip label={path.MatrixDataRequestFiltersState.sourceProbeIdResults} />
//                         <br />
//                         <p style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}><strong style={{ fontWeight: '700', lineHeight: '24px'}}>Destination Probe(s): </strong></p>
//                         {path.MatrixDataRequestFiltersState.destinationIdsResults && path.MatrixDataRequestFiltersState.destinationIdsResults.map((destination, index) =>
//                             <Chip key={index} label={destination} />
//                         )}
//                         <br />
//                         <p style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}><strong style={{ fontWeight: '700', lineHeight: '24px'}}>Start Date: </strong></p>
//                         <Chip label={path.MatrixDataRequestFiltersState.startDate} />
//                         <br />
//                         <p style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}><strong style={{ fontWeight: '700', lineHeight: '24px'}}>End Date: </strong></p>
//                         <Chip label={path.MatrixDataRequestFiltersState.endDate} />
//                     </Grid>
//                 </Grid>
//                 </div>
//                 </div>
//             </Grid> }
//                 <Grid item xs={12}>
//                     {path.MatrixData && path.MatrixData.length !== 0 &&
//                         <PathTraceDiagram
//                             sourceProbeId={path.MatrixDataRequestFiltersState.sourceProbeIdResults}
//                             metricsData={path.MatrixData}
//                         />
//                     }
//                 </Grid>

//      </Card.Body>
//  </Card>

// {/* <Card className="mt-5">
//  <Card.Header className="p-3 font-weight-semi d-flex align-items-center justify-content-between">
//      RECEVENT EVENTS
//  </Card.Header>
//  <Card.Body>
//      <ProbesEvent />
//  </Card.Body>
// </Card> */}

// </Col>
// </Grid>
        
      );
}
