import React from 'react';
import { useEffect, useState, useReducer, useMemo } from 'react';

import dateFormat from 'dateformat';

//import { Slider } from '@material-ui/core';
import { Grid, Paper, Slide } from '@material-ui/core'
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { ListItemText } from '@material-ui/core';
//import { Icon } from 'semantic-ui-react'

import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Group } from '@visx/group';
import { Tree, hierarchy } from '@visx/hierarchy';
import { LinkHorizontal } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';
import { useDispatch, useSelector } from 'react-redux';
import { DisplayDataPushArray, DisplayDatasetChange } from '../../store/actions/TraceDiagramAction';
import { Slider, Label, Tooltip } from 'devextreme-react/slider';
import DiagramRootNode from './pathdiagram/DiagramRootNode';
import { formatDate } from 'devextreme/localization';
import DiagramNode from './pathdiagram/DiagramNode';
import { DataGrid } from 'devextreme-react';
import { Column, Paging } from 'devextreme-react/data-grid';
import { MdOutlineWifiTethering, MdTrendingFlat } from 'react-icons/md';


// Define colors
const tooltipTitleTextColor = "#5cd6d6";
const tooltipTitleTextColor_NodeLatency = "#ff8080";
const gradientColorStart = "white";
//const gradientColorEnd = "#e6e6e6";
const gradientColorEnd = "white";
const linkColor = "#4d4d4d";

const PathTraceDiagram = ({ sourceProbeId, metricsData }) => {
    const pathstate = useSelector(state => state.path);
    //console.log("pathstate", pathstate);

    const dispatch = useDispatch();

    // This state stores the traceRoute data that will be visualized on the tree diagram.
    // The data set displayed will be based on the index value in the dataSetDisplayState below.
    const initialTraceRouteData = { name: sourceProbeId, children: [] };
    const [traceRouteData, setTraceRouteData] = useState({ name: sourceProbeId, children: [] });

    // This state tracks which trace route data will be displayed on the diagram and set the max slider value.
    // visibile destination data is an array that stores the destination's Id and time that has a data set visible on the tree diagram.
    const initialDataSetDisplayState = { index: 0, maxDataSetNum: 0, destinationIdsWithNoData: [], visibleDestinationsData: [] };
    // const [dataSetDisplayState, dispatchDataSetDisplay] = useReducer(DataSetDisplayReducer, initialDataSetDisplayState);
    const [dataSetDisplayState, dispatchDataSetDisplay] = useState(pathstate.MatrixDataSetDisplay);

    // This state manages the graph size based on the window screen size.
    const initialGraphSizeState = { width: 1400, height: 300, margin: { top: 30, left: 120, right: 80, bottom: 30 } }
    const [graphSizeState, setGraphSize] = useState(initialGraphSizeState);

    // If the window width is large than 1400px then set diagram to fit in the window.
    useEffect(() => {
        if (window.innerWidth > 1400) {
            setGraphSize({ ...graphSizeState, width: window.innerWidth - 240 });
        }
    }, [])


    // Whenever the metricsData or the index from the dataSetDisplayState changes, the callback in the useEffect will run.
    useEffect(() => {
        // Clear the destinationsWithNoData and the visibleDestinationData.
        changeStateValue("destinationIdsWithNoData", []);
        changeStateValue("visibleDestinationsData", []);
        changeStateValue("gridData", []);
        changeStateValue("gridDataNew", []);

        let gridData = { children: [] };
        // The root node is defined first. All other nodes will be in the children array.
        let treeData = { name: sourceProbeId, children: [] };

        // Stores the max number of data sets from all Trace Route destination data that was received.
        let maxDataSetNum = 0;

        // Loop through each destination's Trace Route data.
        for (let destinationData of metricsData) {
            // If the destinationData only has a flag property called destinationIdWithNoData, then do not include it in the treeData.
            if (Object.keys(destinationData[0])[0] !== "destinationIdWithNoData") {
                // Check that the index on the data set slider is not greater than the destination data's length,
                // Otherwise there would be an out of bounds error when trying to retrieve that data set.
                if (destinationData.length > pathstate.MatrixDataSetDisplay.index) {
                    const dataSet = destinationData[pathstate.MatrixDataSetDisplay.index];
                    if (dataSet.checkMsgBody.hops != undefined) {


                        // Push the destinationId and time of each destination that will be in the tree (will be displayed to user).
                        pushArrayElement("visibleDestinationsData", {
                            destinationId: dataSet.checkMsgBody.hostname,
                            time: dataSet.checkTime
                        })
                        pushArrayElement("gridData", {
                            items: {
                                sourceProbeId: sourceProbeId,
                                destinationId: dataSet.checkMsgBody.hostname,
                                time: dataSet.checkTime
                            }
                        })
                        gridData.children.push({
                            sourceProbeId: sourceProbeId,
                            destinationId: dataSet.checkMsgBody.hostname,
                            time: dataSet.checkTime
                        })
                        // Define the youngest nodeChild (node with no children).
                        // Note: Hop num should be the same as name. We add name so that if a hop has an error and has no hop num, we can still track it.
                        let nodeChild = {
                            name: dataSet.checkMsgBody.hops.length,
                            destinationId: dataSet.checkMsgBody.hostname,
                            time: dataSet.checkTime,
                            ...dataSet.checkMsgBody.hops[dataSet.checkMsgBody.hops.length - 1]
                        };


                        // We start at the second last hop and head towards the first hop.
                        for (let i = dataSet.checkMsgBody.hops.length - 2; i >= 0; i--) {
                            // Define the parentNode and include the next node (childNode) as its sole child.
                            let nodeParent = {
                                name: i + 1,
                                destinationId: dataSet.checkMsgBody.hostname,
                                time: dataSet.checkTime,
                                ...dataSet.checkMsgBody.hops[i],
                                children: []
                            };
                            nodeParent.children.push(nodeChild);

                            // The parent node is all set, so now it will become a childNode for the hop before it to store as its child.
                            nodeChild = { ...nodeParent };

                            // Once all hops are done, the root node in treeData will store the most recent child node (hop 1) in it children array.
                            if (i === 0) {
                                treeData.children.push(nodeChild);
                            }
                        }

                        // Start Changes By Vicky 
                        //     let nodeChilds =[];
                        //     nodeChilds.push(nodeChild);
                        // for (let i = dataSet.checkMsgBody.hops.length - 2; i >= 0; i--) {
                        //     let nodeParents =[];


                        //     // let nodeParent={};
                        //     const HopsIpsList = dataSet.checkMsgBody.hops[i].hop_IPs;
                        //     if (dataSet.checkMsgBody.hops[i].hop_IPs != undefined){
                        //     for (let j=HopsIpsList.length-1;j>=0;j--){
                        //          let nodeParent = {
                        //             name: j + 1,
                        //             destinationId: dataSet.checkMsgBody.hostname,
                        //             time: dataSet.checkTime,
                        //             hop_IPs:HopsIpsList[j],
                        //             children: []
                        //         };

                        //         nodeParents.push(nodeParent);


                        //     }
                        //     // Define the parentNode and include the next node (childNode) as its sole child.
                        //    // nodeParents[0].children.push(nodeChild);
                        //     for (let k=0;k<=nodeParents.length-1;k++){
                        //         nodeParents[k].children.push(nodeChilds);
                        //           // The parent node is all set, so now it will become a childNode for the hop before it to store as its child.
                        //            nodeChilds.push(nodeParents[k]) ;

                        //     }
                        //     //nodeChild = { ...nodeParents[0] };
                        //     nodeChilds= {...nodeParents};
                        //     // Once all hops are done, the root node in treeData will store the most recent child node (hop 1) in it children array.
                        //     if (i === 0) {
                        //         treeData.children.push(nodeChilds);
                        //     }
                        //  }
                        // }
                        // End Changes By Vicky

                        // Get the largest destinationData length. Will be used to set the max length of the data set slider.
                        maxDataSetNum = destinationData.length - 1 > maxDataSetNum ? destinationData.length - 1 : maxDataSetNum;
                    }
                }
            }
            else {
                // Add any destination with no data in the array t0 eventually display a message to user saying no data was available for that destination.
                pushArrayElement("destinationIdsWithNoData", destinationData[0].destinationIdWithNoData)
            }
        }
        pushArrayElement("gridDataNew", { items: gridData.children });
        // If there are more than three destinations with paths, then increase the diagram height and left margin proportionally.
        if (treeData.children.length > 3) {
            const height = initialGraphSizeState.height + 50 * (treeData.children.length - 3);
            const marginLeft = initialGraphSizeState.margin.left + 15 * (treeData.children.length - 3);
            setGraphSize({ ...graphSizeState, height: height, margin: { ...graphSizeState.margin, left: marginLeft } });
        }

        setTraceRouteData(treeData);
        changeStateValue("maxDataSetNum", maxDataSetNum);

    }, [metricsData, pathstate.MatrixDataSetDisplay.index]);

    // This function changes the value of one field in the dataSetDisplayState.
    function changeStateValue(fieldName, newValue) {
        dispatch(DisplayDatasetChange(fieldName, newValue));
    }

    // Adds a destination id that had no traceroute data based on the filters.
    function pushArrayElement(arrayFieldName, newElement) {
        dispatch(DisplayDataPushArray(arrayFieldName, newElement));
    }

    const data = useMemo(() => hierarchy(traceRouteData), [traceRouteData]); // Gets the root node from a data object organized in a tree.

    // Define the max height and max width of the tree diagram based on the margins and given height and width.
    const yMax = graphSizeState.height - graphSizeState.margin.top - graphSizeState.margin.bottom;
    const xMax = graphSizeState.width - graphSizeState.margin.left - graphSizeState.margin.right;

    // Tooltip objects to define the tooltip's location and state.
    const {
        tooltipOpen,
        tooltipLeft,
        tooltipTop,
        tooltipData,
        hideTooltip,
        showTooltip,
    } = useTooltip();

    // Define tooltip styles.
    const tooltipStyles = {
        ...defaultStyles,
        minWidth: 60,
        backgroundColor: 'rgba(0,0,0,0.9)',
        color: "lightgrey"
    };

    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll.
    const { containerRef, TooltipInPortal } = useTooltipInPortal({
        scroll: true,
    });

    function format(value) {
        return `${value}`;
    }
    // State to identify which node is hovered.
    const [hoverId, setHoverId] = useState(null);

    function probesRender(Data) {

        //console.log("Grid Data", Data)

        return <div>


            {/* <Paper> */}
            <div>
                {/* <MdOutlineWifiTethering></MdOutlineWifiTethering> */}

                <span class="m-badge m-badge--success m-badge--wide">{Data.value.sourceProbeId}</span>
                <MdTrendingFlat></MdTrendingFlat>
                <span class="m-badge m-badge--success m-badge--wide">{Data.value.destinationId}</span>
                {/* <span class="m-badge m-badge--secondary m-badge--wide pade"><MdOutlineWifiTethering></MdOutlineWifiTethering> {val}</span> */}
            </div>
            <div>
                <span>{`${dateFormat(Data.value.time, "UTC:mmm d, yyyy")} @ ${dateFormat(Data.value.time, "UTC:HH:MM:ss")}`}</span>
            </div>
            {/* </Paper> */}

        </div>
        //     return <div> 
        //       {Data.value.map((val) => {
        //             return (

        //                 <div> 


        //                 {/* <Paper> */}
        //                 <div>
        //                 {/* <MdOutlineWifiTethering></MdOutlineWifiTethering> */}

        //                 <span class="m-badge m-badge--success m-badge--wide">{val.sourceProbeId}</span>
        //                 <MdTrendingFlat></MdTrendingFlat>
        //                 <span class="m-badge m-badge--success m-badge--wide">{val.destinationId}</span>
        //                 {/* <span class="m-badge m-badge--secondary m-badge--wide pade"><MdOutlineWifiTethering></MdOutlineWifiTethering> {val}</span> */}
        //                 </div>
        //                 <div>
        //                     <span>{`${dateFormat(val.time, "UTC:mmm d, yyyy")} @ ${dateFormat(val.time, "UTC:HH:MM:ss")}`}</span>
        //                 </div>
        //                 {/* </Paper> */}

        //             </div>
        //             );
        //         })}
        //   </div>
    }

    return graphSizeState.width < 10 ? null : (

        <React.Fragment>
            {traceRouteData.children.length > 0 &&
                <div className={'responsive-paddings-new'}>
                    <div className={'row px-3'}>
                        <div class="col-md-6">
                            <div style={{height:"50%"}}  className={''}>
                                
                                    <div  style={{ height:"100%" }} className="m-portlet m-portlet--head-sm ">
                                        <div class="m-portlet__head">
                                            <div class="m-portlet__head-caption">
                                                <div class="m-portlet__head-title">
                                                    <h4 class="m-portlet__head-text" style={{ fontWeight: '400', fontSize: '16px' }} >Data Set Selector </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="m-portlet__body">
                                            <Slider
                                                step={1}
                                                //marks
                                                min={0}
                                                max={pathstate.MatrixDataSetDisplay.maxDataSetNum}
                                                style={{ maxWidth: 300, padding: 0, paddingBottom: 4 }}
                                                value={pathstate.MatrixDataSetDisplay.index}
                                                onValueChanged={(e) => changeStateValue("index", e.value)}>
                                                <Tooltip enabled={true} showMode="always" position="bottom" format={format} />
                                            </Slider>
                                        </div>
                                    </div>
                                
                            </div>
                            <div style={{height:"50%"}}  className={''}>
                                {/* {pathstate.MatrixDataSetDisplay.destinationIdsWithNoData.length > 0 &&
                <Grid item xs={12}>
                    <p className="header2-style" style={{ textAlign: 'left', marginLeft: '1.5em', fontWeight: 'bold', display: 'inline-block', whiteSpace: 'pre-wrap' }}>
                        No data available for </p>
                    <p className="header1-style" style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}>{sourceProbeId}</p>
                    <p className="header2-style" style={{ display: 'inline-block', fontWeight: 'bold', textAlign: 'left', whiteSpace: 'pre-wrap' }}> to </p>

                    {pathstate.MatrixDataSetDisplay.destinationIdsWithNoData.map((destinationId, index) => (
                        <p key={index} className="header1-style" style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}>{destinationId}{index !== pathstate.MatrixDataSetDisplay.destinationIdsWithNoData.length - 1 ? ', ' : '.'}</p>
                    ))}

                    <br />
                    <br />

                </Grid>
            } */}
                                {pathstate.MatrixDataSetDisplay.destinationIdsWithNoData.length > 0 && <div style={{height:"100%"}} className={'responsive-paddings-new p-0'}> <Grid   item xs={12} style={{ marginTop: '1em',height:"100%"  }}>
                                    <div  style={{ height:"95%" }} className="m-portlet m-portlet--head-sm">
                                        <div class="m-portlet__head">
                                            <div class="m-portlet__head-caption">
                                                <div class="m-portlet__head-title">
                                                    <h4 class="m-portlet__head-text" style={{ fontWeight: '400', fontSize: '16px' }} > No data available for </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="m-portlet__body">
                                            <Grid container>
                                                {/* <Grid item xs={12} style={{ marginBottom: '1em', marginLeft: '2em' }}>
                        <p className="header1-style" style={{textAlign: 'left'}}>Showing results for: </p>
                    </Grid> */}
                                                <Grid item xs={12} style={{  marginLeft: '2em' }}>

                                                    {pathstate.MatrixDataSetDisplay.destinationIdsWithNoData.length > 0 && pathstate.MatrixDataSetDisplay.destinationIdsWithNoData.map((dataSet, index) => {

                                                        return (
                                                            <p class="m-badge m-badge--secondary m-badge--wide pade" >{pathstate.MatrixDataRequestFiltersState.sourceProbeIdResults} &#8594; {dataSet}</p>
                                                        )

                                                    })}


                                                </Grid>
                                            </Grid>
                                        </div>
                                    </div>
                                </Grid> </div>}
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div style={{height:"100%"}} className={'content-block dx-card-new responsive-paddings-new m-0 p-0'}>
                                <DataGrid
                                    className={'dx-card-new wide-card'}
                                    dataSource={pathstate.MatrixDataSetDisplay.gridData}
                                    showBorders={false}
                                    columnAutoWidth={true}
                                    columnHidingEnabled={true}
                                >
                                    <Paging enabled={true} defaultPageSize={5} />
                                    <Column dataField={'items'} caption="TraceRoute Data" cellRender={probesRender} hidingPriority={0} />

                                </DataGrid>
                            </div>
                        </div>
                    </div>
                    <div className={'Clear'}></div>
                    <div className={'responsive-paddings-new'} style={{ overflowX: 'auto' }}>
                        {/* <Grid style={{ overflowX: 'auto' }}> */}
                        <svg width={graphSizeState.width} height={graphSizeState.height} ref={containerRef} className="graph-shadow p-0 m-0">
                            <LinearGradient id="lg" from={gradientColorStart} to={gradientColorEnd} />
                            <rect className="m-portlet m-portlet--bordered-semi m-card-profile" width={graphSizeState.width} height={graphSizeState.height} rx={14} fill={"url('#lg')"} />
                            <Tree root={data} size={[yMax, xMax]}>
                                {tree => (
                                    <Group top={graphSizeState.margin.top} left={graphSizeState.margin.left}>
                                        {tree.links().map((link, i) => {
                                            if (i < metricsData.length) {
                                                link.source.y = link.source.y - 20;
                                            }
                                            return <LinkHorizontal
                                                key={`link-${i}`}
                                                data={link}
                                                stroke={linkColor}
                                                strokeWidth="1"
                                                fill="none"
                                            />
                                        })}
                                        {tree.descendants().map((node, i) => {
                                            return <DiagramNode
                                                key={`node-${i}`}
                                                node={node}
                                                hoverId={hoverId}
                                                setHoverId={setHoverId}
                                                index={i}
                                                showTooltip={showTooltip}
                                                hideTooltip={hideTooltip}
                                            />
                                        })}
                                    </Group>
                                )}
                            </Tree>
                            {tooltipOpen && tooltipData && (
                                <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
                                    <div style={{ color: tooltipData.hop_loss > 0 ? tooltipTitleTextColor_NodeLatency : tooltipTitleTextColor }}>
                                        <strong>{sourceProbeId} &#8594; {tooltipData.destinationId}
                                        </strong>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0 }}><strong>Hop #{tooltipData.name}</strong></p>
                                        <p style={{ marginBottom: 0, marginTop: -10 }}>________________</p>
                                       
                                        {tooltipData.hop_IPs && <p className="tooltip-graph-stats"><strong>Hop IPs: </strong>{tooltipData.hop_IPs.join(", ")}</p>}
                                        {tooltipData.hop_rtt >= 0 && <p className="tooltip-graph-stats"><strong>Reply Latency: </strong>{tooltipData.hop_rtt} ms</p>}
                                        {tooltipData.hop_loss >= 0 && <p className="tooltip-graph-stats" style={{ color: tooltipData.hop_loss > 0 ? tooltipTitleTextColor_NodeLatency : "lightgrey" }}><strong>Loss Detected: </strong>{tooltipData.hop_loss * 100}%</p>}
                                    </div>
                                </TooltipInPortal>
                            )}
                        </svg >
                    </div>
                </div>}
        </React.Fragment>
    );
}

export default PathTraceDiagram
