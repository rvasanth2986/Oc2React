import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { getRegionsProbesByCustomer } from "../../services/CustomerServcie";
import { Grid } from '@material-ui/core';
// import { usePageContainerStyles } from "../utils/usePageContainerStyles";
import {
    Button,
    Card,
    Row,
    Col,
    FormControl,
    InputGroup,
  } from "react-bootstrap";
import DataGrid, {
    Column,
    Editing,
    Texts,
    Popup,
    Paging,
    Lookup,
    Form,
    Summary,FilterRow,SearchPanel, HeaderFilter,
    Grouping, ColumnChooser, LoadPanel, Toolbar,TotalItem,Item, PatternRule, RequiredRule
  } from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
// import {probesGridData, states} from '../SampleDataSet/probesgrid';
import ProbesConfigReducer from "../../store/reducers/ProbesConfigReducer";
// import { saveChange,loadprobes } from "../store/actions/ProbesConfigAction";
import { saveChange,saveProbesChange } from "../../store/actions/CustomerAction";
// import { FETCH_SUCCESS,FETCH_PENDING,FETCH_ERROR } from "../../store/actions/ProbesConfigAction";
// import { Validator } from "devextreme-react";
const notesEditorOptions = { height: 50 };


export default function ProbesRegionConfigComponent (){
    const [ptypesData, setptypesData] = useState([]);
    const [ProbesData, setProbesData] = useState([]);
    const authstate = useSelector((state) => state.auth);
    const custstate = useSelector((state) => state.cust);
    const [SelectedCustID, setSelectedCustID] = useState(custstate.selectedCustomer);
    // const pageContainerStyle = usePageContainerStyles();
    const dispatch = useDispatch();
    console.log("Custstate",custstate);
    //const [state, dispatch] = React.useReducer(ProbesConfigReducer, ProbesState);
    let ProbData = [];
    let ptypeData =[];
   
    useEffect(() => {
        ptypeData.push({type:"probe"});
        ptypeData.push({type:"destination"});
        setptypesData(ptypeData);
        if (custstate.selectedCustomer && custstate.selectedCustomer !== "" && custstate.regions.length>0 ) {
            console.log(custstate.regions);
            
            custstate.regions.map((data)=> {
                data.probes.map((prob)=>{
                    ProbData.push({
                        region : data.region,
                        regionId : data.regionId,
                        name : prob.name,
                        probeId: prob.probeId,
                        localIP: prob.localIP,
                        natIP:prob.natIP,
                        customer:prob.customer
                        
                    });
                })
                
            } );
            //loadprobes(dispatch,ProbData);
            setProbesData(ProbData);
          
        }
       
    },[custstate]);
    
    const  onRowValidating = React.useCallback((e) => {
        if (custstate.regions.filter(x=> x.region == e.newData.region).length>0){
                // alert("Region name exist! please try different name...");
                e.errorText = `Region name already exist! please try different name...`;
                e.isValid = false;
                return;
        }
        else{
            e.errorText = ``;
                e.isValid = true;
                return;
        }
       
      });

      const onSaving = React.useCallback((e) => {
        e.cancel = true;
        
        console.log(e.changes[0]);
        if (e.changes[0].type=="insert"){
            const insertdata = {
                "customerId":custstate.selectedCustomer,
                "description": e.changes[0].data.description,
                "regionName": e.changes[0].data.region
            };
            saveChange(dispatch, e.changes[0],insertdata, authstate.auth.idToken).then((response)=>{
                console.log(response);
                e.promise =true;
                e.component.cancelEditData();
            });
        }
        if (e.changes[0].type=="update"){
            let desc='';
            let reg='';
            if (e.changes[0].data.description == undefined){
                 desc= e.changes[0].key.description;
            }
            else{
                 desc= e.changes[0].data.description;
            }
            if (e.changes[0].data.region == undefined){
                reg= e.changes[0].key.region;
           }
           else{
                reg= e.changes[0].data.region;
           }
            
            const insertdata = {
                "customerId":custstate.selectedCustomer,
                 "description": desc,
                 "pregion_old": e.changes[0].key.region,
                 "pregion_new": reg
            };
            saveChange(dispatch, e.changes[0],insertdata, authstate.auth.idToken).then((response)=>{
                console.log(response);
                e.promise =true;
                e.component.cancelEditData();
            });
        }
        if(e.changes[0].type=="remove"){
            let regID= e.changes[0].key.regionId;
            let custID= custstate.selectedCustomer;
            const deletedata = {
                "customerId":custID,
                "regionId": regID
            };
            saveChange(dispatch, e.changes[0],deletedata, authstate.auth.idToken).then((response)=>{
                console.log(response);
                e.promise =true;
               // e.component.cancelEditData();
            });
        }
       
      });
    //   const RowInserted= React.useCallback((e)=>{
    //     console.log(e);
    //   });

    //   const onSaved = React.useCallback((e)=>{
    //     console.log(e);
    //   });

      const onSavingProbesConfig=React.useCallback((e)=> {
        e.cancel = true;
        
        console.log(e.changes[0]);
        if (e.changes[0].type=="insert"){
            const insertdata = {
                "customerId":custstate.selectedCustomer,
                "probeId":e.changes[0].data.probeId,
                "probeName":e.changes[0].data.probeName,
                "localIP":e.changes[0].data.localIP,
                "natIP":e.changes[0].data.natIP,
                "pregion":e.changes[0].data.pregion,
                "ptype":e.changes[0].data.ptype
            };
            saveProbesChange(dispatch, e.changes[0],insertdata, authstate.auth.idToken).then((response)=>{
                console.log(response);
               });
            e.promise =true;
            e.component.cancelEditData();
        }
        if (e.changes[0].type=="update"){
            const insertdata = {
                "customerId":custstate.selectedCustomer,
                "probeId":e.changes[0].key.probeId,
                "probeName": (e.changes[0].data.probeName == undefined) ? e.changes[0].key.probeName : e.changes[0].data.probeName,
                "localIP":(e.changes[0].data.localIP == undefined) ? e.changes[0].key.localIP: e.changes[0].data.localIP,
                "natIP": (e.changes[0].data.natIP == undefined) ? e.changes[0].key.natIP: e.changes[0].data.natIP,
                "pregion":(e.changes[0].data.pregion == undefined) ? e.changes[0].key.pregion:e.changes[0].data.pregion,
                "ptype": (e.changes[0].data.ptype == undefined) ? e.changes[0].key.ptype: e.changes[0].data.ptype
            };
            saveProbesChange(dispatch, e.changes[0],insertdata, authstate.auth.idToken).then((response)=>{
                console.log(response);
               });
            e.promise =true;
            e.component.cancelEditData();
        }
        if(e.changes[0].type=="remove"){
            let Probid= e.changes[0].key.probeId;
            let custID= custstate.selectedCustomer;
            const deletedata = {
                "customerId":custID,
                "probeId": Probid
            };
            saveProbesChange(dispatch, e.changes[0],deletedata, authstate.auth.idToken).then((response)=>{
                console.log(response);
                e.promise =true;
               // e.component.cancelEditData();
            });
        }
      });

      const RemoveRegion = React.useCallback((e)=>{
        e.cancel = true;
        console.log(e.changes[0]);
       
        e.promise =true;
        e.component.cancelEditData();   
      });

        return (

           <React.Fragment>

<div className={'responsive-paddings-new'}> <Grid item xs={12} style={{ marginTop: '1em' }}>
                <div className="m-portlet m-portlet--head-sm">
                <div class="m-portlet__head">
                    <div class="m-portlet__head-caption">
                        <div class="m-portlet__head-title">
                            <h4 class="m-portlet__head-text" style={{ fontWeight : '400', fontSize: '16px'}} > Regions & Data Center Config </h4>
                        </div>
                        </div>
                </div>
                <div class="m-portlet__body">
                <DataGrid
          className={'dx-card-new wide-card'}
          dataSource={custstate.regions}
          showBorders={false}
          columnAutoWidth={true}
          columnHidingEnabled={true}
          onSaving={onSaving}
          onRowValidating={onRowValidating}
        >
            <LoadPanel enabled />
            <Toolbar>
            <Item name='addRowButton' showText='always' caption="Add Probes & DC" />
            </Toolbar>
          <Paging enabled={true} defaultPageSize={10} />
          {/* <Pager showPageSizeSelector={true} showInfo={true} /> */}
          <Editing
                                      
                                      mode="popup"
                                      allowUpdating={true}
                                      allowAdding={true}
                                      allowDeleting={true}
                                      showColumnLines={true}
                                      showRowLines={true}
                                      showBorders={true}
                                      rowAlternationEnabled={true}
                                      onRowRemoving ={RemoveRegion}
                                     //  onSaving={UpdateProbes}
                                      // onRowUpdated={RowUpdated()}
                                      >
                                      <Texts addRow="Add New Probes & Dcs" />
                                      <Popup title="Add Probes & DC" showTitle={true} width={700} height={250} />
                                      <Form>
                                      <Item itemType="group" colCount={2} colSpan={2}>
                                          <Item dataField="region" allowEditing={false} />
                                          <Item dataField="description" />
                                          <Item dataField="regionId" visible={false}></Item>
                                      </Item>
                                      </Form>
                                  </Editing>
                                  <SearchPanel visible={true} />
                                    <HeaderFilter visible={true} />

                                    <FilterRow visible={true} />


          <Column dataField={'region'}  caption="Region/DC Name"  hidingPriority={1} />
          <Column
            dataField={'description'}
            caption={'Description'}
            hidingPriority={0}
          />
            <Summary>
                                        <TotalItem
                                        column="region"
                                        summaryType="count" />
                                    </Summary>
        </DataGrid>
                </div>
                </div>
            </Grid> </div>
       

            <div className={'responsive-paddings-new'}> <Grid item xs={12} style={{ marginTop: '1em' }}>
                <div className="m-portlet m-portlet--head-sm">
                <div class="m-portlet__head">
                    <div class="m-portlet__head-caption">
                        <div class="m-portlet__head-title">
                            <h4 class="m-portlet__head-text" style={{ fontWeight : '400', fontSize: '16px'}} > Probes Config </h4>
                        </div>
                        </div>
                </div>
                <div class="m-portlet__body">
                <DataGrid
          className={'dx-card-new wide-card'}
          dataSource={custstate.probes}
          showBorders={false}
          columnAutoWidth={true}
          columnHidingEnabled={true}
          onSaving={onSavingProbesConfig}
          onRowValidating={onRowValidating}
        >
            <LoadPanel enabled />
                               <Toolbar>
                                    <Item name='addRowButton' showText='always' caption="Probes Config" />
                                   </Toolbar>
                                 <Paging enabled={true} defaultPageSize={10}  />
                                    <Editing
                                        mode="popup"
                                        allowUpdating={true}
                                        allowAdding={true}
                                        allowDeleting={true}
                                        showColumnLines={true}
                                        showRowLines={true}
                                        showBorders={true}
                                        rowAlternationEnabled={true}>
                                        <Texts addRow="Add New Probes" />
                                        <Popup title="Probes Config" showTitle={true} width={700} height={525} />
                                        <Form>
                                        <Item itemType="group" colCount={2} colSpan={2}>
                                            <Item dataField="probeId" />
                                            <Item dataField="probeName" />
                                            <Item dataField="pregion" >
                                             <Lookup dataSource={custstate.regions} valueExpr="region" displayExpr="region" />
                                            </Item>
                                            <Item dataField="localIP" />
                                            <Item dataField="natIP" />
                                          
                                            <Item dataField="ptype">
                                                <Lookup dataSource={ptypesData} valueExpr="type" displayExpr="type" ></Lookup>
                                            </Item>
                                        </Item>
                                        </Form>
                                    </Editing>
                                   <SearchPanel visible={true} />
                                    <HeaderFilter visible={true} />

                                    <FilterRow visible={true} />
          <Column dataField={'probeId'}  caption="Probe ID"  hidingPriority={1} />
          <Column dataField={'probeName'} caption={'Probe Name'} hidingPriority={0} />
          <Column dataField={'pregion'} caption={'Region'} hidingPriority={0} >
                 <Lookup dataSource={custstate.regions} valueExpr="region" displayExpr="region" /> 
          </Column>
          <Column cellRender={InfoRender} allowSorting={false} caption ="Details" /> 
        <Column cellRender={DownloadRender} allowSorting={false} caption ="Config" />
        <Column dataField="ptype">
                    <Lookup dataSource={ptypesData} valueExpr="type" displayExpr="type" ></Lookup>
        </Column>
        <Column dataField="localIP" caption="localIP" visible={false} >

    
        <PatternRule
            message={'You have entered an invalid Ip Address format!'}
            pattern={/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/}
            />
    
                </Column>
        <Column dataField="natIP" caption="natIP" visible={false} >
        <PatternRule
            message={'You have entered an invalid Ip Address format!'}
            pattern={/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/}
            />
            </Column>
            <Summary> <TotalItem column="probeId" summaryType="count" /> </Summary>
        </DataGrid>
                </div>
                </div>
            </Grid> </div>

           </React.Fragment>
                // <Col className="main-content">
    
                //     <Card className="mt-5">
                //         <Card.Header className="p-3 font-weight-semi d-flex align-items-center justify-content-between">
                //         REGIONS & Data Center Config
                //         </Card.Header>
                //         <Card.Body>
                    
                //     <div className="row">
                //         <div className="col-lg-12">
                           
                                
                //                 <div id="data-grid-demo">
                //                     <DataGrid
                //                     dataSource={custstate.regions}
                //                    // keyExpr="regionId"
                //                     showBorders={true}
                //                     onSaving={onSaving}
                //                     onRowValidating={onRowValidating}
                //                     // onSaved={onSaved}
                //                     // onRowInserted ={RowInserted}
                //                     //onRowRemoved={RemoveRegion}
                                    
                //                     >
                //                         <LoadPanel enabled />
                //                     <Toolbar>
                //                         <Item name='addRowButton' showText='always' caption="Add Probes & DC" />
                //                     </Toolbar>
                //                     <Paging enabled={true} defaultPageSize={10}  />
                //                     <Editing
                                      
                //                         mode="popup"
                //                         allowUpdating={true}
                //                         allowAdding={true}
                //                         allowDeleting={true}
                //                         showColumnLines={true}
                //                         showRowLines={true}
                //                         showBorders={true}
                //                         rowAlternationEnabled={true}
                //                         onRowRemoving ={RemoveRegion}
                //                        //  onSaving={UpdateProbes}
                //                         // onRowUpdated={RowUpdated()}
                //                         >
                //                         <Texts addRow="Add New Probes & Dcs" />
                //                         <Popup title="Add Probes & DC" showTitle={true} width={700} height={250} />
                //                         <Form>
                //                         <Item itemType="group" colCount={2} colSpan={2}>
                //                             <Item dataField="region" allowEditing={false} />
                //                             <Item dataField="description" />
                //                             <Item dataField="regionId" visible={false}></Item>
                //                         </Item>
                //                         </Form>
                //                     </Editing>
                //                     <SearchPanel visible={true} />
                //                     <HeaderFilter visible={true} />

                //                     <FilterRow visible={true} />
                //                     <Column dataField="region" caption="Region/DC Name"  />
                //                     <Column dataField="description" caption="Description" />
                //                     <Summary>
                //                         <TotalItem
                //                         column="region"
                //                         summaryType="count" />
                //                     </Summary>
                //                     </DataGrid>
                //                 </div>
                            
                //         </div>
                //     </div>
                //     <br></br>  

                //         </Card.Body>
                //     </Card>
    
                // <Card className="mt-5">
                //     <Card.Header className="p-3 font-weight-semi d-flex align-items-center justify-content-between">
                //         PROBES Config
                //     </Card.Header>
                //     <Card.Body>
                //     <div className="row">
                //         <div className="col-lg-12">
                            
                                
                //                 <div id="data-grid-demo">
                //                     <DataGrid
                //                     dataSource={custstate.probes}
                //                     // keyExpr="probeId"
                //                     showBorders={true}
                //                     onSaving={onSavingProbesConfig}
                //                     onRowValidating={onRowValidating}
                //                     >
                //                     <Toolbar>
                //                         <Item name='addRowButton' showText='always' caption="PROBES Config" />
                //                     </Toolbar>
                //                     <Paging enabled={true} defaultPageSize={10}  />
                //                     <Editing
                //                         mode="popup"
                //                         allowUpdating={true}
                //                         allowAdding={true}
                //                         allowDeleting={true}
                //                         showColumnLines={true}
                //                         showRowLines={true}
                //                         showBorders={true}
                //                         rowAlternationEnabled={true}>
                //                         <Texts addRow="Add New Probes" />
                //                         <Popup title="PROBES Config" showTitle={true} width={700} height={525} />
                //                         <Form>
                //                         <Item itemType="group" colCount={2} colSpan={2}>
                //                             <Item dataField="probeId" />
                //                             <Item dataField="probeName" />
                //                             <Item dataField="pregion" >
                //                              <Lookup dataSource={custstate.regions} valueExpr="region" displayExpr="region" />
                //                             </Item>
                //                             <Item dataField="localIP" />
                //                             <Item dataField="natIP" />
                //                             {/* <Item dataField="customerId" /> */}

                                            
                //                             <Item dataField="ptype">
                //                                 <Lookup dataSource={ptypesData} valueExpr="type" displayExpr="type" ></Lookup>
                //                             </Item>
                //                             {/* 
                //                             <Item
                //                             dataField="Notes"
                //                             editorType="dxTextArea"
                //                             colSpan={2}
                //                             editorOptions={notesEditorOptions} /> */}
                //                         </Item>
        
                //                         {/* <Item itemType="group" caption="Home Address" colCount={2} colSpan={2}>
                //                             <Item dataField="StateID" />
                //                             <Item dataField="Address" />
                //                         </Item> */}
                //                         </Form>
                //                     </Editing>
                //                     <SearchPanel visible={true} />
                //                     <HeaderFilter visible={true} />

                //                     <FilterRow visible={true} />
                //                     <Column dataField="probeId" caption="Probe ID" />
                //                     <Column dataField="probeName" caption="Probe Name" />
                //                     <Column dataField="pregion" caption="Region" >
                //                      <Lookup dataSource={custstate.regions} valueExpr="region" displayExpr="region" />
                //                     </Column>
                //                     <Column cellRender={InfoRender} allowSorting={false} caption ="Details" /> 
                //                     <Column cellRender={DownloadRender} allowSorting={false} caption ="Config" />
                //                     <Column dataField="ptype">
                //                                 <Lookup dataSource={ptypesData} valueExpr="type" displayExpr="type" ></Lookup>
                //                     </Column>
                //                     <Column dataField="localIP" caption="localIP" visible={false} >
                         
                               
                //                     <PatternRule
                //                         message={'You have entered an invalid Ip Address format!'}
                //                         pattern={/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/}
                //                         />
                              
                //                          </Column>
                //                     <Column dataField="natIP" caption="natIP" visible={false} >
                //                     <PatternRule
                //                         message={'You have entered an invalid Ip Address format!'}
                //                         pattern={/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/}
                //                         />
                //                         </Column>
                //                     {/* <Column dataField="BirthDate" dataType="date" />
                //                     <Column dataField="Position" width={170} />
                //                     <Column dataField="HireDate" dataType="date" />
                //                     <Column dataField="StateID" caption="State" width={125}>
                //                         <Lookup dataSource={states} valueExpr="ID" displayExpr="Name" />
                //                     </Column>
                //                     <Column dataField="Address" visible={false} />
                //                     <Column dataField="Notes" visible={false} /> */}
                //                     <Summary>
                //                         <TotalItem
                //                         column="probeId"
                //                         summaryType="count" />
                //                     </Summary>
                //                     </DataGrid>
                //                 </div>
                            
                //         </div>
                //     </div>
                //     </Card.Body>
                // </Card>

                // </Col>
            

                              
                

           
              
          );
          function InfoRender(d) {
            return <a href="">Info</a> ;
          }
          function DownloadRender(d) {
            return <a href="">Download</a> ;
          }
}

