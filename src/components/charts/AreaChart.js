import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleLinear, scaleUtc, scaleThreshold } from '@visx/scale';
import { Legend } from '@visx/legend';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { bisect } from 'd3-array';
import dateFormat from 'dateformat';

// Define colors.
const axisColor = "#4d4d4d";
const contrastColor = "black";
const lightContrastColor = "#ff8080";
const gradientColorStart = "white";
const gradientColorEnd = "white";
const graphFillColorStart = "rgb(223, 223, 223, 0.2)";
const graphFillColorEnd = "rgb(223, 223, 223, 0.6)";
const graphStrokeColor = "black";


// Define axis CSS properties
const axisLabelProps = {
    fill: axisColor,
    fontFamily: 'Corbel Light',
    fontWeight: 'bold',
    fontSize: 15,
    textAnchor: 'middle'
}

const bottomAxisTickLabelProps = {
    fill: axisColor,
    fontSize: 11,
    fontFamily: 'Helvetica',
    textAnchor: 'middle',
}

const leftAxisTickLabelProps = {
    fill: axisColor,
    fontSize: 11,
    fontFamily: 'Helvetica',
    textAnchor: 'end',
}

const AreaChart = ({ metricsData, sourceProbeId, destinationId }) => {
    // We add this local state to filter the metricsData to only include the properties we need.
    // For simplicity, Each data entry will be formatted as:
    /* { time: checkTime date object,
         value: rtt_value,
         stats: { any extra stats to show in tooltip}
        }
    */
    const [areaGraphData, setAreaGraphData] = useState([]);

    // This state manages the graph size based on the window screen size.
    const initialGraphSizeState = { width: 600, height: 400 }
    const [graphSizeState, setGraphSize] = useState(initialGraphSizeState);

    // If the window width is large than 1400px then set diagram to fit in half the window (the other half will be the bar graph).
    // Height = 2/3 Width
    useEffect(() => {
        if (window.innerWidth > 1400) {
            setGraphSize({ ...graphSizeState, width: window.innerWidth / 2 - 200, height: (2 / 3) * (window.innerWidth / 2 - 200) });
        }
    }, [])

    // Whenever the metricsData updates, update the areaGraphData.
    useEffect(() => {
        let filteredFormattedData = [];

        // Format and filter data to remove unnecessary properties and data.
        for (let dataObj of metricsData) {
            const dataObjProps = Object.keys(dataObj.checkMsgBody); // Get prop names within checkMsgBody property.

            filteredFormattedData.push({
                time: dataObj.checkTime,
                value: dataObj.checkMsgBody[dataObjProps[0]].rtt_avg,
                stats: {
                    stdDev: dataObj.checkMsgBody[dataObjProps[0]].rtt_mdev,
                    min: dataObj.checkMsgBody[dataObjProps[0]].rtt_min,
                    max: dataObj.checkMsgBody[dataObjProps[0]].rtt_max
                }
            });
        }

        setAreaGraphData(filteredFormattedData);

    }, [metricsData])

    // Chart margins
    const verticalMargin = 60;
    const leftMargin = 70;

    // The height (yMax) and width (xMax) of the area graph.
    const xMax = graphSizeState.width - leftMargin + 20;
    const yMax = graphSizeState.height - verticalMargin;

    // X Axis scale (time); memoize to optimize performance.
    const xScale = useMemo(() =>
        // Use scaleUtc because we are working with date objects as the x-axis values.
        scaleUtc({
            range: [leftMargin, xMax],
            round: true,
            domain: [Math.min(...areaGraphData.map((data) => data.time)), Math.max(...areaGraphData.map((data) => data.time))],
        }),
        [xMax, areaGraphData]
    );

    // Y Axis scale (latency); memoize to optimize performance.
    const yScale = useMemo(() =>
        scaleLinear({
            range: [yMax, verticalMargin],
            round: true,
            domain: [0, Math.max(...areaGraphData.map((d) => d.value))],
        }),
        [yMax, areaGraphData]
    );

    // Legend scale to correctly display legend component for the area graph.
    const areaGraphLegendScale = scaleThreshold({
        domain: ["Latency (ms)"],
        range: [graphStrokeColor]
    })

    // Tooltip objects to define the tooltip's location and state.
    const {
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
        color: 'lightgrey'
    };

    // Handle whenever mouse moves onto a point on graph that should show a tooltip.
    // Use useCallback to return a memoized the callback (different from useMemo which returns a memoized value)
    const handleTooltip = useCallback((event) => {
        const { x } = localPoint(event) || { x: 0 };    // Get the x value of the mouse pointer.
        const x0 = xScale.invert(x);    // invert to get the time value where the value x aligns to on the x-axis.
        const index = bisect(areaGraphData.map(d => d.time), x0);   // Get the index of where x0 aligns to in the areaGraphData array.

        let d0; // Stores data point from areaGraphData of index just before where x0 would go.
        let d1; // Stores data point from areaGraphData of the x0 index.

        if (index < areaGraphData.length && index >= 0) {
            d0 = areaGraphData[index - 1];
            d1 = areaGraphData[index];
        }

        let d = d0;
        if (d1 && d0) {
            // Check if x0 time value is closed to d0's time or d1's time. Return data of the closer one into d.
            d = x0.valueOf() - d0.time.valueOf() > d1.time.valueOf() - x0.valueOf() ? d1 : d0;

            // Show tooltip and set the data below to be used in the tooltip component.
            showTooltip({
                tooltipData: d,
                tooltipLeft: xScale(d.time),
                tooltipTop: yScale(d.value),
            });
        }
    },
        [showTooltip, xScale, yScale, areaGraphData],
    );

    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll
    const { containerRef, TooltipInPortal } = useTooltipInPortal({
        scroll: true,
    });

    return (
        <>
                                  <div className="m-portlet m-portlet--head-sm">
                                    {/* <header className="px-5 py-4 border-b border-slate-100">
                                        <h2 className="font-semibold text-slate-800">Direct VS Indirect</h2>
                                    </header> */}
                                    <div class="m-portlet__head">
                                    <div class="m-portlet__head-caption">
                                        <div class="m-portlet__head-title">
                                            <h4 class="m-portlet__head-text">{sourceProbeId} &#8594; {destinationId}</h4>
                                        </div>
                                        </div>
                                        <div class="m-portlet__head-tools">
                                        <Legend scale={areaGraphLegendScale} direction="row" labelMargin="0 15px 0 0" style={{ fontFamily: 'Corbel Light', fontWeight: 'bold', display: 'inline-block' }} />
                                        </div>
                                        {/* <div style={{ marginLeft: '2em' }}>
                <p className="header1-style" style={{ textAlign: 'left', display: 'inline-block', whiteSpace: 'pre-wrap' }}>{sourceProbeId} &#8594; {destinationId}    </p>
                <Legend scale={areaGraphLegendScale} direction="row" labelMargin="0 15px 0 0" style={{ fontFamily: 'Corbel Light', fontWeight: 'bold', display: 'inline-block' }} />
                </div> */}
                                    </div>
                                    <div class="m-portlet__body">

                                    <svg width={graphSizeState.width} height={graphSizeState.height} ref={containerRef} className="graph-shadow">
                <LinearGradient id={"background"} from={gradientColorStart} to={gradientColorEnd} />
                <LinearGradient id={"areaFill"} from={graphFillColorStart} to={graphFillColorEnd} />
                <rect width={graphSizeState.width} height={graphSizeState.height} x={0} y={0} fill="url(#background)" rx={3} />
                <AreaClosed
                    data={areaGraphData}
                    x={d => xScale(d.time) ?? 0}
                    y={d => yScale(d.value) ?? 0}
                    yScale={yScale}
                    strokeWidth={1}
                    stroke={graphStrokeColor}
                    fill="url(#areaFill)"
                    curve={curveMonotoneX}
                />
                <Bar
                    x={0}
                    y={0}
                    width={xMax}
                    height={yMax}
                    fill="transparent"
                    rx={14}
                    style={{ cursor: 'pointer' }}
                    onTouchStart={handleTooltip}
                    onTouchMove={handleTooltip}
                    onMouseMove={handleTooltip}
                    onMouseLeave={() => hideTooltip()}
                />
                <AxisBottom
                    top={yMax}
                    scale={xScale}
                    label="Time (UTC)"
                    stroke={axisColor}
                    tickStroke={axisColor}
                    tickLabelProps={() => bottomAxisTickLabelProps}
                    labelProps={axisLabelProps}
                />
                <AxisLeft
                    left={leftMargin}
                    top={0}
                    scale={yScale}
                    label="Latency (ms)"
                    stroke={axisColor}
                    tickStroke={axisColor}
                    tickLabelProps={() => leftAxisTickLabelProps}
                    labelProps={axisLabelProps}
                />

                {tooltipData && (
                    <g>
                        <Line
                            from={{ x: tooltipLeft, y: verticalMargin }}
                            to={{ x: tooltipLeft, y: yMax + verticalMargin }}
                            stroke={contrastColor}
                            strokeWidth={2}
                            pointerEvents="none"
                            strokeDasharray="5,2"
                        />
                        <circle
                            cx={tooltipLeft}
                            cy={tooltipTop + 1}
                            r={4}
                            fill="black"
                            fillOpacity={0.1}
                            stroke="black"
                            strokeOpacity={0.1}
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                        <circle
                            cx={tooltipLeft}
                            cy={tooltipTop}
                            r={4}
                            fill={gradientColorStart}
                            stroke={axisColor}
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                    </g>
                )}
            </svg>
            {tooltipData && (
                <div>
                    <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
                        <div style={{ color: lightContrastColor }}>
                            <strong>{dateFormat(tooltipData.time, "UTC:mmmm d, yyyy")} @ {dateFormat(tooltipData.time, "UTC:HH:MM:ss")}</strong>
                        </div>
                        <div>
                            <p style={{ margin: 0 }}><strong>{tooltipData.value} ms </strong>latency</p>
                            <p style={{ marginBottom: 0, marginTop: -10 }}>________________</p>
                            <p className="tooltip-graph-stats"><strong>Max: </strong>{tooltipData.stats.max} ms</p>
                            <p className="tooltip-graph-stats"><strong>Min: </strong>{tooltipData.stats.min} ms</p>
                            <p className="tooltip-graph-stats"><strong>Std Dev: </strong>{tooltipData.stats.stdDev} ms</p>
                        </div>
                    </TooltipInPortal>
                </div>
            )}
            </div>
            </div>

          
        </>
    );
}

export default AreaChart