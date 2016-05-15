import React from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

// Tell note it can be dragged
const noteSource = {
    // function that fires when we begin dragging
    beginDrag(props) {
        console.log(`Beginning note drag`, props);

        return {};
    }
};

const noteTarget = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem();

        console.log(`Dragging note`, sourceProps, targetProps);
    }
};

@DragSource(
    ItemTypes.NOTE,
    noteSource,
    (connect) => ({connectDragSource: connect.dragSource()})
)

@DropTarget(
    ItemTypes.NOTE,
    noteTarget,
    (connect) => ({connectDropTarget: connect.dropTarget()})
)

export default class Note extends React.Component {
    render() {
        // set up props that we'll extract from `this.props`
        const {connectDragSource, connectDropTarget, id, onMove, ...props} = this.props;

        return connectDragSource(connectDropTarget(
            <li {...props}>{props.children}</li>
        ));
    }
}
