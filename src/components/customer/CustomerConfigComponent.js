import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { getRegionsProbesByCustomer } from "../../services/CustomerServcie";
import { Grid } from '@material-ui/core';
import DataGrid, {
    Column,
    Editing,
    Texts,
    Popup,
    Paging,
    Lookup,
    Form,
    Summary, FilterRow, SearchPanel, HeaderFilter, LoadPanel, Toolbar, TotalItem, Item, PatternRule
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import ProbesConfigReducer from "../../store/reducers/ProbesConfigReducer";
import { saveChange, saveProbesChange, addCustomer } from "../../store/actions/CustomerAction";
import { customerconfig } from "../../pages";
const notesEditorOptions = { height: 50 };


export default function CustomerConfigComponent() {    const authstate = useSelector((state) => state.auth);
    const custstate = useSelector((state) => state.cust);
    const dispatch = useDispatch();
    console.log("Custstate", custstate);



    const onRowValidating = React.useCallback((e) => {
        if (custstate.customer.filter(x => x.customerId == e.newData.customerId).length > 0 && e.changes[0].type == "insert") {
            e.errorText = `Customer already exist! please try different name...`;
            e.isValid = false;
            return;
        }
        // else if (e.newData.customer == undefined) {
        //     e.errorText = `Customer name missing!`;
        //     e.isValid = false;
        //     return;
        // }
        else {
            e.errorText = ``;
            e.isValid = true;
            return;
        }
    });

    const onSaving = React.useCallback((e) => {
        e.cancel = true;
        console.log(e.changes[0], e);
        if (e.changes[0].type == "insert") {
            const insertdata = {
                "customerId":  e.changes[0].data.customerId,
                "customerName": e.changes[0].data.customerName,
                "customerEmail": e.changes[0].data.customerEmail
            };
            addCustomer(dispatch, e.changes[0], insertdata, authstate.auth.idToken).then((response) => {
                console.log(response);
                e.promise = true;
                e.component.cancelEditData();
            });
        }
        if (e.changes[0].type == "update") {
            const insertdata = {
                "customerId": e.changes[0].key.customerId,
                "customerName": e.changes[0].data.customerName == undefined ? e.changes[0].key.customerName : e.changes[0].data.customerName,
                "customerEmail": e.changes[0].data.customerEmail == undefined ? e.changes[0].key.customerEmail : e.changes[0].data.customerEmail
            };
            addCustomer(dispatch, e.changes[0], insertdata, authstate.auth.idToken).then((response) => {
                console.log(response);
                e.promise = true;
                e.component.cancelEditData();
            });
        }
        if (e.changes[0].type == "remove") {
            const deletedata = {
                "customerId":  e.changes[0].key.customerId,
            };
            console.log("delete",deletedata)
            // saveChange(dispatch, e.changes[0], deletedata, authstate.auth.idToken).then((response) => {
            //     console.log(response);
            //     e.promise = true;
               
            // });
        }

    });
   

    const RemoveRegion = React.useCallback((e) => {
        e.cancel = true;
        console.log(e.changes[0]);
        e.promise = true;
        e.component.cancelEditData();
    });
    return (
        <React.Fragment>
            <div className={'responsive-paddings-new'}> 
            <Grid item xs={12} style={{ marginTop: '1em' }}>
                <div className="m-portlet m-portlet--head-sm">
                    <div class="m-portlet__head">
                        <div class="m-portlet__head-caption">
                            <div class="m-portlet__head-title">
                                <h4 class="m-portlet__head-text" style={{ fontWeight: '400', fontSize: '16px' }} > Customer config </h4>
                            </div>
                        </div>
                    </div>
                    <div class="m-portlet__body">
                        <DataGrid
                            className={'dx-card-new wide-card'}
                            dataSource={custstate.customer}
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
                            >
                                <Texts addRow="Add New Customer" />
                                <Popup title="Add New Customer" showTitle={true} width={700} height={350} />
                                <Form>
                                    <Item itemType="group" colCount={2} colSpan={2}>
                                        <Item dataField="customerId"  />
                                        <Item dataField="customerName" />
                                        <Item dataField="customerEmail" />
                                        
                                    </Item>
                                </Form>
                            </Editing>
                            <SearchPanel visible={true} />
                            <HeaderFilter visible={true} />
                            <FilterRow visible={true} />
                            <Column dataField={'customerId'} caption="Customer Id" hidingPriority={1} />
                            <Column
                                dataField={'customerName'}
                                caption={'Customer Name'}
                                hidingPriority={2}
                            />
                             <Column
                                dataField={'customerEmail'}
                                caption={'Customer Email'}
                                hidingPriority={0}
                            />
                            <Summary>
                                <TotalItem
                                    column="customerId"
                                    summaryType="count" />
                            </Summary>
                        </DataGrid>
                    </div>
                </div>
            </Grid> 
            </div>
        </React.Fragment>
    );
}

