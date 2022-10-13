import React, { useCallback, useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { getRegionsProbesByCustomer } from "../../services/CustomerServcie";
import { downloadJson } from "../../services/ProbesConfigService"
import { Grid } from '@material-ui/core';
import { Toast } from 'devextreme-react/toast';
import { Popup as CustomPopup, Position, ToolbarItem } from 'devextreme-react/popup';
import DataGrid, {
    Column,
    Editing,
    Texts,
    Popup,
    Paging,
    Lookup,
    Form,
    Summary, FilterRow, SearchPanel, HeaderFilter,
    Grouping, ColumnChooser, LoadPanel, Toolbar, TotalItem, Item, PatternRule, RequiredRule
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import TextArea from "devextreme-react/text-area";
import ProbesConfigReducer from "../../store/reducers/ProbesConfigReducer";
import { saveChange, saveProbesChange } from "../../store/actions/CustomerAction";

const notesEditorOptions = { height: 50 };

export default function ProbesRegionConfigComponent() {
    const [ptypesData, setptypesData] = useState([]);
    const [ProbesData, setProbesData] = useState([]);
    const authstate = useSelector((state) => state.auth);
    const custstate = useSelector((state) => state.cust);
    const [SelectedCustID, setSelectedCustID] = useState(custstate.selectedCustomer);
    const [popupVisible, setpopupVisible] = useState(false);
    const [JsonText, setJsonText] = useState("");
    const dispatch = useDispatch();

    let ProbData = [];
    let ptypeData = [];

    const [toastConfig, setToastConfig] = useState({
        isVisible: false,
        type: 'info',
        message: '',
    });

    function notify(type, message) {

        setToastConfig({
            ...toastConfig,
            isVisible: true,
            type,
            message,
        });
    }

    function onHiding() {
        setToastConfig({
            ...toastConfig,
            isVisible: false,
        });
    }

    useEffect(() => {
        ptypeData.push({ type: "probe" });
        ptypeData.push({ type: "destination" });
        setptypesData(ptypeData);
        setpopupVisible(false);
        setJsonText('[{"Note" : "Type/Paste your Json here and tab out to beautify your JSON" }]')
        if (custstate.selectedCustomer && custstate.selectedCustomer !== "" && custstate.regions.length > 0) {
            console.log(custstate.regions);

            custstate.regions.map((data) => {
                data.probes.map((prob) => {
                    ProbData.push({
                        region: data.region,
                        regionId: data.regionId,
                        name: prob.name,
                        probeId: prob.probeId,
                        localIP: prob.localIP,
                        natIP: prob.natIP,
                        customer: prob.customer

                    });
                })

            });
            //loadprobes(dispatch,ProbData);
            setProbesData(ProbData);

        }

    }, [custstate]);

    const onRowValidating = useCallback((e) => {
        const type = e.oldData == undefined ? "insert" : "update";

        if (type == "insert") {
            if ((e.newData != undefined)) {
                if ((e.newData.region == undefined) || (e.newData.region.length <= 0)) {
                    e.errorText = `Region name missing!`;
                    e.isValid = false;
                    return;
                }

            }
        }
        if (type == "update") {
            if ((e.newData != undefined)) {
                if ((e.newData.region != undefined) && (e.newData.region.length <= 0)) {
                    e.errorText = `Region name missing!`;
                    e.isValid = false;
                    return;
                }

            }
        }
        if (custstate.regions.filter(x => x.region == e.newData.region).length > 0) {
            // alert("Region name exist! please try different name...");
            e.errorText = `Region name already exist! please try different name...`;
            e.isValid = false;
            return;
        }
        else {
            e.errorText = ``;
            e.isValid = true;
            return;
        }

    });


    const onSaving = useCallback((e) => {
        e.cancel = true;
        if (e.changes.length !== 0) {
            if (e.changes[0].type == "insert") {
                const insertdata = {
                    "customerId": custstate.selectedCustomer,
                    "description": e.changes[0].data.description,
                    "regionName": e.changes[0].data.region
                };
                saveChange(dispatch, e.changes[0], insertdata, authstate.auth.idToken).then((response) => {
                    console.log(response);
                    notify("success", "New Region added successfully!");
                    e.promise = true;
                    e.component.cancelEditData();
                });
            }
            if (e.changes[0].type == "update") {
                let desc = '';
                let reg = '';
                if (e.changes[0].data.description == undefined) {
                    desc = e.changes[0].key.description;
                }
                else {
                    desc = e.changes[0].data.description;
                }
                if (e.changes[0].data.region == undefined) {
                    reg = e.changes[0].key.region;
                }
                else {
                    reg = e.changes[0].data.region;
                }

                const insertdata = {
                    "customerId": custstate.selectedCustomer,
                    "description": desc,
                    "pregion_old": e.changes[0].key.region,
                    "pregion_new": reg
                };
                saveChange(dispatch, e.changes[0], insertdata, authstate.auth.idToken).then((response) => {
                    console.log(response);
                    notify("success", "Updated successfully!");
                    e.promise = true;
                    e.component.cancelEditData();
                });
            }
            if (e.changes[0].type == "remove") {
                let regID = e.changes[0].key.regionId;
                let custID = custstate.selectedCustomer;
                const deletedata = {
                    "customerId": custID,
                    "regionId": regID
                };
                saveChange(dispatch, e.changes[0], deletedata, authstate.auth.idToken).then((response) => {
                    console.log(response);
                    notify("success", "Delete process completed!");
                    e.promise = true;
                    // e.component.cancelEditData();
                });
            }
        }
        else {
            e.promise = true;
            notify("info", "No changes made!");
            e.component.cancelEditData();
        }


    });

    const onRowValidatingProbes = useCallback((e) => {
        const type = e.oldData == undefined ? "insert" : "update";

        if (type == "insert") {
            if ((e.newData != undefined)) {
                if ((e.newData.probeName == undefined) || (e.newData.probeName.length <= 0)) {
                    e.errorText = `Probes name missing!`;
                    e.isValid = false;
                    return;
                }

            }
        }
        if (type == "update") {
            if ((e.newData != undefined)) {
                if ((e.newData.probeName != undefined) && (e.newData.probeName.length <= 0)) {
                    e.errorText = `Probe name missing!`;
                    e.isValid = false;
                    return;
                }

            }
        }
        if (custstate.probes.filter(x => x.probeId == e.newData.probeId).length > 0) {
            e.errorText = `Probe ID already exist! please try different name...`;
            e.isValid = false;
            return;
        }

        if (custstate.probes.filter(x => x.probeName == e.newData.probeName).length > 0) {
            e.errorText = `Probe name already exist! please try different name...`;
            e.isValid = false;
            return;
        }

        e.errorText = ``;
        e.isValid = true;
        return;


    });


    const onSavingProbesConfig = useCallback((e) => {
        e.cancel = true;

        if (e.changes.length !== 0) {
            if (e.changes[0].type == "insert") {
                const insertdata = {
                    "customerId": custstate.selectedCustomer,
                    "probeId": e.changes[0].data.probeId,
                    "probeName": e.changes[0].data.probeName,
                    "localIP": e.changes[0].data.localIP,
                    "natIP": e.changes[0].data.natIP,
                    "pregion": e.changes[0].data.pregion,
                    "ptype": e.changes[0].data.ptype
                };
                saveProbesChange(dispatch, e.changes[0], insertdata, authstate.auth.idToken).then((response) => {
                    console.log(response);
                    notify("success", "New prob added successfully!");
                });
                e.promise = true;

                e.component.cancelEditData();
            }
            if (e.changes[0].type == "update") {
                const insertdata = {
                    "customerId": custstate.selectedCustomer,
                    "probeId": e.changes[0].key.probeId,
                    "probeName": (e.changes[0].data.probeName == undefined) ? e.changes[0].key.probeName : e.changes[0].data.probeName,
                    "localIP": (e.changes[0].data.localIP == undefined) ? e.changes[0].key.localIP : e.changes[0].data.localIP,
                    "natIP": (e.changes[0].data.natIP == undefined) ? e.changes[0].key.natIP : e.changes[0].data.natIP,
                    "pregion": (e.changes[0].data.pregion == undefined) ? e.changes[0].key.pregion : e.changes[0].data.pregion,
                    "ptype": (e.changes[0].data.ptype == undefined) ? e.changes[0].key.ptype : e.changes[0].data.ptype
                };
                saveProbesChange(dispatch, e.changes[0], insertdata, authstate.auth.idToken).then((response) => {
                    console.log(response);
                    notify("success", "Prob updated successfully!");
                });
                e.promise = true;
                e.component.cancelEditData();
            }
            if (e.changes[0].type == "remove") {
                let Probid = e.changes[0].key.probeId;
                let custID = custstate.selectedCustomer;
                const deletedata = {
                    "customerId": custID,
                    "probeId": Probid
                };
                saveProbesChange(dispatch, e.changes[0], deletedata, authstate.auth.idToken).then((response) => {
                    console.log(response);
                    notify("success", "Prob removed..!");
                    e.promise = true;
                    // e.component.cancelEditData();
                });
            }
        }
        else {
            e.promise = true;
            notify("info", "No changes made!");
            e.component.cancelEditData();
        }
    });

    const RemoveRegion = useCallback((e) => {
        e.cancel = true;
        console.log(e.changes[0]);

        e.promise = true;
        e.component.cancelEditData();
    });

    const handledownload = useCallback((e) => {
        event.preventDefault();
        downloadJson(authstate.auth.idToken, e.data.probeId, 'GET').then((response) => {
            console.log(response);
            if (response == null) {
                response = '{"message": "Unable to fetch data." }';
            }
            let myData = response;
            // create file in browser
            const fileName = "my-file";
            const json = JSON.stringify(myData, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const href = URL.createObjectURL(blob);

            // create "a" HTLM element with href to file
            const link = document.createElement("a");
            link.href = href;
            link.download = fileName + ".json";
            document.body.appendChild(link);
            link.click();

            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        });
    });

    const showJsonInfo = useCallback((d) => {
        event.preventDefault();
        setpopupVisible(true);

    });

    const prettyPrint = useCallback((e) => {
        try {
            var ugly = e.component._changedValue;
            var obj = JSON.parse(ugly);
            var pretty = JSON.stringify(obj, undefined, 4);
            setJsonText(pretty);
        }
        catch (e) {

        }

    });
    return (

        <React.Fragment>

            <div className={'responsive-paddings-new'}>
                <Grid item xs={12} style={{ marginTop: '1em' }}>
                    <div className="m-portlet m-portlet--head-sm">
                        <div class="m-portlet__head">
                            <div class="m-portlet__head-caption">
                                <div class="m-portlet__head-title">
                                    <h4 class="m-portlet__head-text" style={{ fontWeight: '400', fontSize: '16px' }} > Regions & Data Center Config </h4>
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
                                    onRowRemoving={RemoveRegion}
                                //  onSaving={UpdateProbes}
                                // onRowUpdated={RowUpdated()}
                                >
                                    <Texts addRow="Add Region" />
                                    <Popup title="Region Configuration" showTitle={true} width={700} height={300} />
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


                                <Column dataField={'region'} caption="Region/DC Name" hidingPriority={1} />
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
                        <Toast
                            visible={toastConfig.isVisible}
                            message={toastConfig.message}
                            type={toastConfig.type}
                            onHiding={onHiding}
                            displayTime={600}
                        />
                    </div>
                </Grid> </div>


            <div className={'responsive-paddings-new'}> <Grid item xs={12} style={{ marginTop: '1em' }}>
                <div className="m-portlet m-portlet--head-sm">
                    <div class="m-portlet__head">
                        <div class="m-portlet__head-caption">
                            <div class="m-portlet__head-title">
                                <h4 class="m-portlet__head-text" style={{ fontWeight: '400', fontSize: '16px' }} > Probes Config </h4>
                            </div>
                        </div>
                    </div>
                    <div class="m-portlet__body">
                        <CustomPopup
                            visible={popupVisible}
                            onHiding={() => setpopupVisible(false)}
                            dragEnabled={false}
                            hideOnOutsideClick={false}
                            showCloseButton={true}
                            showTitle={true}
                            title="Json Information"
                            container=".dx-viewport"
                            width={700} height={525}
                        >
                            <Position
                                at="center"
                            //my="center"
                            // of={this.state.positionOf}
                            />
                            <TextArea
                                id="txtprobesconfigJson"
                                height={400}
                                onValueChanged={prettyPrint}
                                onChange={prettyPrint}
                                // inputAttr="{Test Data}"
                                value={JsonText}
                                label="Config Json"
                            // maxLength={this.state.maxLength}
                            // defaultValue={this.state.value}
                            />

                        </CustomPopup>
                        <DataGrid
                            className={'dx-card-new wide-card'}
                            dataSource={custstate.probes}
                            showBorders={true}
                            columnAutoWidth={true}
                            columnHidingEnabled={true}
                            onSaving={onSavingProbesConfig}
                            onRowValidating={onRowValidatingProbes}
                        >
                            <LoadPanel enabled />
                            <Toolbar>
                                <Item name='addRowButton' showText='always' caption="Probes Config" />
                            </Toolbar>
                            <Paging enabled={true} defaultPageSize={10} />
                            <Editing
                                mode="popup"
                                allowUpdating={true}
                                allowAdding={true}
                                // allowDeleting={true}
                                showColumnLines={true}
                                showRowLines={true}
                                showBorders={true}
                                onRowValidating={onRowValidatingProbes}
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

                                        {/* <Item dataField="ptype">
                                            <Lookup dataSource={ptypesData} valueExpr="type" displayExpr="type" ></Lookup>
                                        </Item> */}
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
            </Grid> </div >

        </React.Fragment >

    );
    function InfoRender(e, d) {
        return <a href="" onClick={() => showJsonInfo(e, d)}>Info</a>;
    }
    function DownloadRender(d) {
        return <a href="" onClick={() => handledownload(d)}>Download</a>;
    }
}

