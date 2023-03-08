import React, { useMemo, useState, useEffect } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleThreshold, scaleTime } from '@visx/scale';
import { Legend } from '@visx/legend';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import dateFormat from 'dateformat';
import { max, bisect, extent } from 'd3-array';


// Define colors
const axisColor = "white";
const contrastColor = "#B9C5E1";
const contrastColor_Hover = "#8080ff";
const gradientColorStart = "white";
const gradientColorEnd = "white";

export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';

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


const BarChart = ({ metricsData, sourceProbeId, destinationId }) => {
    // We add this local state to filter the metricsData to only include the properties we need.
    // For simplicity, Each data entry will be formatted as:
    /* { dateObj: original checktime date obj,
         time: checkTime in string format,
         value: rtt_value,
         stats: { any extra stats to show in tooltip}
        }
    */

     const getDate = d => new Date(d.time);
     const getStockValue = d => d.value;
     const getlossPercentage = d => d.value * 100;
    const [barGraphData, setBarGraphData] = useState([]);

    // This state manages the graph size based on the window screen size.
    const initialGraphSizeState = { width: 600, height: 400 }
    const [graphSizeState, setGraphSize] = useState(initialGraphSizeState);

    // If the window width is large than 1400px then set diagram to fit in half the window (the other half will be the area graph).
    // Height = 2/3 Width
    useEffect(() => {
        if (window.innerWidth > 1400) {
            setGraphSize({ ...graphSizeState, width: window.innerWidth / 2 - 200, height: (2 / 3) * (window.innerWidth / 2 - 200) });
        }
    }, [])

    // Whenever the metricsData updates, update the barGraphData.
    useEffect(() => {
        let filteredFormattedData = [];

        // Format and filter data to remove unnecessary properties and data.
        for (let data of metricsData) {
            const dataProps = Object.keys(data.checkMsgBody); // Get prop names within checkMsgBody property.

            // Note: dateObj is separate from time because for bar graph, can't use a dateScale, so we can't use the pure date obj in x axis.
            filteredFormattedData.push({
                dateObj: data.checkTime,
                time: dateFormat(data.checkTime, "UTC:hh:MM TT"),
                //time: data.checkTime,
                value: data.checkMsgBody[dataProps[0]].packet_loss_rate,
                stats: {
                    packet_transmit: data.checkMsgBody[dataProps[0]].packet_transmit,
                    packet_receive: data.checkMsgBody[dataProps[0]].packet_receive,
                    packet_loss_count: data.checkMsgBody[dataProps[0]].packet_loss_count
                }
            });
        }
        console.log("setBarGraphData",filteredFormattedData);
        setBarGraphData(filteredFormattedData);

    }, [metricsData])

    // Chart margins
    const verticalMargin = 120;
    const leftMargin = 70;

    // The height (yMax) and width (xMax) of the bar graph.
    const xMax = graphSizeState.width - leftMargin + 20;
    const yMax = graphSizeState.height - verticalMargin;   // yMax of a bar in the graph.

    // X Axis scale (time); memoize to optimize performance.
    const xScale = useMemo(() =>
        // use scaleBand since this is a bar graph.
        scaleBand({
            range: [leftMargin, xMax],
            round: true,
            domain: barGraphData.map((data) => data.time),
            padding: 0.35
        }),
        [xMax, barGraphData]
    );

    // const zScale = useMemo(() =>
    //     // Use scaleUtc because we are working with date objects as the x-axis values.
    //     scaleTime({
    //         range: [leftMargin, xMax],
    //         round: true,
    //         domain: extent(barGraphData, getDate),
    //     }),
    //     [xMax, barGraphData]
    // );

    // Y Axis scale (packet loss); memoize to optimize performance.
    const yScale = useMemo(() =>
        // Use scaleLinear since packet loss can be a decimal.
        scaleLinear({
            range: [yMax, 0],
            round: true,
            domain: [0, Math.max(...barGraphData.map(getlossPercentage))],
        }),
        [yMax, barGraphData]
    );

    // Legend scale to correctly display legend component for the area graph.
    const barGraphLegendScale = scaleThreshold({
        domain: ["Packet Loss %"],
        range: [accentColor]
    })

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
    // const tooltipStyles = {
    //     ...defaultStyles,
    //     minWidth: 60,
    //     backgroundColor: 'rgba(0,0,0,0.9)',
    //     color: "lightgrey"
    // };

const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};
    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll.
    const { containerRef, TooltipInPortal } = useTooltipInPortal({
        scroll: true,
    });


    // State to identify which bar is hovered.
    const [hoverId, setHoverId] = useState(null);
   
 
function handleMouseMove(event,index,barX,d) { 
            setHoverId(index);
            // TooltipInPortal expects coordinates to be relative to containerRef
            // localPoint returns coordinates relative to the nearest SVG, which is what containerRef is set to.
            const eventSvgCoords = localPoint(event);
            const left = barX;

            // Show tooltip and set the data below to be used in the tooltip component.
            showTooltip({
                tooltipData: d,
                tooltipTop: eventSvgCoords?.y,
                tooltipLeft: left,
            });

 }
    // end changes vicky


    return (
        <>
             <div className="m-portlet m-portlet--head-sm">
                <div class="m-portlet__head">
                <div class="m-portlet__head-caption">
                    <div class="m-portlet__head-title">
                        <h4 class="m-portlet__head-text">{sourceProbeId} &#8594; {destinationId}</h4>
                    </div>
                </div>
                    <div class="m-portlet__head-tools">
                    <Legend scale={barGraphLegendScale} direction="row" labelMargin="0 15px 0 0" style={{ fontFamily: 'Corbel Light', fontWeight: 'bold', display: 'inline-block' }} />
                    </div>
                </div>

            
           
                <div class="m-portlet__body">
                <svg width={graphSizeState.width} height={graphSizeState.height} ref={containerRef} >
                    <LinearGradient id={"area-background-gradient"} from={background} to={background2} /> {/* from={gradientColorStart} to={gradientColorEnd} /> */}
                    <rect width={graphSizeState.width} height={graphSizeState.height}  y={0} fill="url(#area-background-gradient)" rx={14} />
                    <Group top={verticalMargin / 2}>
                        {barGraphData.map((d, index) => {
                            let fillColor = { original: accentColor, hover: accentColor };
                             const time = d.time;
                            const barWidth = xScale.bandwidth();
                            let barHeight = yMax - (yScale(getlossPercentage(d)) ?? 0); // From yScale(d.value), I think I get the range value between yMax and d.value. So from yMax to top edge of bar.
                            if (d.value === 0) {
                               // barHeight = yMax;
                                fillColor = { original: "rgb(0, 0, 0, 0)", hover: "rgb(0, 0, 0, 0)" };
                            }
                            const barX = xScale(time);   // This gets the position of the band (x domain point) that this data value belongs to. Ex. "10:00" band, "11:00" band etc.
                            const barY = yMax - barHeight; // If you do 0, everything will start on top down. Instead, do this so that all point go from bottom up.

                            // const barWidth = xScale.bandwidth();
                            // const barHeight = yMax - (yScale(getlossPercentage(d)) ?? 0);
                            // const barX = xScale(time);
                            // const barY = yMax - barHeight;

                            return (
                                <Bar
                                    key={`bar-${time}`}
                                    x={barX}
                                    y={barY}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={hoverId === index ? fillColor.hover : fillColor.original}
                                    style={{ cursor: 'pointer' }}
                                    onMouseLeave={() => {
                                        hideTooltip();
                                        setHoverId(null);
                                        // setListening(false);
                                    }}
                                    // onMouseMove={(event,index,barX,d) => handleMouseMove(event,index,barX,d) }
                                    onMouseMove={(event) => {
                                        setHoverId(index);
                                        // TooltipInPortal expects coordinates to be relative to containerRef
                                        // localPoint returns coordinates relative to the nearest SVG, which is what containerRef is set to.
                                        const eventSvgCoords = localPoint(event);
                                        const left = barX;

                                        // Show tooltip and set the data below to be used in the tooltip component.
                                        showTooltip({
                                            tooltipData: d,
                                            tooltipTop: eventSvgCoords?.y,
                                            tooltipLeft: left,
                                        });
                                        // setListening(true);
                                    }}
                                />
                            );
                        })}
                    </Group>

                    <AxisBottom
                        top={yMax + 60}
                        scale={xScale}
                        label="Time (UTC)"
                        stroke={axisColor}
                        tickStroke={axisColor}
                        tickLabelProps={() => bottomAxisTickLabelProps}
                        labelProps={axisLabelProps}
                    />
                    <AxisLeft
                        left={leftMargin}
                        top={60}
                        scale={yScale}
                        label="Packet Loss (%)"
                        stroke={axisColor}
                        tickStroke={axisColor}
                        tickLabelProps={() => leftAxisTickLabelProps}
                        labelProps={axisLabelProps}
                    />

                    {tooltipOpen && tooltipData && tooltipData.value * 100 > 0  && (
                        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
                        {`${dateFormat(tooltipData.dateObj, "UTC:mmmm d, yyyy")} @ ${dateFormat(tooltipData.dateObj, "UTC:HH:MM:ss")}`}
                            {/* <div style={{ color: contrastColor_Hover }}>
                                <strong>{dateFormat(tooltipData.dateObj, "UTC:mmmm d, yyyy")} @ {dateFormat(tooltipData.dateObj, "UTC:HH:MM:ss")}</strong>
                            </div> */}
                            <div>
                                <p style={{ margin: 0 }}><strong>{tooltipData.value * 100}% </strong>packet loss</p>
                                <p style={{ marginBottom: 0, marginTop: -10 }}>________________</p>
                                <p className="tooltip-graph-stats"><strong># Packets Transmitted: </strong>{tooltipData.stats.packet_transmit}</p>
                                <p className="tooltip-graph-stats"><strong># Packets Received: </strong>{tooltipData.stats.packet_receive}</p>
                                <p className="tooltip-graph-stats"><strong># Packets Lost: </strong>{tooltipData.stats.packet_loss_count}</p>
                            </div>
                        </TooltipInPortal>
                    )}
                </svg>
                </div>
            </div>
        </>
    );
}

export default BarChart