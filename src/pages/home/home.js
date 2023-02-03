import React, { useEffect, useState } from 'react';
import './home.scss';
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  Lookup,
  SearchPanel,
  HeaderFilter
} from 'devextreme-react/data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineWifiTethering } from "react-icons/md";
import { Button } from "@material-ui/core";
import StatusHeader from '../../components/status-header/StatusHeader';
export default () => {

  const [regionsData, setregionsData] = useState([]);
  const [EventsDatas, setEventsDatas] = useState([]);

  const custstate = useSelector((state) => state.cust);
  const authstate = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  console.log("Custstate",custstate);
 
  useEffect(() => {
      if (custstate.selectedCustomer && custstate.selectedCustomer !== "" && custstate.regions.length>0 ) {
          console.log(custstate.regions);
         // let regionsdata = [];

          let ProbData = [];
          for (let item of custstate.regions) {
              // console.log(item.legComponentAttributes);
             // if (item.probes.length > 0) {
                  let attr = [];
                  for (let x of item.probes) {
                      attr.push(x.name);
                  }
                  ProbData.push({
                      region : item.region,
                      probes : attr
                  });
             // }
          }
          setregionsData(ProbData);

          let EventData = []; // This array is meant to accumulate all events from map and will fully rewrite the eventsArray.

          custstate.regions.map(region => {
              return region.probes.map(probe => {
                  probe.events = [{
                      "time": "21 may 2021, 01:56 UTC",
                      "message": "Error: Connectivity issues to euc2-az1-probe."
                  }];
                  return probe.events.map(event => {
                      EventData.push({ probeName: probe.name, ...event });
                      return event;
                  });
              })
          });

          // Once all events are collected, write them to the eventsArray state.
          setEventsDatas(EventData);
      }
     
  },[custstate]);

  function probesRender(Data) {
      console.log("Render Data",Data)
      return <div> 
          {Data.value.map((val) => {
          return (
               <span class="m-badge m-badge--secondary m-badge--wide pade"><MdOutlineWifiTethering></MdOutlineWifiTethering> {val}</span>
           );
        })}
      </div>
    }

    function eventRender(Data) {
        
      return <Button variant="contained" color="primary" > Detail</Button>

    }
  
  return(
  <React.Fragment>
        <div className={'responsive-paddings-new'}>
            <StatusHeader props={custstate} />
        </div>

        <h6 className={'content-block'}>Probes Overview</h6>

        <div className={'content-block dx-card-new responsive-paddings'}>
        <DataGrid
          className={'dx-card-new wide-card'}
          dataSource={regionsData}
          showBorders={false}
          columnAutoWidth={true}
          columnHidingEnabled={true}
        >
          <Paging defaultPageSize={10} />
          {/* <Pager showPageSizeSelector={true} showInfo={true} /> */}

          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          <HeaderFilter visible={true} />

          <Column dataField={'region'}  caption="Region Name"  hidingPriority={1} />
          <Column
            dataField={'probes'}
            caption={'Probes'}
            hidingPriority={0}
            cellRender={probesRender}
          />
        </DataGrid>
        </div>    

        {/* <h6 className={'content-block'}>Recent Events</h6>
        <div className={'content-block dx-card-new responsive-paddings'}>
        <DataGrid
          className={'dx-card-new wide-card'}
          dataSource={EventsDatas}
          showBorders={false}
          columnAutoWidth={true}
          columnHidingEnabled={true}
        >
          <Paging enabled={true} defaultPageSize={10} />
          <Column dataField={'probeName'}  caption="Probe Name"  hidingPriority={3} />
          <Column
            dataField={'time'}
            caption={'Event Time'}
            hidingPriority={2}
          />
          <Column
            dataField={'message'}
            caption={'Message'}
            hidingPriority={1}
          />
           <Column cellRender={eventRender} hidingPriority={0}/>
        </DataGrid>
        </div> */}
  </React.Fragment>
)};
