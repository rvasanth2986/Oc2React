import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import DropDownBox from 'devextreme-react/drop-down-box';
import { List } from 'devextreme-react/list';
import DateBox from 'devextreme-react/date-box';
import { SettingsEthernetRounded } from "@material-ui/icons";
import { ButtonBase, Grid } from '@material-ui/core';
import { Button } from "@material-ui/core";
import {
    Card,
    Row,
    Col,
    FormControl,
    InputGroup,
  } from "react-bootstrap";
import { DataFilterChange, TraceMatrixLoad, TraceMatrixReset } from "../../store/actions/TraceDiagramAction";
import { GetTraceMatricsData } from "../../services/TraceMatricsDataService";
import { SelectBox } from "devextreme-react";
import dateFormat from 'dateformat';

// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import { LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
// import Box from '@mui/material/Box';

const ProbesTestHeader = ({checkType}) => {
    const custstate = useSelector((state) => state.cust);
    const pathstate = useSelector((state) => state.path);
    const [SProbesData, setSProbesData] = useState([]);
    const [DProbesData, setDProbesData] = useState([]);
    const [SelectedSourceProbes,setSelectedSourceProbes]= useState("");
    const [SelectedDestProbes,setSelectedDestProbes]= useState([]);
    const[startValue,setstartValue]=useState("");
    const[endValue,setendValue]=useState("");
    const dispatch = useDispatch();

    //const [value, setValue] = React.useState<DateRange<Date>>([null, null]);

    const mockDataRequestFilters = {
        sourceProbeId: "5940",
        destinationProbeId: "ddev-vpc-us-west-2",
        checkType: "TraceRt",
        startTime: "2022-03-15T18:30:00Z",
        endTime: "2022-03-28T18:30:00Z"
    }

    useEffect(() => {
        dispatch(TraceMatrixReset([])); 
        setstartValue(new Date());
        setendValue(new Date());
        // this.minChangeHandler = this.minChangeHandler.bind(this);
        // this.maxChangeHandler = this.maxChangeHandler.bind(this);
        
        if (custstate.probes.length >0) {
            let SProbData = [];
              let DProbeData = [];
            custstate.probes.map((data)=> {
                    if (data.ptype=="probe"){
                        SProbData.push({
                            "probeId":data.probeId,
                            "probeName": data.probeName
                        });
                    }
                    if (data.ptype=="destination"){
                        DProbeData.push(data);
                    }
            } );
            //loadprobes(dispatch,ProbData);
            setSProbesData(SProbData);
            setDProbesData(DProbeData);
         
          
        }
        else{
            let SProbData = [];
            let DProbeData = [];
            setSProbesData(SProbData);
            setDProbesData(DProbeData);
         
        }
       
    },[custstate.probes]);
    

    const handleChange = evt => {   
        console.log("change Source evt",evt);
        let newValue = evt.value;
        console.log("change Source",newValue);
        setSelectedSourceProbes(newValue);
        changeStateValue("sourceProbeId",newValue);
        
        }

    const selectedSource= React.useCallback((e)=>
    {
        
        let SelectedSourceList=[];
        if ( e.addedItems.length>0){
            SelectedSourceList.push({ value: e.addedItems[0].probeId});
            setSelectedSourceProbes(SelectedSourceList);
        }
        else{
            SelectedSourceList.push({ value: ""});
            setSelectedSourceProbes(SelectedSourceList);
        }
      
    })

    const selectedDestination= React.useCallback((e)=>
    {
        // let SelectedDestinationList=[];
        // if ( e.addedItems.length>0){
        // e.addedItems.map((data)=>{
        //     SelectedDestinationList.push({value:data.probeId});
        // })
        // setSelectedDestProbes(SelectedDestinationList);
        // }
        // else{
        //     SelectedDestinationList.push({value:""});
        //     setSelectedDestProbes(SelectedDestinationList);
        // }
    })
    let desproblist="";
    const onSelectedItemKeysChange= React.useCallback((args)=> {
        if (args.name === 'selectedItemKeys') {
        //     desproblist="";
        //   args.value.map((data)=>{
        //         desproblist = desproblist+"," + data.probeId;
        //   })
        //   desproblist=desproblist.substring(1);
        //   setSelectedDestProbes(desproblist);
        let SelectedDestinationList=[];
        if ( args.value.length>0){
            args.value.map((data)=>{
            SelectedDestinationList.push(data.probeId);
        })
        setSelectedDestProbes(SelectedDestinationList);
        changeStateValue("destinationIds",SelectedDestinationList);
        }
        else{
            changeStateValue("destinationIds",[]);
            SelectedDestinationList.push("");
            setSelectedDestProbes(SelectedDestinationList);
        }
        }
      })

    const minChangeHandler = React.useCallback((e)=>{
        setstartValue(e.value );
        console.log("styart date",(new Date(e.value)).setHours(0,0,0));
        const startDate_ISO8601 = dateFormat((e.value).setHours(0,0,0), "isoUtcDateTime");
        //const endDate_ISO8601 = dateFormat(endDateObj, "isoUtcDateTime");

        changeStateValue("startDate", startDate_ISO8601);
       // changeStateValue("endDate", endDate_ISO8601)
    }) 
    const maxChangeHandler = React.useCallback((e)=>{
        setendValue(e.value );
        let data = new Date(new Date(new Date(e.value).setDate(new Date(e.value).getDate() + 1)).setHours(0,0,0)).toLocaleString();
        const endDate_ISO8601 = dateFormat(new Date(data), "isoUtcDateTime");
        changeStateValue("endDate", endDate_ISO8601)
    }) 

    function changeStateValue(fieldName, newValue) {
        dispatch(DataFilterChange(fieldName, newValue));
    }

    function submit() {
        dispatch(TraceMatrixReset([]));   // Reset the probe metrics data state.

       // Set the properties with Results suffix to be display as search result filters.
       changeStateValue("sourceProbeIdResults", pathstate.MatrixDataRequestFiltersState.sourceProbeId);
       changeStateValue("destinationIdsResults", pathstate.MatrixDataRequestFiltersState.destinationIds);
      
    //    changeStateValue("startDateResults", dateFormat(new Date(pathstate.MatrixDataRequestFiltersState.startTime), "ddd mmm dd yyyy h:MM:ss TT Z"));
    //    changeStateValue("endDateResults", dateFormat(new Date(pathstate.MatrixDataRequestFiltersState.endTime), "ddd mmm dd yyyy h:MM:ss TT Z"));

    //    changeStateValue("startDateResults", mockDataRequestFilters.startTime);
    //    changeStateValue("endDateResults", mockDataRequestFilters.endTime);

      // Set the data request filters to be sent to the back-end.
       let dataRequestFilters = {
           sourceProbeId: pathstate.MatrixDataRequestFiltersState.sourceProbeId,
           destinationProbeId: "",
           checkType: checkType,
           startTime: pathstate.MatrixDataRequestFiltersState.startDate,
           endTime: pathstate.MatrixDataRequestFiltersState.endDate
       }

       // GetTra

       // GetTraceMatricsDat(authstate.auth.idToken).then((response) => {
       //     dispatch(customerloadAction(response));
       //      setcustomers(response);
       //     // const state = store.getState();
       //     // console.log("current stat",state);
       // });
    //    GetTraceMatricsData(dataRequestFilters).then((response) => {
    //        // let data = [];
    //        // data = path.MatrixData;
    //        // let actdata = [];
    //        // actdata = data.push(response);
    //        // console.log("actdata",actdata);
    //        dispatch(TraceMatrixLoad(response));
    //       // setmetricsData(response);
    //    });
       for (let destination of pathstate.MatrixDataRequestFiltersState.destinationIds) {
           dataRequestFilters.destinationProbeId = destination;
           GetTraceMatricsData(dataRequestFilters).then((response) => {
            dispatch(TraceMatrixLoad(response));
        });
       }
}
 
        return (
            <div class="path-header">
                {/* <p className='title-font' style={{ paddingTop: '0.75em', paddingBottom:'0.75em'  }} >PATH PER PROBE</p> */}

                <div className={'row'}>
                    <div class="col-md-3">
                        <SelectBox dataSource={SProbesData}
                                    placeholder="Select a source probe..."
                                    displayExpr="probeName"
                                    valueExpr="probeId"
                                    value = {pathstate.MatrixDataRequestFiltersState.sourceProbeId}
                                    searchEnabled={true}
                                    showClearButton={true}
                                    showDropDownButton={true}
                                    onValueChanged={handleChange}
                                    />
                    </div>
                    <div class="col-md-3">
                    <DropDownBox
                            value={SelectedDestProbes}
                            valueExpr="probeId"
                            displayExpr="probeName"
                            placeholder="Select a destination probe..."
                            showClearButton={false}
                            dataSource={DProbesData}
                            //   onValueChanged={this.syncTreeViewSelection}
                            //   onOptionChanged={this.onTreeBoxOpened}
                            //   contentRender={this.treeViewRender}
                            >
                                <List
                                dataSource={DProbesData}
                                value={SelectedDestProbes}
                                valueExpr="probeId"
                                displayExpr="probeName"
                                selectionMode="all"
                                showSelectionControls={true}
                                onSelectionChanged={selectedDestination}
                                onOptionChanged={onSelectedItemKeysChange}
                            />
                                </DropDownBox>
                    </div>

                    {/* <div class="col-md-2">
                        <MobileDateRangePicker
                            startText="Mobile start"
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                            renderInput={(startProps, endProps) => (
                            <React.Fragment>
                                <TextField {...startProps} />
                                <DateRangeDelimiter> to </DateRangeDelimiter>
                                <TextField {...endProps} />
                            </React.Fragment>
                            )}
                        />
                    </div> */}

                    <div class="col-md-3">
                    <div class=" dx-fieldset d-flex align-items-center">
                    <div class="dx-field-label"> From Date :</div>
                    <div class="dx-field-value">
                    <DateBox
                            width={400}
                            value={startValue}
                            max={endValue}
                            onValueChanged={minChangeHandler}
                        />
                    </div>
                    </div>
                    {/* From Date : <DateBox
                            width={400}
                            value={startValue}
                            max={endValue}
                            onValueChanged={minChangeHandler}
                        /> */}
                    </div>
                    <div class="col-md-2">
                    <div class="dx-fieldset d-flex align-items-center">
                    <div class="dx-field-label"> To Date :</div>
                    <div class="dx-field-value">
                    <DateBox
                                    value={endValue}
                                    width={400}
                                    // max={startValue}
                                    min={startValue}
                                    onValueChanged={maxChangeHandler}
                                />
                    </div>
                    </div>
                    {/* To Date:
                            <DateBox
                                    value={endValue}
                                    width={400}
                                    // max={startValue}
                                    min={startValue}
                                    onValueChanged={maxChangeHandler}
                                /> */}
                        </div>
                        <div class="col-md-1">
                        <Button onClick = {submit} variant="contained" color="primary" > Submit </Button>
                        </div>
                </div>

                {/* <Grid container justifyContent="center" alignItems="center" spacing={3}>
                
                    <Grid item xs={12} sm={6} md={3}>

                        <SelectBox dataSource={SProbesData}
                                placeholder="Select a source probe..."
                                displayExpr="probeName"
                                valueExpr="probeId"
                                value = {pathstate.MatrixDataRequestFiltersState.sourceProbeId}
                                searchEnabled={true}
                                showClearButton={true}
                                showDropDownButton={true}
                                onValueChanged={handleChange}
                                 />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <DropDownBox
                            value={SelectedDestProbes}
                            width={500}
                            valueExpr="probeId"
                            displayExpr="probeName"
                            placeholder="Select a destination probe..."
                            showClearButton={false}
                            dataSource={DProbesData}
                            //   onValueChanged={this.syncTreeViewSelection}
                            //   onOptionChanged={this.onTreeBoxOpened}
                            //   contentRender={this.treeViewRender}
                            >
                                <List
                                dataSource={DProbesData}
                                value={SelectedDestProbes}
                                valueExpr="probeId"
                                displayExpr="probeName"
                                selectionMode="all"
                                showSelectionControls={true}
                                onSelectionChanged={selectedDestination}
                                onOptionChanged={onSelectedItemKeysChange}
                            />
                                </DropDownBox>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                       From Date : <DateBox
                            width={400}
                            value={startValue}
                            max={endValue}
                            onValueChanged={minChangeHandler}
                        />
                        
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                           To Date:
                            <DateBox
                                    value={endValue}
                                    width={400}
                                    // max={startValue}
                                    min={startValue}
                                    onValueChanged={maxChangeHandler}
                                />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                    <Button onClick = {submit} variant="contained" color="primary" > Submit </Button>
                    </Grid>
                </Grid>
                 */}
          </div>
        );
      

}

export default ProbesTestHeader