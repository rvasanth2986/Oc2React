import React from 'react'
import DiagramRootNode from './DiagramRootNode';

import { Group } from '@visx/group';

// Define colors
let nodeFill = "";
let nodeFill_Hover = "";
let nodeStroke = "";
// const nodeText = "#4d4d4d";
const nodeText = "#3F51B5";

// Handles rendering Root, Parent, and other Nodes.
const DiagramNode = ({ node, index, hoverId, setHoverId, showTooltip, hideTooltip }) => {
    const isRoot = node.depth === 0;
    const isLastNode = !node.children;

    if (isRoot) return <DiagramRootNode node={node} index={index} hoverId={hoverId} setHoverId={setHoverId} />;

    // if there was packet loss at the hop (> 0), then the fill and outline (stroke) will be a shade of red.
    // if (node.data.hop_loss > 0) {
    //     // The larger the % loss, the less the green and blue value meaning the red color will be more vibrant, visually indicating more loss.
    //     const greenBlueValue = 200 - Math.ceil(node.data.hop_loss) * 2;
    //     // nodeFill = `rgb(255, ${greenBlueValue}, ${greenBlueValue})`;
    //     // nodeFill_Hover = `rgb(255, ${greenBlueValue + 20}, ${greenBlueValue + 20})`;
    //     nodeFill = "#EBEBEB";
    //     nodeFill_Hover = "#A7B99A";
    //     nodeStroke = "red";
    // }
    // // Otherwise, the node will be gray.
    // else {
    //   //  nodeFill = "#36BF54"; //"#367855";
    //     nodeFill = "#EBEBEB"; //"#36BF54";
    //     nodeFill_Hover = "#A7B99A";
    //     nodeStroke = "#4d4d4d";
    // }

    if (node.data.hop_loss > 0) {
        // The larger the % loss, the less the green and blue value meaning the red color will be more vibrant, visually indicating more loss.
        const greenBlueValue = 200 - Math.ceil(node.data.hop_loss) * 2;
        nodeFill = `rgb(255, ${greenBlueValue}, ${greenBlueValue})`;
        nodeFill_Hover = `rgb(255, ${greenBlueValue + 20}, ${greenBlueValue + 20})`;
        nodeStroke = "red";
    }
    // Otherwise, the node will be gray.
    else {
        nodeFill = "#EBEBEB";
        nodeFill_Hover = "#bfbfbf";
        nodeStroke = "#4d4d4d";
    }

    return (
        <Group top={node.x} left={node.y}>
            <circle
                r={14}
                fill={hoverId === index ? nodeFill_Hover : nodeFill}
                stroke={nodeStroke}
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
                onMouseLeave={() => {
                    hideTooltip();
                    setHoverId(null);
                }}
                onMouseMove={event => {
                    setHoverId(index);
                    // TooltipInPortal expects coordinates to be relative to containerRef
                    const left = node.y + 125;
                    const top = node.x + 20;

                    // Show tooltip and set the data below to be used in the tooltip component.
                    showTooltip({
                        tooltipData: node.data,
                        tooltipTop: top,
                        tooltipLeft: left,
                    });
                }}
            />
            {isLastNode &&
                <text
                    dy="2.5em"
                    dx="0em"
                    fontSize={13}
                  //  fontFamily="Corbel Light"
                    textAnchor="middle"
                    fontWeight="bold"
                    style={{ pointerEvents: 'none', wordWrap: 'break-word', width: 15 }}
                    fill={nodeText}
                >
                    {node.data.destinationId}
                </text>
            }
        </Group>
    );
}

export default DiagramNode
