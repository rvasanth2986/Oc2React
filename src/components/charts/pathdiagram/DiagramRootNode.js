import React from 'react'

import { Group } from '@visx/group';

// Define colors
const rootNodeFill = "#2eb8b8";
const rooNodeFill_Hover = "#5cd6d6";
const rootNodeStroke = "#4d4d4d";
const rootNodeText = "#4d4d4d";

const DiagramRootNode = ({ node, index, hoverId, setHoverId }) => {
    return (
        <Group top={node.x} left={node.y}>
            <circle
                r={14}
                fill={hoverId === index ? rooNodeFill_Hover : rootNodeFill}
                stroke={rootNodeStroke}
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
                onMouseLeave={() => {
                    setHoverId(null);
                }}
                onMouseMove={event => {
                    setHoverId(index);
                }}
            />
            <text
                dy="2.5em"
                dx="0em"
                fontSize={13}
                fontFamily="Corbel Light"
                textAnchor="middle"
                fontWeight="bold"
                style={{ pointerEvents: 'none', wordWrap: 'break-word', width: 15 }}
                fill={rootNodeText}
            >
                {node.data.name}
            </text>
        </Group>
    );
}

export default DiagramRootNode
